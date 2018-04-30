
import React from 'react';
import { Button, Divider } from 'semantic-ui-react'


export default function InfoBox(props) {
    const { id, latitude, longitude, type } = props.marker;
    const { onStart, onStop, onOrder, onSetDuration } = props;
    return (
        <div className="ui container center">
            <div className="ui inverted olive center aligned segment">

                <div>
                    <div>id: {id}</div>
                    <div>latitude: {latitude}</div>
                    <div>longitude: {longitude}</div>
                    <div>type: {type}</div>
                </div>
                <br />
                <div className="ui focus action input">
                    <form onSubmit={(ev) => onSetDuration(ev)}>
                        <input name="duration" type="text" placeholder="Duration (in minutes):" />
                        <Button type="submit" className="ui blue primary button">SET</Button>
                    </form>
                </div>

                <Divider />

                <Button className="ui blue" onClick={() => onStart()}>Start</Button>
                <Button className="ui blue" onClick={() => onStop()}>Stop</Button>
                <Button className="ui blue" onClick={() => onOrder()}>Order</Button>

            </div>
        </div>
    );
}
