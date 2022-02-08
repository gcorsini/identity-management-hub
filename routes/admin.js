require('dotenv').config();

const axios = require('axios');
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const express = require('express');
const router = express.Router();

let listOfIssuers = [];

// GET list of whitelisted issuers
router.get('/', function(req, res, next) {
  axios.get(`${process.env.API_LINK}/tree`)
  .then(listOfDID => {
    listOfIssuers = listOfDID.data;
    console.log(listOfDID.data);
    res.render('admin', { title: 'Welcome to the admin panel', dids: listOfDID.data });
  })
  .catch(err => {
    console.error(err);
    res.render('admin', { errorIssuerList: 'Error loading issuers. Is the API accessible?', title: 'Welcome to the admin panel', dids: listOfIssuers });
  });  
});


router.post('/', function(req, res, next) {
  axios.post(`${process.env.API_LINK}/tree`)
  .then(newIssuerDID => {
    listOfIssuers.push(newIssuerDID.data.did);
    console.log(listOfIssuers);

    res.render('admin', { title: 'Welcome to the admin panel', dids: listOfIssuers });  
  })
  .catch(err => {
    console.error(err);
    res.render('admin', { errorIssuerAdd: 'Error creating and adding a new issuer. Is the API accessible?', title: 'Welcome to the admin panel', dids: listOfIssuers });    
  })
});


router.post('/delete', function(req, res, next) {
  console.log('delete body', req.body.did);
  axios.delete(`${process.env.API_LINK}/tree/${req.body.did}`)
  .then(newIssuerDID => {
    listOfIssuers.splice(listOfIssuers.indexOf(req.body.did),1);
    console.log(listOfIssuers);

    res.redirect('/admin');
  })
  .catch(err => {
    console.error(err);
    res.render('admin', { msg: 'Error removing issuer. Is the API accessible?', title: 'Welcome to the admin panel', dids: listOfIssuers });    
  })

});

module.exports = router;
