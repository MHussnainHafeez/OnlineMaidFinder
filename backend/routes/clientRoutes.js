const express=require("express");
const { registerClient, loginClient, logout, forgotPassword, resetPassword, getClientDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateRole, deleteClient } = require("../controllers/clientControllers");
const {isAuthenticatedClient, authorizeRoles}=require("../middleware/authentication")
const router = express.Router();
router.route("/register").post(registerClient);
router.route("/login").post(loginClient);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedClient, getClientDetails);
router.route("/password/update").put(isAuthenticatedClient,updatePassword);
router.route("/me/update").put(isAuthenticatedClient,updateProfile);
router.route("/logout").get(logout);
router.route("/admin/clients").get(isAuthenticatedClient,authorizeRoles("Admin"),getAllUser);
router.route("/admin/client/:id").get(isAuthenticatedClient,authorizeRoles("Admin"),getSingleUser).put(isAuthenticatedClient,authorizeRoles("Admin"),updateRole).delete(isAuthenticatedClient,authorizeRoles("Admin"),deleteClient);

module.exports = router;