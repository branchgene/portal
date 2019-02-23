import React from 'react';

import './style.scss';

export default class PatientHistory extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
  }

  render() {
    const {
      loading
    } = this.props;

    const sarah = (
      <div class="familyTree">

      </div>
    );

    return (
      <article>
        <div className="home-page">
          <section className="centered">
            <h2>Sarah</h2>
          </section>
          <section>
          </section>
        </div>
      </article>
    );
  }
}

PatientHistory.propTypes = {
  loading: PropTypes.bool,
};

