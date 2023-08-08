// Client Controller " Registration Login etc."

const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Client = require("../models/clientmodel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require('cloudinary');

// Register a Client

exports.registerClient = catchAsyncErrors(async (req, res, next) => {

const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
  folder:'avatars',
  width:150,
  crop:"scale"
})

  const { name, email, password,role } = req.body;

  const user = await Client.create({
    name,
    email,
    password,
    role,
    avatar: {
      public_id:myCloud.public_id,
      url:myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});

// Login A Client
exports.loginClient = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // Checking user enter email and password both or not
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const client = await Client.findOne({ email }).select("+ password");

  if (!client) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await client.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(client, 200, res);
});

// Logout client
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const client = await Client.findOne({ email: req.body.email });
  if (!client) {
    return next(new ErrorHandler("User not found", 404));
  }
  // Get Reset Password Token
  const resetToken = client.getResetPasswordToken();
  await client.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email
  then, please ignore it.`;
  try {
    await sendEmail({
      email: client.email,
      subject: `Password Recovery Link for your account on FindMaid Website! `,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${client.email} successfully`,
    });
  } catch (error) {
    client.resetPasswordToken = undefined;
    client.resetPasswordExpire = undefined;

    await client.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const client = await Client.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!client) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password Does Not Matched", 400));
  }
  client.password = req.body.password;
  client.resetPasswordToken = undefined;
  client.resetPasswordExpire = undefined;

  await client.save();

  sendToken(client, 200, res);
});

// get client details
exports.getClientDetails = catchAsyncErrors(async (req, res, next) => {
  const client = await Client.findById(req.client.id);
  res.status(200).json({
    success: true,
    client,
  });
});
// Update client Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const client = await Client.findById(req.client.id).select("+password");
  const isPasswordMatched = await client.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old Password is incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not matched", 400));
  }

  client.password = req.body.newPassword;
  await client.save();

  sendToken(client, 200, res);
});

// Update client Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newClientData = {
    name: req.body.name,
    email: req.body.email,
  };
 
  if(req.body.avatar !== ""){
    const client =  await Client.findById(req.client.id);
    const imageId = client.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
      folder:'avatars',
      width:150,
      crop:"scale"
    })
    newClientData.avatar={
      public_id:myCloud.public_id,
      url:myCloud.secure_url
    }
  }

  const client = await Client.findByIdAndUpdate(req.client.id, newClientData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});
// Get all users by (admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const clients = await Client.find();

  res.status(200).json({
    success: true,
    clients,
  });
});
// Get single user by (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

if(!client){
  return next(new ErrorHandler(`No User found with that ID, ${req.params.id}`));
}


  res.status(200).json({
    success: true,
    client,
  });
});

// Update client Role by admin
exports.updateRole = catchAsyncErrors(async (req, res, next) => {
  const newClientData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  

  const client = await Client.findByIdAndUpdate(req.params.id, newClientData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete client By Admin
exports.deleteClient = catchAsyncErrors(async (req, res, next) => {

  const client = await Client.findById(req.params.id);


if(!client){
  return next(new ErrorHandler('No such customer exists'));
}
const imageId = client.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
await client.deleteOne();
  res.status(200).json({
    success: true,
    message:"User Deleted Successfully"
  });
});