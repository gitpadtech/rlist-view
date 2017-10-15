import React, { Component } from 'react';
import './refresh-component.css';

export default class RefreshComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="refresh-component"
      >
        下拉刷新<br />
        放开手
      </div>
    );
  }
}