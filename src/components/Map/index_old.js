// src/components/Map/index.js
import React, { Component } from "react";
import classnames from "classnames";
import ReactMapboxGl, {
  Layer,
  Feature,
  GeoJSONLayer,
  Popup
} from "react-mapbox-gl";
import "./style.css";
import InfoPanel from "../Sidebar";
import SelectMenu from "../SelectMenu";

const API =
  "http://apiv3.iucnredlist.org/api/v3/species/countries/name/Loxodonta%20africana?token=9bb4facb6d23f48efbf424bb05c0c1ef1cf6f468393bc745d42179ac4aca5fee";

const vesselsAPI_1 = "http://localhost:9000/gh";
const vesselsAPI_2 =
  "https://redlist.solid.community/public/marinefish/Cirrhilabrus%20bathyphilus.geojson";

const circleLayout = { visibility: "visible" };
const circlePaint = {
  "fill-color": "#bc0146",
  "fill-opacity": 1
};

const list = [];
const list2 = [];
const featureList = [];
const vesselList_lat = [];
const vesselList_lon = [];
const vesselList = [];
const test = [];
const anotherList = [];
const coordinates = [];

export default class Map extends Component {
  // state: { selected: '' };
  handleSelect = langValue => {
    this.setState({ language: langValue });
  };

  constructor(props) {
    super(props);
    this.state = {
      test: [],
      polygons: [],
      vessels: [],
      fish: ""
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    // Get data from Redlist API
    fetch(API)
      .then(res => res.json())
      .then(data => this.setState({ test: data }));

    // Get data from local test JSON
    fetch(vesselsAPI_2)
      .then(res => res.json())
      .then(datageo => this.setState({ polygons: datageo }));

    // Get data from vessels API
    fetch(vesselsAPI_1)
      .then(res => res.json())
      .then(data_vessel => this.setState({ vessels: data_vessel }));

    fetch(vesselsAPI_2)
      .then(res => res.json())
      .then(data_marinefish => this.setState({ fish: data_marinefish }));
  }

  onClickCircle(ev) {
    console.log(ev);
  }

  FeatureList() {
    console.log(this.state.fish);
    // get List of Coordinates to display in Heatmap Layer
    for (const prop in this.state.polygons["features"]) {
      list.push(
        this.state.polygons["features"][prop]["geometry"]["coordinates"]
      );
    }
    for (const item in list) {
      for (const t in Object.values(list[0][item])) {
        for (const i in Object.values(list[0][item][t])) {
          list2.push(Object.values(list[0][item][t][i]));

          featureList.push(
            <Feature
              key={list[0][item][t][i]}
              coordinates={list[0][item][t][i]}
            />
          );
        }
      }
    }
    return featureList;
  }

  Vessels() {
    const renObjData = this.state.vessels.map(function(data, idx) {
      const vesselsId = data.mmsi;
      anotherList.push(vesselsId);
      return data;
    });

    var duplicates = anotherList.reduce(function(acc, el, i, arr) {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el);
      return acc;
    }, []);

    console.log(duplicates);
    console.log(renObjData);

    const dupObje = renObjData.map(function(duplicates, i) {
      const vesselsId = renObjData[i].mmsi;
      const vessel_lat = renObjData[i].lat_bin / 10;
      const vessel_lon = renObjData[i].lon_bin / 10;

      if (Object.is(vesselsId, duplicates.mmsi)) {
        vesselList_lat.push(vessel_lat);
        vesselList_lon.push(vessel_lon);
        test.push([vessel_lat, vessel_lon]);

        // console.log(getRandomColor());

        vesselList.push(
          <Feature
            key={i}
            coordinates={[vesselList_lon[i], vesselList_lat[i]]}
          />
        );

        coordinates.push(
          <Popup
            coordinates={[vesselList_lon[i], vesselList_lat[i]]}
            offset={{
              "bottom-left": [12, -38],
              bottom: [0, -38],
              "bottom-right": [-12, -38]
            }}
          >
            <h1>Popup</h1>
          </Popup>
        );
      }
    });
    return vesselList;
  }

