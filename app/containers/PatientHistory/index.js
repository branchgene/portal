import React from 'react';
import Graph from 'react-graph-vis';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { enableDoctor, disableDoctor } from './actions';

import './style.scss';

function getColor(patientData) {
  if (patientData.deathAge) {
    return '#ABB2B9';
  } else if (patientData.diseases && patientData.diseases.length) {
    return '#F1948A';
  }

  return '#7DCEA0';
}

function transformData(patientData) {
  const { history } = patientData;

  const nodes = [{
    id: `${patientData.id}`,
    label: `${patientData.name}${patientData.deathAge ? ' (D)' : ''}`,
    color: getColor(patientData),
  }];
  const edges = [
  ];

  if (patientData.family) {
    if (patientData.family.father) {
      edges.push({
        from: `${patientData.id}`,
        to: `${patientData.family.father}`,
        label: 'father',
        smooth: true,
      });
    }
    if (patientData.family.mother) {
      edges.push({
        from: `${patientData.id}`,
        to: `${patientData.family.mother}`,
        label: 'mother',
        smooth: true,
      });
    }
    if (patientData.family.children) {
      patientData.family.children.forEach((child) => {
        edges.push({
          from: `${patientData.id}`,
          to: `${child}`,
          label: 'child',
          smooth: true,
        });
      });
    }
    if (patientData.family.siblings) {
      patientData.family.siblings.forEach((sibling) => {
        edges.push({
          from: `${patientData.id}`,
          to: `${sibling}`,
          label: 'sibling',
          smooth: true,
        });
      });
    }
  }

  if (history) {
    Object.keys(history).forEach((personKey) => {
      const person = history[personKey];

      nodes.push({
        id: `${person.id}`,
        label: `${person.name}${person.deathAge ? ' (D)' : ''}`,
        color: getColor(person),
      });

      if (person.family) {
        if (person.family.father) {
          edges.push({
            from: `${person.id}`,
            to: `${person.family.father}`,
            label: 'father',
            smooth: true,
          });
        }
        if (person.family.mother) {
          edges.push({
            from: `${person.id}`,
            to: `${person.family.mother}`,
            label: 'mother',
            smooth: true,
          });
        }
        if (person.family.children) {
          person.family.children.forEach((child) => {
            edges.push({
              from: `${person.id}`,
              to: `${child}`,
              label: 'child',
              smooth: true,
            });
          });
        }
        if (person.family.siblings) {
          person.family.siblings.forEach((sibling) => {
            edges.push({
              from: `${person.id}`,
              to: `${sibling}`,
              label: 'sibling',
              smooth: true,
            });
          });
        }

      }
    });
  }
  return { nodes, edges };
}

class PatientHistory extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.state = {
      selectedNode: null,
    };
    this.handleEnableDoctor = this.handleEnableDoctor.bind(this);
    this.handleDisableDoctor = this.handleDisableDoctor.bind(this);
    this.handleNodeSelect = this.handleNodeSelect.bind(this);
  }

  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
  }

  handleEnableDoctor() {
    const { dispatch, patientHistory } = this.props;
    const doctorId = this.state.doctorId;

    const patientName = patientHistory.requester;

    dispatch(enableDoctor(patientName, doctorId));
  }

  handleDisableDoctor() {
    const { dispatch, patientHistory } = this.props;
    const doctorId = this.state.doctorId;

    const patientName = patientHistory.requester;

    dispatch(disableDoctor(patientName, doctorId));
  }

  handleNodeSelect() {
    return (event) => {
      const { nodes, edges } = event;
      const state = {
        ...this.state,
      };

      if (nodes.length === 1) {
        state.selectedNode = nodes[0];
        this.setState(state);
      } else {
        state.selectedNode = null;
        this.setState(state);
      }
    }
  }

  onPropChange(propName) {
    return (event) => {
      const state = { ...this.state };
      const newValue = event.target.value;
      state[propName] = newValue;

      this.setState(state);
    }
  }

  render() {
    const {
      loading,
      dispatch,
      patientHistory,
    } = this.props;
    const selectedNode = this.state.selectedNode;

    console.log(selectedNode);

    if (!patientHistory || !patientHistory.patientData) {
      return (
        <article>
          <h2>Please login.</h2>
        </article>
      );
    }

    const historyData = patientHistory.patientData;
    let historyTitle = `Family History: ${historyData.name}`;
    if (historyData.deathAge) {
      historyTitle = `${historyTitle} (deceased - age ${historyData.deathAge})`;
    }

    let doctors;
    if (patientHistory.requester === historyData.name) {
      doctors = (
        <section>
          <h3>Doctors</h3>
          <div>
            <label>Doctor ID:</label>
            <input onChange={this.onPropChange('doctorId')} type="text" name="doctorId"/>
            <button onClick={this.handleEnableDoctor}>Enable!</button>
            <button onClick={this.handleDisableDoctor}>Disable!</button>
          </div>
        </section>
      );
    }

    let nodeInfo;
    if (selectedNode) {
      let selectedNodeData;
      if (selectedNode === historyData.name) {
        selectedNodeData = historyData;
      } else {
        selectedNodeData = historyData.history[selectedNode];
      }

      let deceased = '';
      if (selectedNodeData.deathAge) {
        deceased = ` - Deceased (${selectedNodeData.deathAge})`;
      }
      nodeInfo = (
        <div style={{ width: "100%" }}>
          <table>
          <tbody>
          <tr>
            <td colSpan="2" align="center">{`${selectedNodeData.name}${deceased}`}</td>
          </tr>
          <tr>
            <td>Gender:</td>
            <td>{`${selectedNodeData.gender}`}</td>
          </tr>
          {selectedNodeData.diseases && selectedNodeData.diseases.map((disease) => (
            <tr key={`${disease.name}`}>
              <td>{`${disease.name}`}</td>
              <td>{`Onset: ${disease.onsetAge}`}</td>
            </tr>
          ))}
          </tbody>
          </table>
        </div>
      );
    }

    const graph = transformData(historyData);
    const graphOptions = {
      layout: {
        hierarchical: false,
      },
      physics: {
        maxVelocity: 20,
      },
      edges: {
        color: '#000000',
      },
    };

    const graphEvents = {
      select: this.handleNodeSelect(),
    }

    return (
        <div className="home-page">
          <div className="centered">
            <h2>{`${historyTitle}`}</h2>
          </div>
          {doctors}
          <hr />
          {nodeInfo}
          <hr />
          <div>
            <h3>My History</h3>
            <div style={{ width: "100%" }}>
              <Graph graph={graph} options={graphOptions} events={graphEvents} style={{ width: "1024px", height: "1024px" }} />
            </div>
          </div>
        </div>
    );
  }
}

PatientHistory.propTypes = {
  dispatch: PropTypes.func,
  patientHistory: PropTypes.object,
};

function mapStateToProps(state, ownProps) {
  return {
    patientHistory: state.home ? state.home.historyData : null,
    ...state,
  };
}

export default connect(mapStateToProps)(PatientHistory);
