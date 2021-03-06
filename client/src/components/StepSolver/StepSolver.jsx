import React, { useState, useRef } from 'react';
import { ReactComponent as Logo } from './logo.svg';
import './StepSolver.scss';
import CustomInput from '../CustomInput/CustomInput';
import CustomButton from '../CustomButton/CustomButton';
import axios from 'axios';
import $ from 'jquery';

export default function StepSolver() {
  const [solSrc, setSolSrc] = useState('');
  const [exp, setExp] = useState('');

  const solImg = useRef(null);

  const handleSubmit = async () => {
    const urlExp = encodeURIComponent(exp);
    const url = `https://alphaclass.herokuapp.com/solve?exp=${urlExp}`;
    const res = await axios.post(url);
    console.log(exp);
    // console.log(res.data);

    // let parser = new DOMParser();
    // let xmlDoc = parser.parseFromString(res.data, 'text/xml');
    // console.log(xmlDoc);

    // const resImage = xmlDoc.querySelector(
    //   '#Result > subpod:nth-child(2) > img'
    // );

    const jQXmlDoc = $.parseXML(res.data);
    console.log('jq', jQXmlDoc);
    const jImg = $(jQXmlDoc).find(
      "subpod[title='Possible intermediate steps'] img"
    );
    console.log('jimg', jImg.attr('src'));
    // console.log(resImage.getAttribute('src'));
    setSolSrc(jImg.attr('src'));
    // console.log(solImg);
    solImg.current.classList = [];

    // console.log(res.data.querySelector('body'));
  };

  return (
    <div className="step-solver">
      <div className="head">
        <div className="">Step By Step Problem Solver</div>
        <div className="power">
          powered by <Logo style={{ width: '15rem' }} />{' '}
        </div>
        <div className="input-container">
          <CustomInput onChange={(event) => setExp(event.target.value)} />
          <CustomButton onClick={() => handleSubmit()}>
            Get Solution
          </CustomButton>
        </div>
      </div>
      <div className="result">
        <img
          ref={solImg}
          src={solSrc}
          alt=""
          className={`${solSrc ? 'hide' : ''}`}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
