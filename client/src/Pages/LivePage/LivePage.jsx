import React, { useState, useEffect, useRef } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Peer from 'peerjs';
import './LivePage.scss';
import StepSolver from '../../components/StepSolver/StepSolver';
import firebase from '../../firebase/firebaseUtils';
import { v4 as uuidV4 } from 'uuid';

let socket;
let myVideo;
let myVideoStream;
const peerObj = {};
let mediaRecorder;
let chunks = [];

// let users = {};

const addVideoStream = (video, stream, videoGrid) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.current.append(video);
};

export default function LivePage({ location }) {
  const [nameState, setName] = useState('');
  const [classNoState, setClassNo] = useState('');
  const [mute, setMute] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  // const [peers, setPeers] = useState('');
  const ENDPOINT = `/`;
  const videoGrid = useRef(null);
  const [recState, setRecState] = useState(false);

  const connectToNewUser = (myPeer, userId, stream, videoGrid) => {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');

    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream, videoGrid);
    });

    call.on('close', () => {
      video.remove();
    });

    // console.log(userId, call);
    // setPeers({ ...peers, [userId]: call });
    peerObj[userId] = call;
    console.log(peerObj);
  };

  useEffect(() => {
    const { name, classNo } = queryString.parse(location.search);
    setName(name);
    setClassNo(classNo);
    socket = io(ENDPOINT);

    const myPeer = new Peer(undefined, {
      path: 'peerjs',
      host: '/',
      port: 3006,
    });

    myPeer.on('open', (id) => {
      socket.emit('join-class', classNo, id);
    });

    socket.on('user-disconnected', (userId) => {
      console.log(userId, 'disconnect');
      console.log(peerObj);
      if (peerObj[userId]) peerObj[userId].close();
    });

    myVideo = document.createElement('video');
    myVideo.muted = true;

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        myVideoStream = stream;
        mediaRecorder = new MediaRecorder(myVideoStream);
        myVideoStream.getAudioTracks()[0].enabled = false;
        addVideoStream(myVideo, stream, videoGrid);

        myPeer.on('call', (call) => {
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream, videoGrid);
          });
        });

        socket.on('user-connected', (userId) => {
          connectToNewUser(myPeer, userId, stream, videoGrid);
        });
      });
  }, [ENDPOINT, Location.search]);

  const toggleMute = () => {
    setMute(!mute);
    console.log(myVideoStream, myVideoStream.getAudioTracks()[0]);
    if (mute) myVideoStream.getAudioTracks()[0].enabled = false;
    else myVideoStream.getAudioTracks()[0].enabled = true;
  };

  const toggleVideo = () => {
    setPlayVideo(!playVideo);
    console.log(myVideoStream, myVideoStream.getVideoTracks()[0]);
    if (!playVideo) myVideoStream.getVideoTracks()[0].enabled = false;
    else myVideoStream.getVideoTracks()[0].enabled = true;
  };

  const toggleRecording = () => {
    setRecState(!recState);

    if (!recState) {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
    } else {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
    }

    mediaRecorder.ondataavailable = function (event) {
      chunks.push(event.data);
    };
    mediaRecorder.onstop = (event) => {
      let blob = new Blob(chunks, { type: 'video/mp4;' });
      let videoUrl = window.URL.createObjectURL(blob);
      // const recVideo = document.createElement('video');
      // recVideo.src = videoUrl;
      // recVideo.controls = true;
      // videoGrid.current.append(recVideo);
      var storageRef = firebase.storage().ref();
      var videosRef = storageRef.child(`videos/${uuidV4()}`);
      var file = blob;
      videosRef.put(file).then(function (snapshot) {
        alert('recording uploaded');
      });
    };
  };

  return (
    <div className="live-page">
      <div className="grid-container">
        <div id="video-grid" ref={videoGrid}></div>
        <div className="control-bar">
          <button onClick={() => toggleMute()}>
            <i
              className={` ${
                mute ? 'fas fa-microphone-slash' : 'fas fa-microphone'
              }`}
            ></i>
          </button>
          <button onClick={() => toggleVideo()}>
            <i
              className={` ${
                playVideo ? 'fas fa-video' : 'fas fa-video-slash'
              }`}
            ></i>
          </button>
          <button onClick={() => toggleRecording()}>
            {' '}
            {`${recState ? '\u25A0' + 'Recording' : '\u25B6Record'}`}{' '}
          </button>
        </div>
      </div>
      <StepSolver />
    </div>
  );
}
