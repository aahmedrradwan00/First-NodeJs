const express = require('express');

const catchAsync = require('../utils/catchAsync');

// import { Router } from "express";

const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewContoller');
const reviewRouter = require('./reviewRouter');

const {
  getAlltours,
  checkId,
  checkBody,
} = require('./../controllers/tourController');

const router = express.Router();

// router.param('id', checkId);
// router.route('/').get(getAlltours).post(checkBody, tourController.createTour);

router.use('/:tourId/reviews', reviewRouter);

router.route('/get-status').get(tourController.getTourStatus);
router.route('/top5-cheap').get(tourController.top5, getAlltours);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);


router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(authController.protect, getAlltours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourimages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
