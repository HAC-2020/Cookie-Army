import React from 'react';
import './CustomButton.scss';

export default function CustomButton({ children, ...otherProps }) {
  return (
    <button className="custom-btn" {...otherProps}>
      {children}
    </button>
  );
}
