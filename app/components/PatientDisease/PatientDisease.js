import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Patient = ({ patient }) => {
   const deceased = history.deathAge ? true : false;
   return (
     <div>
      <div>
        <label>Name:</label>
        <label>{`${history.name}`}</label>
      </div>
      <div>
        <label>Gender:</label>
        <label>{`${history.gender}`}</label>
      </div>
     </div>
     
   );
  }


Patient.propTypes = {
  patient: PropTypes.object,
};

export default Patient;
