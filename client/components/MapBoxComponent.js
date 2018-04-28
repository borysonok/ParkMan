
import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';


export default class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lng: -74.009,
      lat: 40.705,
      zoom: 15
    };
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;

    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v10',
      center: [lng, lat],
      zoom
    });

    this.map.on('load', () => {
      this.map.addLayer({
        id: 'terrain-data',
        type: 'line',
        source: {
          type: 'vector',
          url: 'mapbox://mapbox.mapbox-terrain-v2'
        },
        'source-layer': 'contour'
      });
    });

    this.map.on('move', () => {
      const { lng, lat } = this.map.getCenter();
      this.setState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: this.map.getZoom().toFixed(2)
      });
    });

    const markerDomEl = document.createElement("div"); // Create a new, detached DIV
    markerDomEl.style.width = "32px";
    markerDomEl.style.height = "39px";
    markerDomEl.style.backgroundImage = "url(http://i.imgur.com/WbMOfMl.png)";

    new mapboxgl.Marker(markerDomEl).setLngLat([-74.009, 40.705]).addTo(this.map); // [-87.6354, 41.8885] for Chicago

    this.map.on('mousemove', () => { });

  }


  componentWillUnmount() {
    this.map.remove();
  }

  render() {

    const { lng, lat, zoom } = this.state;

    const style = {
      position: 'inherit',
      height: 500,
      margin: 0,
      padding: 0
    }

    return (
      <div >
        <div>{`Longitude: ${lng} Latitude: ${lat} Zoom: ${zoom}`}</div>
        <div style={style} ref={(el) => { this.mapContainer = el }} />
      </div>
    );
  }
}
