import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import DetailedHistory from 'components/DetailedHistory'
import { getPatientHistory } from './actions';

import './style.scss';

class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.loginDoctor = this.loginDoctor.bind(this);
    this.loginPatient = this.loginPatient.bind(this);
  }

  loginDoctor() {
    const { dispatch } = this.props;
    const patientName = this.state.patientName;
    const doctorId = this.state.doctorId;

    dispatch(getPatientHistory(patientName, doctorId));
  }

  loginPatient() {
    const { dispatch } = this.props;
    const patientName = this.state.patientName;

    dispatch(getPatientHistory(patientName, patientName));
  }

  onPropChange(propName) {
    return (event) => {
      const state = { ...this.state };
      const newValue = event.target.value;
      state[propName] = newValue;

      this.setState(state);
    }
  }

  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
  }

  render() {
    return (
      <article>
        <Helmet>
          <title>#HashGene</title>
          <meta name="description" content="@HashGene" />
        </Helmet>
        <div className="home-page">
          <div>
            <label>Patient Name:</label>
            <input onChange={this.onPropChange('patientName')} type="text" name="patientName"/>
          </div>
          <div>
            <label>Doctor ID:</label>
            <input onChange={this.onPropChange('doctorId')} type="text" name="doctorId"/>
          </div>
          <div>
            <button onClick={this.loginPatient}>I am a Patient</button>
            <button onClick={this.loginDoctor}>I am a Doctor</button>
          </div>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  home: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  return {
    ...state
  };
}

export default connect(mapStateToProps)(HomePage);

