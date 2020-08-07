import React from 'react';
import './Header.scss';

export default function Header() {
  return (
    <div className="header">
      <div className="logo">
        Alpha<span className="highlight">Class</span>
      </div>
      <div className="class-icon">
        <i className="fas fa-chalkboard-teacher"></i>
      </div>
    </div>
  );
}
