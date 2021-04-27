import React from 'react';
import './Unauthorized.scss';

const Unauthorized = () => (
  <div className="page-container unauthorized">
    <div className="page danger">
      <div className="page-content">
        <span className="toast-item-image toast-item-image-alert" />
        <div className="message">
          <span>You are not authorized to see this page.</span>
        </div>
      </div>
    </div>
  </div>
);

export default Unauthorized;
