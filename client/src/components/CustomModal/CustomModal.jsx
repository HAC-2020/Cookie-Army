import React, { Fragment } from 'react';
import './CustomModal.scss';

export default function CustomModal({ backdropClick, showModal, children }) {
  return (
    <Fragment>
      <div
        className={`backdrop ${showModal ? '' : 'hide'}`}
        onClick={() => backdropClick(false)}
      ></div>
      <div className={`modal ${showModal ? '' : 'hide'}`}>{children}</div>;
    </Fragment>
  );
}
