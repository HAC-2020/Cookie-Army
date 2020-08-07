import React from 'react';
import './HomePage.scss';
import hero from './homeHero.svg';
import CustomButton from '../../components/CustomButton/CustomButton';

export default function HomePage() {
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
            <CustomButton>Join Class</CustomButton>
            <CustomButton>Host Class</CustomButton>
          </div>
        </div>
        <div className="image">
          <img src={hero} alt="" />
        </div>
      </div>
    </div>
  );
}
