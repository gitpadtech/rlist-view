import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types'
import './rlist-view.css';

import before from './fn/before';

function isDragDown(prevY, curY) {
  return curY - prevY > 0;
}

function isIphone() {
  return /iphone/i.test(window.navigator.userAgent);
}

export class RListView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translateY: 0,
      transition: false,
      topPosition: 100,
      isLoadingMore: false
    };
    function disableRefreshBefore() {
      return !this.props.disableRefresh;
    }
    this.onTouchStart = before(disableRefreshBefore, this.onTouchStart).bind(this);

    this.onTouchMove = before(disableRefreshBefore, this.onTouchMove).bind(this);

    this.onTouchEnd = before(disableRefreshBefore, this.onTouchEnd).bind(this);

    this.onScroll = before(function() {
      return !this.props.disableInfiniteScroll;
    }, this.onScroll).bind(this);

    this.startYPos = 0;
    this.prevYPos = 0;
    this.rootDom = null;
    this.refreshDom = null;
    this.scrollTarget = null;
    this.isRefreshing = true;
    this.isPulling = false;
  }
  componentDidMount() {
    this.rootDom.addEventListener('touchmove', this.onTouchMove, false);

    // move out viewport
    this.setState({
      topPosition: -this.refreshDom.clientHeight
    });
    // init refresh
    this.refresh(false);

    if (this.props.useWindowScroll) {
      this.listendScroll(window);
    } else {
      this.listendScroll(this.rootDom);
    }
  }
  onTouchStart(e) {
    this.startYPos = this.prevYPos = e.touches[0].pageY;
  }
  onTouchMove(e) {
    // do noting when is refreshing
    if (this.isRefreshing) return;
    
    const curYpos = e.touches[0].pageY;
    const scrollTop = this.rootDom.scrollTop

    if (
      (scrollTop === 0 && isDragDown(this.prevYPos, curYpos)) || this.isPulling
    ) {
      e.preventDefault();
      this.setState({
        translateY: this.calcDistance(curYpos - this.startYPos),
        transition: false
      });
      this.isPulling = true;
    }
    this.prevYPos = curYpos
  }
  onTouchEnd() {
    if (this.isRefreshing) return;
    if (this.shouldRefresh) {
      this.refresh();
    } else {
      this.resetPosition();
    }
    this.isPulling = false;
  }
  onScroll() {
    const state = this.state;
    const props = this.props;
    if (state.isLoadingMore) return;
    if (this.arriveBottom()) {
      this.setState({
        isLoadingMore: true
      });
      props.loadMore()
        .then(() => this.setState({
          isLoadingMore: false
        }));
    }
  }
  arriveBottom() {
    const props = this.props;
    const target = this.scrollTarget;
    const visibleHeight = props.useWindowScroll ? window.innerHeight : target.clientHeight;
    const scrollTop = props.useWindowScroll ? window.pageYOffset : target.scrollTop;
    const scrollHeight = props.useWindowScroll ? document.documentElement.scrollHeight : target.scrollHeight;
    return (scrollHeight - (scrollTop + visibleHeight) <= props.threshold);
  }
  calcDistance(distance) {
    return distance / 3;
  }
  get shouldRefresh() {
    return this.state.translateY >= this.refreshDom.clientHeight;
  }
  get progress() {
    if (this.refreshDom) {
      return Math.min(this.state.translateY / this.refreshDom.clientHeight * 100, 100)
    }
    return 0;
  }
  refresh(transition = true) {
    const props = this.props;
    this.setState({
      translateY: this.refreshDom.clientHeight,
      transition
    });

    this.isRefreshing = true;
    props
      .refresh()
      .then(() => {
        this.resetPosition();
        this.isRefreshing = false;
      });
  }
  resetPosition() {
    this.setState({
      translateY: 0,
      transition: true
    });
  }
  listendScroll(target) {
    this.scrollTarget = target;
    target.addEventListener('scroll', this.onScroll);
  }
  render() {
    const props = this.props;
    const state = this.state;
    return (
      <div
        className={classNames('rlist-view-component', {
          // TODO: remove in future
          // 'ios-local-scroll-fix': isIphone()
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
            'ease-out-transion': state.transition,
            // show refresh component when not scroll bouncing
            active: state.translateY > 0,
          })}
          style={{
            transform: `translateY(${state.translateY}px)`,
            WebkitTransform: `translateY(${state.translateY}px)`,
            top: `${state.topPosition}px`
          }}
        >
          {
            props.disableRefresh ? null :
              React.createElement(props.refreshComponent, {
                isRefreshing: this.isRefreshing,
                progress: this.progress
              })
          }
        </div>

        <div
          className={classNames('rlist-view-component__content', {
            'ease-out-transion': state.transition
          })}
          style={{
            transform: `translateY(${state.translateY}px)`,
            WebkitTransform: `translateY(${state.translateY}px)`
          }}
        >
          { props.children }
          {
            state.isLoadingMore ? React.createElement(props.loadMoreComponent) : null
          }
        </div>
      </div>
    );
  }
}

RListView.defaultProps = {
  threshold: 10,
  useWindowScroll: false,
  disableInfiniteScroll: false,
  disableRefresh: false,
  refresh: () => Promise.resolve(),
  loadMore: () => Promise.resolve(),
};

RListView.propTypes = {
  height: PropTypes.string.isRequired,
  refresh: PropTypes.func,
  loadMore: PropTypes.func,
  refreshComponent: PropTypes.func.isRequired,
  loadMoreComponent: PropTypes.func.isRequired,
  threshold: PropTypes.number,
  useWindowScroll: PropTypes.bool,
  disableInfiniteScroll: PropTypes.bool,
  disableRefresh: PropTypes.bool
}