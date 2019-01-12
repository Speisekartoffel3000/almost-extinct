import React, { Component } from 'react';
import classnames from 'classnames';
import Sidebar from "react-sidebar";
import './style.css';

export default class InfoPanel extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false
    };
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }
 
  onSetSidebarOpen() {
    this.setState(prevState => ({
      sidebarOpen: !this.state.sidebarOpen
    }));

  }
 
  render() {
    return (
      <Sidebar
        sidebar={<b>Sidebar content</b>}
        open={this.state.sidebarOpen}
        onSetOpen={this.onSetSidebarOpen}
        styles={{ sidebar: { background: "red" } }}
      >

        <button onClick={() => this.onSetSidebarOpen(this.state.sidebarOpen ? true : false)}>
          Open sidebar
          {this.state.sidebarOpen ? 'ON' : 'OFF'}
        </button>
      </Sidebar>
    );
  }
}
 