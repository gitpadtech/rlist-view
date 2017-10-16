import React, { Component } from 'react';
import './news-list.css';
import RListView, { SpinnerRefresh } from '../../src/index';
import moduleName from '../../src/';
import shortid from 'shortid';

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
    this.refresh = this.refresh.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }
  componentDidMount() {
  }
  fetch() {
    return fetch('list.json')
    .then(res => res.json());
  }
  refresh() {
    return this.fetch()
      .then(res => {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(res), 1000);
        });
      })
      .then(res => {
        res.forEach(raw => raw.id = shortid.generate());
        this.setState({
          list: shuffle(res)
        });
      });
  }
  loadMore() {
    return this.fetch()
      .then(res => {
        return new Promise((resolve, reject) => {
          setTimeout(() => resolve(res), 1000);
        });
      })
      .then(res => {
        res.forEach(raw => raw.id = shortid.generate());
        this.setState({
          list: this.state.list.concat(shuffle(res))
        });
      });
  }
  render() {
    const state = this.state;
    return (
      <div>
        <RListView
          refreshComponent={SpinnerRefresh}
          height={window.innerHeight}
          refresh={this.refresh}
          loadMore={this.loadMore}
        >
          {
            state.list.map(item =>
              <div className="news-item" key={item.id}>
                <h4 className="news-item__title">{item.title}</h4>
                <div className="news-item__content">{item.content}</div>
              </div>
            )
          }
        </RListView>
      </div>
    );
  }
}