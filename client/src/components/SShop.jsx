import React, { useEffect, useState } from "react";
import Shop from "./Shop";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Row } from "react-bootstrap";

function SShop(props) {
  let { shopId } = useParams();
  const [shop, setShop] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/shops/${shopId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setShop(res.data.shop);
      });
  }, [shopId]);

  return (
    <div className="">
    <Row>
      {shop.map((shop) => {
        return (
          <Shop
            key={shop._id}
            id={shop.id}
            name={shop.name}
            country={shop.country}
            items={shop.items}
            user={props.user}
            vendor_id={shop.vendor_id}
            single={true}
          />
        );
      })}
      </Row>
    </div>
  );
}

export default SShop;
