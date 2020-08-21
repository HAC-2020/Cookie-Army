import React, { useEffect, useState } from 'react';
import firebase from '../../firebase/firebaseUtils';
import './Header.scss';
import { Link } from 'react-router-dom';

export default function Header() {
  const [showDropDown, setShowDropDown] = useState(false);
  const [urlList, setUrlList] = useState([]);
  let classList = [];
  useEffect(() => {
    const storageRef = firebase.storage().ref();
    // console.log('storageRef', storageRef);
    const videosRef = storageRef.child('videos');
    // console.log('videosRef', videosRef);
    videosRef.listAll().then((res) => {
      // console.log('res', res);
      res.items.forEach((el) => {
        el.getDownloadURL().then((url) => {
          // console.log(url);
          classList = [...classList, url];
          // console.log('classList', classList);
          setUrlList([...classList]);
        });
      });
    });
  }, []);
  return (
    <div className="header">
      <Link to="/">
        <div className="logo">
          Alpha<span className="highlight">Class</span>
        </div>
      </Link>
      <div className="class-icon">
        <i
          className="fas fa-chalkboard-teacher"
          onClick={() => setShowDropDown(!showDropDown)}
        ></i>
      </div>
      <div className={`dropdown ${showDropDown ? '' : 'hide'}`}>
        {urlList.map((url, idx) => (
          <a key={idx} href={url}>
            <div>Class {idx + 1}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
