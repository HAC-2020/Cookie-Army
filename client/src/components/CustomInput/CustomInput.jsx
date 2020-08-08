import React from 'react';
import './CustomInput.scss';

export default function CustomInput({ ...otherProps }) {
  return <input className="custom-input" type="text" {...otherProps} />;
}
