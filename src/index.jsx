import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './index.css';

function preventWebviewBounceScrolling() {
  // const root = document.documentElement;
  
  // let prevY = 0;
  // root.addEventListener('touchstart', function(e) {
  //   prevY = e.touches[0].pageY;
  // });
  // root.addEventListener('touchmove', function(e) {
    // const scrollTop = window.pageYOffset ||
    //   document.documentElement.scrollTop ||
    //   document.body.scrollTop || 0;;
    // const curY = e.touches[0].pageY;
    // // drap up
    // if (curY - prevY < 0) {
    //   prevY = curY;
    //   return;
    // }
    
    // if (scrollTop <= 1) {
    //   console.log(e.currentTarget, scrollTop);
    //   e.preventDefault();
    //   // document.body.innerText = scrollTop;
    //   return ;
    // }
    // prevY = curY;
  // }, { passive: false });
}
function isDragDown(prevY, curY) {
  return curY - prevY > 0;
}

export default class RListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translateY: 0,
    };
    // bind this
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    
    this.startYPos = 0;
    this.prevYPos = 0;
    this.rootDom = null;
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
    this.setState({
      translateY: 0
    })
  }
  calcDistance(distance) {
    return distance / 3;
  }
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div
        className="rlist-view-component"
        style={{
          height: props.height,
          transform: `translateY(${state.translateY}px)`
        }}
        ref={ref => this.rootDom = ref}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
      >
        { props.children }
      </div>
    );
  }
}

RListView.defaultProps = {
};

RListView.propTypes = {
  height: PropTypes.number.isRequired,
}