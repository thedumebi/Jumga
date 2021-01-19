require("dotenv").config();
const request = require("request");
const crypto = require("crypto");
const axios = require('axios');
var forge = require("node-forge");
const { createShop } = require("./shops");

exports.makeShopPayment = function(req, res) {
    const shopFee = 20;
    const tx_ref = crypto.randomBytes(16).toString("hex");
    const text = JSON.stringify({
        tx_ref: tx_ref,
        card_number: req.body.card_number,
        cvv: req.body.cvv,
        expiry_month : req.body.expiry_month,
        expiry_year : req.body.expiry_year,
        currency : "USD",
        authorization : {
            mode:"pin",
            pin: req.body.pin
        },
        amount: shopFee,
        email: req.user.username,
        phone_number: req.user.phone_number,
        fullname: req.user.name
    });
    const options = {
        url: "https://api.flutterwave.com/v3/charges?type=card",
        method: "POST",
        body: {client: encrypt(process.env.ENCRYPTION_KEY, text)},
        json: true,
        headers: {
            Authorization: process.env.SECRET_KEY
        }
    }
    request(options, function(error, response, body) {
        console.log(response.statusCode);
        if (!error && response.statusCode === 200) {
            validateTransaction(body, req, res)
        }
    });
}

function encrypt(key, text) {
    var cipher = forge.cipher.createCipher(
     "3DES-ECB",
     forge.util.createBuffer(key)
    );
    cipher.start({ iv: "" });
    cipher.update(forge.util.createBuffer(text, "utf-8"));
    cipher.finish();
    var encrypted = cipher.output;
    return forge.util.encode64(encrypted.getBytes());
}

async function validateTransaction(body, req, res) {
    await axios({
        method: "post",
        url: "https://api.flutterwave.com/v3/validate-charge",
        headers: {
            "Content-Type": "application/json",
            "Authorization": process.env.SECRET_KEY
        },
        data: {
            otp: "12345",
            flw_ref: body.data.flw_ref
        }
    }).then(res => {
        console.log("validated");
        verifyTransaction(res.data.data.id, req, (req) => console.log("verify callback"));
    }).then(() => {
        createShop(req, res);
    }).catch(e => console.log(e));
}

async function verifyTransaction(id, req, callback) {
    var options = {
        method: 'GET',
        url: `https://api.flutterwave.com/v3/transactions/${id}/verify`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.SECRET_KEY
        }
      };
      request(options, function (error, response) { 
          const info = JSON.parse(response.body);
        if (error) throw new Error(error);
        if (!error && info.status == "success" && info.data.charged_amount === info.data.amount) {
            console.log("verified");
            callback(req);
            return true;
        }
      });
}

exports.verifyTransaction = verifyTransaction;