  handleChange(event) {
    this.setState({ event });
    console.log(`Option selected:`, event);
  }

  handleSubmit(event) {
    this.setState({ value: event.target.value });
    alert("A name was submitted: " + this.state.value);
    event.preventDefault();
  }

  getData(val) {
    // do not forget to bind getData in constructor
    console.log(val);
  }

  render() {
    const { className } = this.props;
    const Map = ReactMapboxGl({
      accessToken:
        "pk.eyJ1IjoiYW5uYS0tLS0tLSIsImEiOiJjajdsOWJ1MWEybG0wMzJucDk3MG4xN3NpIn0.M6tsjI8KHpiO3EIJBKXpmA"
    });
    const zoom = [4.1];

    console.log(vesselList);
    console.log([coordinates]);

    return (
      <div className={classnames("Map", className)}>
        <InfoPanel />
        <SelectMenu sendData={this.getData} />

        <h1>
          Redlist
          <span>{this.state.test.name}</span>
          <span>{this.state.test.count}</span>
        </h1>

        <Map
          style="mapbox://styles/anna------/cjmeo3f8s5l6o2rnyp78eb3wl"
          zoom={zoom}
          center={[153.603, -32.654]}
        >
          <Layer
          // type='heatmap'

          // paint={{
          //     'heatmap-weight': {
          //         property: 'priceIndicator',
          //         type: 'exponential',
          //         stops: [[0, 0], [5, 2]]
          //     },
          //     // increase intensity as zoom level increases
          //     'heatmap-intensity': {
          //       stops: [[0, 0], [5, 1.2]]
          //     },
          //     // assign color values be applied to points depending on their density
          //     'heatmap-color': [
          //       'interpolate',
          //       ['linear'],
          //       ['heatmap-density'],
          //       0,
          //       'rgba(33,102,172,0)',
          //       0.25,
          //       'rgb(103,169,207)',
          //       0.5,
          //       'rgb(209,229,240)',
          //       0.8,
          //       'rgb(253,219,199)',
          //       1,
          //       'rgb(239,138,98)',
          //       2,
          //       'rgb(178,24,43)'
          //     ],
          //     // increase radius as zoom increases
          //     'heatmap-radius': {
          //         stops: [[0, 1], [5, 50]]
          //     },
          //     // decrease opacity to transition into the circle layer
          //     'heatmap-opacity': {
          //       default: 1,
          //       stops: [
          //         [14, 1],
          //         [15, 1]
          //       ]
          //     }}}
          >
            {
              //this.FeatureList()
            }
          </Layer>

          <Layer
            // blurry dots
            id="test"
            type="circle"
            //   paint= {{
            //      'fill-extrusion-color': '#aaa',

            //     // use an 'interpolate' expression to add a smooth transition effect to the
            //     // buildings as the user zooms in
            //     'fill-extrusion-height': [
            //         "interpolate", ["linear"], ["zoom"],
            //         15, 0,
            //         15.05, ["get", "height"]
            //     ],
            //     'fill-extrusion-base': [
            //         "interpolate", ["linear"], ["zoom"],
            //         15, 0,
            //         15.05, ["get", "min_height"]
            //     ],
            //     'fill-extrusion-opacity': .6
            // }}
            paint={{
              "circle-color": "#bc0146",

              "circle-opacity": 1,
              "circle-blur": 10,
              "circle-stroke-width": 10,
              "circle-stroke-color": "#f1373d",
              "circle-stroke-opacity": 0.4
            }}
          >
            {this.FeatureList()}
          </Layer>

          <GeoJSONLayer
            data={this.state.polygons}
            type="fill-extrusion"
            fillLayout={circleLayout}
            fillPaint={circlePaint}
            fillOnClick={this.onClickCircle}
          />
          {
            //this.Vessels()
          }
        </Map>
      </div>
    );
  }
}
