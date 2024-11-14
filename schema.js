const joi = require("joi");
const { title } = require("process");

module.exports.listingSchema = joi.object({
    listing:joi.object({
        title: joi.string().required().min(3).max(100), 
        description: joi.string().required().min(10).max(500), 
        country:joi.string().required(),
        location:joi.string().required(),
        price:joi.number().required().min(0),
        image: joi.string().uri().allow("", null),
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required().min(5).max(300),
    }).required(),
});