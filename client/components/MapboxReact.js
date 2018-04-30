import React, { Component } from 'react';
import InfoBox from './InfoBox';
import OrdersBox from './OrdersBox';
import ReactMapGL, { Marker, Popup, FlyToInterpolator, NavigationControl } from 'react-map-gl';
import { Button, Divider } from 'semantic-ui-react';
//=================== CONSTANTS ==================//

const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const navStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: '10px'
};

//=============== FAKE MARKERS =================//

let fakeMarkers = [{
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

//=============== FAKE ORDERS =================//

let fakeOrders = [];

//==================================== UTILITY ============================================//

// pup simulation methods here....


//====================================== MAP ==============================================//

export default class Map extends Component {

    //============================== CONSTRUCTOR  =====================================//

    constructor(props) {
        super(props);
        const _w = window.innerWidth;
        const _h = window.innerHeight * 0.5;

        this.state = {
            viewport: {
                width: _w,
                height: _h,
                latitude: 40.705,
                longitude: -74.009,
                zoom: 12
            },
            markers: [],
            selectedMarker: null,
            orders: [],
            popupInfo: null
        }

        window.addEventListener('resize', () => {
            this.setState({
                width: _w,
                height: _h
            });
        });

        this._onViewportChange = this._onViewportChange.bind(this);
        this._goToNYC = this._goToNYC.bind(this);
        this._goToFA = this._goToFA.bind(this);
        this._onClick = this._onClick.bind(this);
        this._resize = this._resize.bind(this);
        this._updateViewport = this._updateViewport.bind(this);
        this._renderPopup = this._renderPopup.bind(this);
        this._createPositionMarker = this._createPositionMarker.bind(this);
        this._handleOnStart = this._handleOnStart.bind(this);
        this._handleOnStop = this._handleOnStop.bind(this);
        this._handleOnOrder = this._handleOnOrder.bind(this);
        this._handleOnSetDuration = this._handleOnSetDuration.bind(this);
    }
    //============================= END OF CONSTRUCTOR  =====================================//

    componentDidMount() {
        window.addEventListener('resize', this._resize);
        this._resize();
        this.setState({ markers: fakeMarkers });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._resize);
    }

    _resize = () => {
        const _w = window.innerWidth;
        const _h = window.innerHeight * 0.5;
        this.setState({
            viewport: {
                ...this.state.viewport,
                width: this.props.width || _w,
                height: this.props.height || _h
            }
        });
    };

    _updateViewport = (viewport) => {
        this.setState({ viewport });
    }

    _onViewportChange = (viewport) => {
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

    //================================ ON CLICK EVENT  =====================================//

    _onClick = (event) => {
        event.preventDefault();
        const position = {
            longitude: event.lngLat[0],
            latitude: event.lngLat[1]
        }
        const index = parseInt(Math.random() * 1000, 10);
        this._createPositionMarker(position, index);
    }

    //================================ EXPERIMENTAL =====================================//

    _createPositionMarker = (position, index) => {
        const newMarker = {
            id: index,
            longitude: position.longitude - 0.000006, // offset from the mouse cursor to position the marker in front of the cursor
            latitude: position.latitude + 0.000005,
            type: 'marker-yellow'
        }
        fakeMarkers.push(newMarker);
        this.setState({ markers: fakeMarkers });
    }

    _renderPopup = () => {
        const { popupInfo } = this.state;
        return popupInfo && (
            <Popup
                tipSize={5}
                anchor="bottom"
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                closeOnClick={true}
                offsetLeft={10}
                // BUG: when I close the popup a new marker is being created, so I added this delay to temporary solve that issue
                onClose={() => setTimeout(() => this.setState({ popupInfo: null }), 300)}
            >

                <div>{popupInfo.id}</div>
                <div>{popupInfo.longitude}</div>
                <div>{popupInfo.latitude}</div>
                {popupInfo.orderDuration ? <div>{popupInfo.orderDuration}</div> : null}
            </Popup>
        );
    }

    //============================ ANIMATION HANDLERS ===============================//

    _handleOnStart = () => {
        this.timerId = setInterval(() => {
            const types = ['marker-yellow', 'marker-green', 'marker-red'];
            fakeMarkers.forEach(marker => {
                const ind = Math.floor(Math.random() * 3);
                const randType = types[ind];
                marker.type = randType;
            });
            this.setState.call(this, { markers: fakeMarkers });
        }, 1000);
    }

    _handleOnStop = () => {
        clearInterval(this.timerId);
    }

    _handleOnOrder = () => {
        const id = parseInt(Math.random() * 1000, 10);
        const markerId = this.state.selectedMarker.id;
        const startTime = Date.now();
        const duration = parseInt((Math.random() * 1000 * 60) * (Math.random() * 60), 10);
        const endTime = startTime + duration;
        const price = (duration * 0.1 / 10000).toFixed(2);

        const newOrder = {
            id,
            markerId,
            startTime,
            endTime,
            duration,
            price
        }

        fakeOrders.push(newOrder);
        this.setState({ orders: fakeOrders });
    }

    //============================== SET DURATION: =========================================//

    _handleOnSetDuration = (ev) => {
        const duration = parseInt(ev.target.duration.value, 10);
        ev.preventDefault();

        console.log('========== in the onSetDuration: ', duration);

        // Setting the duration for the currently selected marker and starting the timer.
        const _marker = this.state.selectedMarker;
        _marker.orderDuration = duration;
        _marker.type = 'marker-red';
        this.setState({ selectedMarker: _marker, popupInfo: _marker });
    }

    //======================================================================================//

    render() {
        return (
            <div>

                <OrdersBox orders={this.state.orders} />
                <div>
                    <Button className="ui blue" onClick={this._goToNYC}>New York City</Button>
                    <Button className="ui blue" onClick={this._goToFA}>FullStack Academy</Button>
                    <Divider />
                </div>
                <div className="ui embed">
                    <ReactMapGL
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        mapStyle="mapbox://styles/mapbox/dark-v9"
                        //onViewportChange={this._onViewportChange}
                        onViewportChange={this._updateViewport}
                        transitionDuration={1000}
                        transitionInterpolator={new FlyToInterpolator()}
                        onClick={this._onClick}
                        {...this.state.viewport}>

                        {/* ===================== markers render ===================== */}

                        {this.state.markers.map(marker => {
                            return (
                                <Marker
                                    key={marker.id}
                                    latitude={marker.latitude}
                                    longitude={marker.longitude}>
                                    <div
                                        className={marker.type}
                                        onClick={() => this.setState({ selectedMarker: marker, popupInfo: marker })}
                                    />
                                </Marker>
                            );
                        })}

                        {/* ====================== popup render ====================== */}

                        {this._renderPopup()}

                        {/* ================== navigator bar render ================== */}

                        <div className="nav" style={navStyle}>
                            <NavigationControl onViewportChange={this._updateViewport} />
                        </div>

                        {/* ===================== end of map render ================== */}

                    </ReactMapGL>
                </div>
                {/* =========================== INFO BOX: ======================== */}

                {this.state.selectedMarker ?
                    <InfoBox
                        marker={this.state.selectedMarker}
                        onStart={this._handleOnStart}
                        onStop={this._handleOnStop}
                        onOrder={this._handleOnOrder}
                        onSetDuration={this._handleOnSetDuration}
                    />
                    : null
                }

            </div>
        );
    }
}
