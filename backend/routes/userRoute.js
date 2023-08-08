// Maid Routes

const express = require("express");
const {
  getAllUsers,
  createMaid,
  updateUser,
  deleteMaid,
  getMaidDetails,
  createMaidReview,
  getMaidReviews,
  deleteReview,
  getAdminUsers,
  updateUserByMaid,
  createMaidByMaid,
  createGigByMaid,
  getMyGigs,
  deleteMaidByMaid,
  getMaidReviewsByMaid,
} = require("../controllers/userControllers");
const { isAuthenticatedClient, authorizeRoles } = require("../middleware/authentication");

const router = express.Router();

router.route("/Users").get(getAllUsers);
router.route("/admin/Users").get(isAuthenticatedClient, authorizeRoles("Admin"),getAdminUsers)
router.route("/admin/Users/new").post(isAuthenticatedClient, authorizeRoles("Admin"), createMaid);
router.route("/maid/Users/new").post(isAuthenticatedClient, authorizeRoles("maid"), createGigByMaid);
router.route("/maid/Users/:maidId").get(getMyGigs)
router.route("/maid/Users/:id").delete(deleteMaidByMaid)
router
  .route("/admin/Users/:id")
  .put(isAuthenticatedClient, authorizeRoles("Admin"), updateUser)
  .delete(isAuthenticatedClient, authorizeRoles("Admin"), deleteMaid)
router.route("/maid/Users/:id").put(isAuthenticatedClient, authorizeRoles("maid"),updateUserByMaid)
router.route("/User/:id").get(getMaidDetails);
router.route("/review").put(isAuthenticatedClient, createMaidReview)
router.route("/reviews").get(getMaidReviews).delete(isAuthenticatedClient,deleteReview);
router.route("/maid/Reviews/:maidId").get(getMaidReviewsByMaid)



module.exports = router;
