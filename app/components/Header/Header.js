import React from 'react';
import { Link } from 'react-router-dom';
import Banner from './images/banner.jpg';
import './style.scss';

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="header">
        <div className="nav-bar">
          <Link className="router-link" to="/patientHistory">
            Patient History
          </Link>
          <Link className="router-link" to="/fullHistory">
            Full History
          </Link>
        </div>
      </div>
    );
  }
}

export default Header;
