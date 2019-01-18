// MODELS
const Pet = require('../models/pet');

// UPLOADING TO AWS S3
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Upload = require('s3-uploader');

const client = new Upload(process.env.S3_BUCKET, {
  aws: {
    path: 'pets/avatar',
    region: process.env.S3_REGION,
    acl: 'public-read',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  cleanup: {
    versions: true,
    original: true
  },
  versions: [{
    maxWidth: 400,
    aspect: '16:10',
    suffix: '-standard'
  }, {
    maxWidth: 300,
    aspect: '1:1',
    suffix: '-square'
  }]
});

// PET ROUTES
module.exports = (app) => {

  // INDEX PET => index.js
  app.get('/', (req, res) => {
    const page = req.query.page || 1 

    Pet.paginate({}, {page: page}).then((results) => {
      res.render('pets-index', { pets: results.docs, pagesCount: results.pages, currentPage: page });
    });
  });

  // NEW PET
  app.get('/pets/new', (req, res) => {
    res.render('pets-new');
  });

  // CREATE PET
  app.post('/pets', (req, res) => {
    var pet = new Pet(req.body);

    pet.save()
      .then((pet) => {
        // res.redirect(`/pets/${pet._id}`);
        res.send({ pet: pet });
      })
      .catch((err) => {
        // Handle Errors
        res.status(400).send(err.errors);
      });
  });

  // SHOW PET
  app.get('/pets/:id', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-show', { pet: pet });
    });
  });

  // EDIT PET
  app.get('/pets/:id/edit', (req, res) => {
    Pet.findById(req.params.id).exec((err, pet) => {
      res.render('pets-edit', { pet: pet });
    });
  });

  // UPDATE PET
  app.put('/pets/:id', (req, res) => {
    Pet.findByIdAndUpdate(req.params.id, req.body)
      .then((pet) => {
        res.redirect(`/pets/${pet._id}`)
      })
      .catch((err) => {
        // Handle Errors
      });
  });

  // DELETE PET
  app.delete('/pets/:id', (req, res) => {
    Pet.findByIdAndRemove(req.params.id).exec((err, pet) => {
      return res.redirect('/')
    });
  });

  //SEARCH PET 
  app.get('/search', (req, res) => {
    var term = new RegExp(req.query.term, 'i')
    const page = req.query.page || 1
    Pet.paginate(
        { $or:[
          {'name': term},
          {'species': term}
        ]}, 
        { page: page }).then((results) => {
          res.render('pets-index', { pets: results.docs, pagesCount: results.pages, currentPage: results.page, term: req.query.term });
        });
  });


}
