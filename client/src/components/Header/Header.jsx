import React, { useEffect, useState } from 'react';
import firebase from '../../firebase/firebaseUtils';
import './Header.scss';

export default function Header() {
  const [showDropDown, setShowDropDown] = useState(false);
  const [urlList, setUrlList] = useState([]);
  useEffect(() => {
    var storageRef = firebase.storage().ref();
    var videosRef = storageRef.child('videos');
    videosRef.listAll().then((res) => {
      res.items.forEach((el) => {
        el.getDownloadURL().then((url) => setUrlList([...urlList, url]));
      });
    });
  }, []);
  return (
    <div className="header">
      <div className="logo">
        Alpha<span className="highlight">Class</span>
      </div>
      <div className="class-icon">
        <i
          className="fas fa-chalkboard-teacher"
          onClick={() => setShowDropDown(!showDropDown)}
        ></i>
      </div>
      <div className={`dropdown ${showDropDown ? '' : 'hide'}`}>
        {urlList.map((url, idx) => (
          <a key={idx} href={url}>
            <div>Class {idx}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
