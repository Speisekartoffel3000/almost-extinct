// src/components/Map/index.js
import React, { Component } from "react";
import classnames from "classnames";
import ReactMapboxGl, { GeoJSONLayer } from "react-mapbox-gl";
import "./style.css";

import InfoPanel from "../Sidebar";
import SelectMenu from "../SelectMenu";

const randomColor =
  "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);

const circleLayout = { visibility: "visible" };
const circlePaint = {
  "fill-extrusion-color": randomColor,
  "fill-extrusion-height": {
    property: "shape_Leng",
    type: "identity"
  },
  "fill-extrusion-base": {
    property: "0",
    type: "identity"
  },
  "fill-extrusion-height-transition": {
    duration: 2000,
    delay: 0
  },
  "fill-extrusion-opacity": 0.5
};

export default class Map extends Component {
  state = {
    geoData: [],
    center: [153.603, -32.654],
    val: [],
    id: {}
  };

  onClickCircle = ev => {
    console.log(ev);
  };

  getData = (value, polygons, result) => {
    //  set states for selected values and polygons
    this.setState({
      polygons: polygons,
      value: value,
      result: result
    });
    for (let i in this.state.polygons["features"]) {
      var cords = this.state.polygons["features"][i]["geometry"][
        "coordinates"
      ][0][0][0];
    }
    this.setState({ flyTo: { center: cords, zoom: 3, speed: 0.4 } });
  };
  geoData() {
    const dataResults = this.state.result;
    return (
      <div>
        {dataResults.map((station, i) => (
          <GeoJSONLayer
            data={station}
            key={i}
            type="fill-extrusion"
            fillExtrusionLayout={circleLayout}
            fillExtrusionPaint={circlePaint}
            fillExtrusionOnClick={this.onClickCircle}
          />
        ))}
      </div>
    );
  }
  mapBox = () => {
    const Map = ReactMapboxGl({
      accessToken:
        "pk.eyJ1IjoiYW5uYS0tLS0tLSIsImEiOiJjajdsOWJ1MWEybG0wMzJucDk3MG4xN3NpIn0.M6tsjI8KHpiO3EIJBKXpmA"
    });
    if (typeof this.state.result === "undefined") {
    } else {
      const map = (
        <Map
          style="mapbox://styles/anna------/cjmeo3f8s5l6o2rnyp78eb3wl"
          zoom={[2.1]}
          center={this.state.center}
          onStyleLoad={map => {
            map.flyTo(this.state.flyTo);
          }}
        >
          {this.geoData()}
        </Map>
      );
      return map;
    }
  };

  render() {
    const { className } = this.props;

    return (
      <div className={classnames("Map", className)}>
        <InfoPanel />
        <SelectMenu sendData={this.getData} />

        <h1>Redlist</h1>

        {this.mapBox()}
      </div>
    );
  }
}
