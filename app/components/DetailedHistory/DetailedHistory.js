import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const renderPatient = (patient) => {
   if (!patient) {
      return null;
   }

   const family = patient.family;
   const father = family && family.father ? <div>
         <label>Father:</label>
         <label>{`${family.father}`}</label>
      </div> : null;
   const mother = family && family.mother ? <div>
      <label>Mother:</label>
      <label>{`${family.mother}`}</label>
      </div> : null;
   const children = family && family.children ? family.children.map((child) => (<div key={`${child}`}>
      <label>Children:</label>
      <label>{`${child}`}</label>
   </div>)) : null;

   const deceased = history.deathAge ? true : false;

   return (
     <div key={`${patient.name}`}>
      <div>
        <label>Name:</label>
        <label>{`${patient.name}`}</label>
      </div>
      <div>
        <label>Gender:</label>
        <label>{`${patient.gender}`}</label>
      </div>
      {father}
      {mother}
      {children}
      <label>&nbsp;</label>
     </div>
   );
}

const DetailedHistory = ({ history }) => {

   return (<div>
      <div>
         <label>Primary Patient</label>
         <hr />
         {renderPatient(history)}
      </div>
      <div>
         <label>Family Medical History</label>
         <hr />
         {Object.keys(history.history).map((patient) => renderPatient(history.history[patient]))}
      </div>
   </div>);
}


DetailedHistory.propTypes = {
  history: PropTypes.object,
};

export default DetailedHistory;
