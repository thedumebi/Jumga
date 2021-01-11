require("dotenv").config();
const request = require("request");

exports.makeShopPayment = async function(req, res) {
    const options = {
        url: "https://api.flutterwave.com/v3/charges?type=debit_ng_account",
        method: "POST",
        body: req.body,
        json: true,
        headers: {
            Authorization: process.env.SECRET_KEY
        }
    }
    request(options, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            const info = JSON.parse(body);
            console.log(info);
        }
    });
}