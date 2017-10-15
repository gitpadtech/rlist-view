import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types'
import './index.css';
import RefreshComponent from './refresh-component';

function isDragDown(prevY, curY) {
  return curY - prevY > 0;
}

function isIphone() {
  return /iphone/i.test(window.navigator.userAgent);
}

export default class RListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translateY: 0,
      transition: false,
    };
    // bind this
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    
    this.startYPos = 0;
    this.prevYPos = 0;
    this.rootDom = null;
    this.refreshDom = null;
  }
  componentDidMount() {
    this.rootDom.addEventListener('touchmove', this.onTouchMove, false);
  }
  onTouchStart(e) {
    this.startYPos = this.prevYPos = e.touches[0].pageY;
  }
  onTouchMove(e) {
    const curYpos = e.touches[0].pageY;
    const scrollTop = this.rootDom.scrollTop

    if (scrollTop === 0 && isDragDown(this.prevYPos, curYpos)) {
      e.preventDefault();
      this.setState({
        translateY: this.calcDistance(curYpos - this.startYPos)
      });
    }

    this.prevYPos = curYpos
  }
  onTouchEnd() {
    if (this.shouldRefresh()) {
      this.setState({
        translateY: this.refreshDom.clientHeight,
        transition: true
      });
    } else {
      this.setState({
        translateY: 0,
        transition: true
      });
    }
  }
  calcDistance(distance) {
    return distance / 3;
  }
  shouldRefresh() {
    return this.state.translateY >= this.refreshDom.clientHeight;
  }
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div
        className={classNames('rlist-view-component', {
          'ios-local-scroll-fix': isIphone()
        })}
        style={{
          height: props.height
        }}
        ref={ref => this.rootDom = ref}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
      >
        <div
          ref={ref => this.refreshDom = ref}
          className={classNames('rlist-view-component__refresh', {
            'ease-out-transion': state.transition
          })}
          style={{
            transform: `translate3d(0,0${state.translateY}px,0)`,
            top: this.refreshDom ? -this.refreshDom.clientHeight : 0
          }}
        >
          { props.refreshComponent }
        </div>

        <div
          className={classNames('rlist-view-component__content', {
            'ease-out-transion': state.transition
          })}
          style={{
            transform: `translate3d(0,0${state.translateY}px,0)`
          }}
        >
          { props.children }
        </div>


      </div>
    );
  }
}

RListView.defaultProps = {
  refreshComponent: <RefreshComponent />
};

RListView.propTypes = {
  height: PropTypes.number.isRequired,
  refreshComponent: PropTypes.element
}