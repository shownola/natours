const Tour = require('./../models/tourModel');


/////  GET  -  GET ALL TOURS ////////////////
exports.getAllTours = async (req, res) => {
  try {
    const queryObj = {...req.query};
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    const query = Tour.find(queryObj);
    // const tours = await Tour.find({duration: 5, difficulty: 'easy'});
    // const query = Tour.find().where('duration').equals(5).where('difficulty').equals('easy');

    const tours = await query;

    res.status(200).json({
      status: 'success' ,
      results: tours.length,
      data: {tours}
    });
  } catch(err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};


/////////// GET - GET TOUR //////////////

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {tour}
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });

  }
}

///////// CREATE TOUR //////////////////


exports.createTour = async (req, res) => {
  try{
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {tour: newTour}
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
}
////// PATCH - UDPATE TOUR /////

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: tour
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent to server'
    });
  }
};

//////////  DELETE - DELETE TOUR //////////////////

exports.deleteTour = async(req, res) => {
  try{
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
