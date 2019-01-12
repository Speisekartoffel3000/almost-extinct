// src/components/App/index.js
import React, { Component } from 'react';
import classnames from 'classnames';
import Map from '../Map'

import './style.scss';



class App extends Component {

    constructor(props) {

        super(props)
        this.state = {
          condition: this.props.condition
        }
    }

    render() {
        const { className } = this.props;
      
        return (
            <div className={classnames('App', className)}>
                <Map />
            </div>
        );
    }
}

export default App