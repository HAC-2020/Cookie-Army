import React from 'react';
import './HomePage.scss';
import hero from './homeHero.svg';
import CustomButton from '../../components/CustomButton/CustomButton';
import CustomModal from '../../components/CustomModal/CustomModal';
import CustomInput from '../../components/CustomInput/CustomInput';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [name, setName] = useState('');
  const [classNo, setClassNo] = useState('');
  const [newClass, setNewClass] = useState('');
  return (
    <div className="home-page">
      <div className="hero">
        <div className="hero-text">
          <div className="hero-heading">
            Join ClassRooms, not <span className="strike">Meetings</span>
          </div>
          <div className="hero-subtext">
            Alpha Class is a virtual classroom, with features to give students a
            better learning experience during this pandemic. Features like live
            stream captioning, step by step problem solver, video streaming of
            previous lectures sets it apart from any other video conferencing
            app out there.
          </div>
          <div className="btn-container">
            <CustomButton onClick={() => setShowJoinModal(true)}>
              Join Class
            </CustomButton>
            <CustomButton
              onClick={() => {
                setNewClass(uuidv4());
                setShowCreateClassModal(true);
              }}
            >
              Host Class
            </CustomButton>
          </div>
        </div>
        <div className="image">
          <img src={hero} alt="" />
        </div>
      </div>

      {/*=========================== JOIN MODAL ===============================*/}

      <CustomModal showModal={showJoinModal} backdropClick={setShowJoinModal}>
        <h1>JOIN</h1>
        <div className="modal-content">
          Enter Name:{' '}
          <CustomInput onChange={(event) => setName(event.target.value)} />
        </div>
        <div className="modal-content">
          Enter Class code:{' '}
          <CustomInput onChange={(event) => setClassNo(event.target.value)} />{' '}
        </div>
        <Link
          onClick={(event) =>
            !name || !classNo ? event.preventDefault() : null
          }
          to={`/live?name=${name}&class=${classNo}`}
        >
          <CustomButton>Join Class</CustomButton>
        </Link>
      </CustomModal>

      {/*=========================== CREATE CLASS MODAL ===============================*/}
      <CustomModal
        showModal={showCreateClassModal}
        backdropClick={setShowCreateClassModal}
      >
        <h1>Create Class</h1>
        <div className="modal-content">Share this code:</div>
        <CustomInput
          id="copy-target"
          defaultValue={newClass}
          style={{ fontSize: '3rem', marginBottom: '2rem' }}
        />

        <Link
          onClick={(event) => (!newClass ? event.preventDefault() : null)}
          to={`/live?name=teacher&class=${newClass}`}
        >
          <CustomButton>Start Class</CustomButton>
        </Link>
      </CustomModal>
    </div>
  );
}
