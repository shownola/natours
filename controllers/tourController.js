const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

/////  GET  -  GET ALL TOURS ////////////////
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours
    }
  });
};
/////////// GET - GET TOUR //////////////

exports.getTour = (req, res) => {
  console.log(req.params)
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  if (!tour){
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {tour}
  });
}

/////////// POST - CREATE TOUR //////////////

exports.createTour = (req, res) => {
  const newId = tours[tours.length -1].id + 1;
  const newTour = Object.assign({id: newId}, req.body);

  tours.push(newTour);
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: {tour: newTour}
    });
  });
}
////// PATCH - UDPATE TOUR /////

exports.updateTour = (req, res) => {
  if(req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {tour: '<Updated tour here...>'}
  });
}

//////////  DELETE - DELETE TOUR //////////////////

exports.deleteTour = (req, res) => {
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: {data: null}
  });
};
