import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './spinner-refresh.css';

export class SpinnerRefresh extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const props = this.props;
    return (
      <div
        className="spinner-refresh"
      >
        <div
          className="spinner-refresh__is-refreshing"
          style={{
            display: props.isRefreshing ? 'block' : 'none'
          }}
        >
          正在刷新...
        </div>
        {props.progress}%
      </div>
    );
  }
}

SpinnerRefresh.defaultProps = {

};

SpinnerRefresh.propTypes = {
  isRefreshing: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
};
