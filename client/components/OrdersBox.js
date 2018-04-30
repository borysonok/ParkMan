
import React, { Component } from 'react';
import { Divider } from 'semantic-ui-react';


export default class OrdersBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: []
        }
    }

    componentDidMount() {
        this.setState({ orders: this.props.orders });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.setState({ orders: nextProps.orders });
        }
    }

    render() {
        const orders = this.state.orders;

        // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        // var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        // var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return (
            <div className="ui inverted olive segment">

                <div>YOUR ORDERS:</div>

                <div className="ui small horizontal list">
                    {orders && orders.map((order) => {
                        return (
                            <div className="item" key={order.id}>
                                <div>Marker Id: {order.markerId}</div>
                                <div>Order Id: {order.id}</div>
                                <div>Start Time: {order.startTime}</div>
                                <div>End Time: {order.endTime}</div>
                                <div>Duration: {order.duration}</div>
                                <div>Price: {order.price}</div>
                                <Divider />
                            </div>
                        );
                    })}
                </div>

            </div>
        );
    }
}