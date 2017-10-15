import React, { Component } from 'react';
import './news-list.css';
import RListView from '../../src/index';
import shortid from 'shortid';


export default class NewsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    }
  }
  componentDidMount() {
    fetch('list.json')
      .then(res => res.json())
      .then(res => {
        res.forEach(raw => raw.id = shortid.generate());
        this.setState({
          list: res
        })
      });
  }
  render() {
    const state = this.state;
    return (
      <div>
        <RListView
          height={window.innerHeight}
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