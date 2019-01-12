// src/components/SelectMenu/index.js
import React, { Component } from "react";
import Select from "react-select";
import makeAnimated from "react-select/lib/animated";

import "./style.css";

import fishlist from "../data/fishlist.json";
const marinefish = "https://redlist.solid.community/public/marinefish/";

const fishies = fishlist.fishis.sort();
const value = [];
let fishArray = [];

for (let i = 0; i < fishies.length; i++) {
  value.push({ value: fishlist.fishis[i], label: fishlist.fishis[i] });
}

export default class SelectMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: " ",
      polygons: [],
      result: []
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount(selectedOption) {
    fetch(marinefish + "Abudefduf%20abdominalis.geojson")
      .then(res => res.json())
      .then(datageo => this.setState({ polygons: datageo }))
      .then(responseJson => {
        this.sendDataFunc(responseJson);
      });

    this.setState({ selectedOption });
  }

  handleChange = selectedOption => {
    this.setState({ selectedOption });

    for (var f = 0; f < selectedOption.length; f++) {
      fetch(marinefish + selectedOption[f]["value"] + ".geojson")
        .then(res => res.json())
        .then(datageo => this.setState({ polygons: datageo }))
        .then(responseJson => {
          this.sendDataFunc(responseJson);
        });
    }
  };

  sendDataFunc() {
    console.log(this.state.result);

    fishArray.push(this.state.polygons);
    console.log(`Option selected:`, this.state.selectedOption);

    // Create array results of unique Fish Objects
    const result = [];
    const map = new Map();
    const option = this.state.selectedOption;

    for (const item of fishArray) {
      if (!map.has(item.features[0].properties.binomial)) {
        if (option !== undefined) {
          for (var key in option) {
            var value = option[key].value;

            if (value.indexOf(item.features[0].properties.binomial) > -1) {
              map.set(item.features[0].properties.binomial, true); // set any value to Map
              result.push(item);
            }
          }
        }
      }
    }

    this.setState({ result: result });
    this.props.sendData(
      this.state.selectedOption,
      this.state.polygons,
      this.state.result
    );
  }

  render() {
    return (
      <Select
        closeMenuOnSelect={false}
        components={makeAnimated()}
        defaultValue={[value[0]]}
        isMulti
        options={value}
        inputValue={this.state.value}
        onInputChange={this.state.value}
        onChange={this.handleChange}
      />
    );
  }
}
