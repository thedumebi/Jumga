import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

function Purchase() {
  const { tx_ref } = useParams();
  const history = useHistory();
  const [purchase, setPurchase] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:9000/purchase/${tx_ref}`, {
        withCredentials: true,
      })
      .then((res) => {
        res.data.status === "fail" && history.push("/login");
        setPurchase(res.data.purchase);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [tx_ref, history]);

  return (
    <div className="payment">
      <p>Item ID: {purchase.item_id}</p>
      <p>Item Name: {purchase.item_name}</p>
      <p>Item Quantity: {purchase.item_quantity}</p>
      <p>Purchase Currency: {purchase.currency}</p>
      <p>Amount: {purchase.amount}</p>
      <p>Transaction Reference: {purchase.tx_ref}</p>
      <p>Payment Status: {purchase.status}</p>
      <p>Shop ID: {purchase.shop_id}</p>
      <p>Vendor ID: {purchase.vendor_id}</p>
    </div>
  );
}

export default Purchase;
