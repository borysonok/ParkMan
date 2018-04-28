import React, { Component } from 'react';
import ReactMapGL, { Marker, FlyToInterpolator, NavigationControl } from 'react-map-gl';
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

//=============== MARKERS ==============//

const fakeMarkers = [{
    id: 1,
    latitude: 40.704974242077,
    longitude: -74.00892193530039,
    type: 'marker-yellow'
}, {
    id: 2,
    latitude: 40.70486398294511,
    longitude: -74.0088782067479,
    type: 'marker-green'
}, {
    id: 3,
    latitude: 40.7049265076983,
    longitude: -74.008905028838,
    type: 'marker-red'
}, {
    id: 4,
    latitude: 40.70482582822571,
    longitude: -74.00894416385496,
    type: 'marker-green'
}, {
    id: 5,
    latitude: 40.70494681109768,
    longitude: -74.00902127736411,
    type: 'marker-yellow'
}]

//====================================//

export default class Map extends Component {
    constructor(props) {
        super(props);
        const _w = window.innerWidth * 0.75;
        const _h = window.innerHeight * 0.75;
        this.state = {
            viewport: {
                width: _w,
                height: _h,
                latitude: 40.705,
                longitude: -74.009,
                zoom: 12
            },
            markers: []
        }
        this._onViewportChange = this._onViewportChange.bind(this);
        this._goToNYC = this._goToNYC.bind(this);
        this._goToFA = this._goToFA.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onHover = this._onHover.bind(this);
    }

    componentDidMount() {
        this.setState({ markers: fakeMarkers });
    }

    _onViewportChange = viewport => {
        if (viewport.longitude > 0) {
            viewport.longitude = 0;
        }
        this.setState({ viewport });
    }

    _goToNYC = () => {
        const viewport = { ...this.state.viewport, longitude: -73.985428, latitude: 40.748817, zoom: 16 };
        this.setState({ viewport });
    }

    _goToFA = () => {
        const viewport = { ...this.state.viewport, longitude: -74.009, latitude: 40.705, zoom: 18 };
        this.setState({ viewport });
    }

    _onClick = (event) => {
        console.log('======= onClick Event(coords): ', event.lngLat);
        console.log('======= onClick Event(features): ', event.features);
    }

    _onHover = (event) => {
        console.log('======= onHover Event(coords): ', event.lngLat);
    }

    render() {
        return (
            <div>
                <ReactMapGL
                    mapboxApiAccessToken={MAPBOX_TOKEN}
                    mapStyle="mapbox://styles/mapbox/dark-v9"
                    onViewportChange={this._onViewportChange}
                    transitionDuration={1000}
                    transitionInterpolator={new FlyToInterpolator()}
                    onClick={this._onClick}
                    {...this.state.viewport}>

                    {this.state.markers.map(marker => {
                        return (
                            <Marker key={marker.id}
                                latitude={marker.latitude}
                                longitude={marker.longitude}
                                className={marker.type}
                            />
                        );
                    })}

                    <div style={{ position: 'absolute', left: 0 }}>
                        <NavigationControl onViewportChange={this._onViewportChange} />
                    </div>

                </ReactMapGL>

                <button onClick={this._goToNYC}>New York City</button>
                <button onClick={this._goToFA}>FullStack Academy</button>
            </div>
        );
    }
}

