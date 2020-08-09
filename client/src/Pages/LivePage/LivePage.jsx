import React, { useState, useEffect, useRef } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Peer from 'peerjs';
import './LivePage.scss';
import StepSolver from '../../components/StepSolver/StepSolver';

let socket;
let myVideo;
let myVideoStream;
const peerObj = {};

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
  const [peers, setPeers] = useState('');
  const ENDPOINT = `localhost:3006`;
  const videoGrid = useRef(null);

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
    setPeers({ ...peers, [userId]: call });
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
    console.log(myVideoStream);
    if (mute) myVideoStream.getAudioTracks()[0].enabled = false;
    else myVideoStream.getAudioTracks()[0].enabled = true;
  };

  const toggleVideo = () => {
    setPlayVideo(!playVideo);
    if (!playVideo) myVideoStream.getVideoTracks()[0].enabled = false;
    else myVideoStream.getVideoTracks()[0].enabled = true;
  };

  return (
    <div className="live-page">
      <div className="grid-container">
        <div id="video-grid" ref={videoGrid}></div>
        <div className="control-bar">
          <button onClick={() => toggleMute()}>
            <i
              class={` ${
                mute ? 'fas fa-microphone-slash' : 'fas fa-microphone'
              }`}
            ></i>
          </button>
          <button onClick={() => toggleVideo()}>
            <i
              class={` ${playVideo ? 'fas fa-video' : 'fas fa-video-slash'}`}
            ></i>
          </button>
        </div>
      </div>
      <StepSolver />
    </div>
  );
}
