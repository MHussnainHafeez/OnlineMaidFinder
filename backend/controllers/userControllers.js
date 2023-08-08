
// Maid controller "Register delete update etc api's".

const Users = require("../models/maidmodel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErrors = require('../middleware/catchAsyncError');
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");



// create Maid --- Admin

exports.createMaid = catchAsyncErrors(async (req, res, next) => {

    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.images = imagesLinks;
    // req.body.user = req.user.id;
  
  
    const maid = await Users.create(req.body);
    res.status(201).json({
        success: true,
        maid
    })

});
// creating maid account
exports.createGigByMaid = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  // Assuming you have a valid "maidId" in the request body to associate the gig with a specific maid
  const { maidId, fname, lname, expertize, workExperiance, location, price, ratings, reviews, description, status } = req.body;

  const newGig = await Users.create({
    maidId,
    fname,
    lname,
    expertize,
    workExperiance,
    location,
    price,
    ratings,
    reviews,
    description,
    status,
    images: imagesLinks,
  });

  res.status(201).json({
    success: true,
    maid: newGig,
  });
});

exports.getMyGigs = async (req, res) => {
  
  try {
    const { maidId } = req.params;
    console.log(req.params)
    const maid = await Users.find({ maidId });
    
    res.status(200).json(maid);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching my gigs' });
  }
};
// get all users

exports.getAllUsers = catchAsyncErrors(async (req, res,next) => {
   
    const resultPerPage = 8;
    const maidCount = await Users.countDocuments();

    const apiFeature = new ApiFeatures(Users.find(), req.query).search().filter().pagination(resultPerPage);
    const users = await apiFeature.query;
    res.status(200).json({
        success: true,
        users,
        maidCount,
        resultPerPage

    })
});


// Get All Product (Admin)
exports.getAdminUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await Users.find();
  
    res.status(200).json({
      success: true,
      users,
    });
  });
  


// Get Maid Details
exports.getMaidDetails = catchAsyncErrors(async (req, res, next) => {
    const maid = await Users.findById(req.params.id);

    if (!maid) {
        return next(new ErrorHandler("Maid Not Found", 404));
    }
    await res.status(200).json({
        success: true,
        maid
    })


});
// update Maid --Admin
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    let Maid = await Users.findById(req.params.id);
    if (!Maid) {
        return next(new ErrorHandler("Maid Not Found", 404));
    }

  // Images Start Here
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting Images From Cloudinary
    for (let i = 0; i < Maid.images.length; i++) {
      await cloudinary.v2.uploader.destroy(Maid.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

    
    Maid = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
    res.status(200).json({
        success: true,
        Maid
    })
});
// update by maid
exports.updateUserByMaid = catchAsyncErrors(async (req, res, next) => {
    let Maid = await Users.findById(req.params.id);
    if (!Maid) {
        return next(new ErrorHandler("Maid Not Found", 404));
    }

 // Images Start Here
 let images = [];

 if (typeof req.body.images === "string") {
   images.push(req.body.images);
 } else {
   images = req.body.images;
 }

 if (images !== undefined) {
   // Deleting Images From Cloudinary
   for (let i = 0; i < Maid.images.length; i++) {
     await cloudinary.v2.uploader.destroy(Maid.images[i].public_id);
   }

   const imagesLinks = [];

   for (let i = 0; i < images.length; i++) {
     const result = await cloudinary.v2.uploader.upload(images[i], {
       folder: "products",
     });

     imagesLinks.push({
       public_id: result.public_id,
       url: result.secure_url,
     });
   }

   req.body.images = imagesLinks;
 }


    Maid = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false });
    res.status(200).json({
        success: true,
        Maid
    })
});
//  Delete Maid -- Admin
exports.deleteMaid = catchAsyncErrors(async (req, res, next) => {

    const maid = await Users.findById(req.params.id);

    if (!maid) {
        return next(new ErrorHandler("Maid Not Found", 404));
    }
// Deleting Images From Cloudinary
for (let i = 0; i < maid.images.length; i++) {
    await cloudinary.v2.uploader.destroy(maid.images[i].public_id);
  }



    await maid.deleteOne();
    res.status(200).json({
        success: true,
        message: "Maid Deleted Sucessfully"
    })
});
//  Delete Maid -- Admin
exports.deleteMaidByMaid = catchAsyncErrors(async (req, res, next) => {

    const maid = await Users.findById(req.params.id);

    if (!maid) {
        return next(new ErrorHandler("Maid Not Found", 404));
    }
// Deleting Images From Cloudinary
for (let i = 0; i < maid.images.length; i++) {
    await cloudinary.v2.uploader.destroy(maid.images[i].public_id);
  }



    await maid.deleteOne();
    res.status(200).json({
        success: true,
        message: "Maid Deleted Sucessfully"
    })
});


// Create New Review or Update Review

exports.createMaidReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, userId } = req.body;
    const review = {
        user: req.client._id,
        name: req.client.name,
        rating: Number(rating),
        comment,

    };
    const maid = await Users.findById(userId);
    const isReviewed = maid.reviews.find((rev) => rev.user === req.client._id)
    if (isReviewed) {
        maid.reviews.forEach((rev) => {
            if (rev.user === req.user._id)
                (rev.rating = rating), (rev.comment = comment);
        });
    }
    else {
        maid.reviews.push(review);
        maid.numOfReviews = maid.reviews.length;
    }
    let avg = 0;
    maid.reviews.forEach(rev => {
        avg += rev.rating
    })
    maid.ratings =avg / maid.reviews.length


    await maid.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
    })
});

// get all reviews of a single maid profile
exports.getMaidReviews=catchAsyncErrors(async(req,res,next)=>{
    const maid = await Users.findById(req.query.id);
    if(!maid){
        return next(new ErrorHandler("Maid Not Found",404));
    }
    res.status(200).json({
        success:true,
        reviews:maid.reviews,
    })
})
// Get review by maid of his/her own id
exports.getMaidReviewsByMaid = catchAsyncErrors(async (req, res, next) => {
  const maid = await Users.findById(req.params.maidId); // Use req.params.maidId
  if (!maid) {
    return next(new ErrorHandler("Maid Not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: maid.reviews,
  });
});

// Delete Reviews
exports.deleteReview=catchAsyncErrors(async(req,res,next)=>{
    const maid = await Users.findById(req.query.maidId);
    if(!maid){
        return next(new ErrorHandler("Maid Not Found",404));
    }
const reviews = maid.reviews.filter(rev=>rev._id.toString() !== req.query.id.toString())

let avg = 0;
reviews.forEach(rev => {
    avg += rev.rating
})
let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
   
     ratings =avg / reviews.length;
  }
const numOfReviews =reviews.length;
await Users.findByIdAndUpdate(req.query.maidId, {
    reviews,
    ratings,
    numOfReviews,
},{
    new : true,
    runValidators:true,
    useFindAndModify:false
})

    res.status(200).json({
        success:true,
        
    });
});