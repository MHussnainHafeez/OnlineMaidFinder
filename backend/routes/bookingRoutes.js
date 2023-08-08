// Booking Routes

const express = require("express");
const {
  isAuthenticatedClient,
  authorizeRoles,
} = require("../middleware/authentication");
const {
  newBooking,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateBookingStatus,
  deleteOrder,
} = require("../controllers/bookingcontrollers");
const router = express.Router();

router.route("/booking/new").post(isAuthenticatedClient, newBooking);
router
  .route("/booking/:id")
  .get(isAuthenticatedClient, getSingleOrder);
router.route("/booking/me").get(isAuthenticatedClient, myOrders);
router.route("/admin/orders").get(isAuthenticatedClient,authorizeRoles("admin"),getAllOrders)
router.route("/admin/order/:id").put(isAuthenticatedClient,authorizeRoles("admin"),updateBookingStatus).delete(isAuthenticatedClient,authorizeRoles("admin"),deleteOrder)
module.exports = router;
