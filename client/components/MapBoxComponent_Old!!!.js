
import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'

//mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

//============================================================//

var geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-74.005, 40.701]
    },
    properties: {
      title: 'Mapbox',
      description: 'Washington, D.C.'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-74.006, 40.702]
    },
    properties: {
      title: 'Mapbox',
      description: 'San Francisco, California'
    }
  }]
};

//=========================================================//

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

    //==============================//

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

    this.map.on('click', (e) => {
      console.log("====== e: ", e);
      var latitude = e.lngLat.lat;
      var longitude = e.lngLat.lng;

      console.log(latitude + " - " + longitude)
    });


    geojson.features.forEach(marker => {
      const el = document.createElement('div');
      el.className = 'marker';
      new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
        .addTo(this.map);
    });
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
