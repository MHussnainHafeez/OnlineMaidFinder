const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../controllers/paymentController");
const router = express.Router();
const { isAuthenticatedClient } = require("../middleware/authentication");
 
router.route("/payment/process").post(isAuthenticatedClient, processPayment);

router.route("/stripeapikey").get(isAuthenticatedClient, sendStripeApiKey);

module.exports = router;
