const Users = require("../models/maidmodel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Booking = require("../models/Bookingmodel");

exports.newBooking = catchAsyncErrors(async (req, res,next) => {

    const {
        placeInfo,
        bookMaid,
        paymentInfo,
        totalprice,
    }=req.body;
    const booking = await Booking.create({
        placeInfo,
        paymentInfo,
        bookMaid,
        totalprice,
        paidAt:Date.now(),
        user:req.client._id,
    }) ;

    res.status(201).json({
        success:true,
        booking
    })

});


// get single order/booking
exports.getSingleOrder=catchAsyncErrors(async(req,res,next)=>{
    const booking = await Booking.findById(req.params.id)
    if(!booking){
        return next(new ErrorHandler("Order Not Found with this id", 404 ));
    }
    res.status(200).json({
        success: true,
        booking
    });
});


// get  order/booking details by logged in user
// get logged in user Orders
exports.myOrders = catchAsyncErrors (async (req, res, next) => {
    const orders = await Booking.find({ user: req.client._id });
    res.status (200).json({
    success: true,
    orders,
    });
    });

// get all booking orders by --Admin
exports.getAllOrders = catchAsyncErrors (async (req, res, next) => {
    const orders = await Booking.find(); 
    const totalOrders=orders.length;
    res.status (200).json({
    success: true,
    'total':totalOrders,
    orders,
    });
    });
// Update booking status by --Admin
exports.updateBookingStatus = catchAsyncErrors (async (req, res, next) => {
    const order = await Booking.findById(req.params.id); 
    if (!order) {
        return next (new ErrorHandler("Order not found with this Id", 404));
        }
    if(order.bookingStatus ==="confirmed"){
        return next(new ErrorHandler("Already Booked this Maid",404))
    }

order.bookingStatus =req.body.status;

if(req.body.status === "confirmed"){
    order.paidAt=Date.now(); 
    order.availability = "false";
}
await order.save({validateBeforeSave:false})
    res.status (200).json({
    success: true,
    
    });
    });

    // delete Order -- Admin
exports.deleteOrder = catchAsyncErrors (async (req, res, next) => {
    const order = await Booking.findById(req.params.id);
    if (!order) {
    return next (new ErrorHandler("Order not found with this Id", 404));
    }
    await order.deleteOne();
    res.status (200).json({
    success: true,
    });
    });