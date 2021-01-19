import React from "react";
import {Button} from "react-bootstrap";
import { Link } from "react-router-dom";

function Bought(props) {

    return (
        <div className="shop">
            <div className="content">
                <h3>{props.name}</h3>
                <h4>{props.quantity}</h4>
                <Link to={`/purchase/${props.tx_ref}`}>
                    <Button className="btn-dark">view purchase</Button>
                </Link>
            </div>
        </div>
    )
}

export default Bought
