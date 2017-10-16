import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './spinner-refresh.css';

export class SpinnerRefresh extends Component {
  constructor(props) {
    super(props);
  }
  conditionRender() {
    const props = this.props;

    if (props.isRefreshing) {
      return (
        <div
          className="spinner-refresh__animation"
        >
          <div className="spinner-refresh__loader" />
        </div>
      );
    }
    return (
      <div className="spinner-refresh__text">
        { props.progress >= 100 ? '松手更新...' : '下拉更新...' }
      </div>
    )
  }
  render() {
    const props = this.props;
    return (
      <div
        className="spinner-refresh"
      >
        {
          this.conditionRender()
        }
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
