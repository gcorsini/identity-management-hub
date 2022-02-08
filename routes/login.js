require('dotenv').config();

const axios = require('axios');
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const express = require('express');
const router = express.Router();


router.get('/user', function(req, res, next) {
  res.render('userLogin', { title: 'User Login' });
});

router.post('/user', function(req, res, next) {
  let jsonDIDDoc = JSON.parse(req.body.diddoc);
  console.log(jsonDIDDoc);
  axios.post(`${process.env.API_LINK}/vcs/verifyFullCert`, jsonDIDDoc)
  .then(apiResult => {
    if(apiResult.data.verified) {
      res.render(
        'userFullCert', 
        { title: `Hello ${jsonDIDDoc.credential.credentialSubject.givenName}`, vcContent: jsonDIDDoc.credential.credentialSubject }
      );
    } else {
      res.render('userLogin', { title: 'User Login', msg: "Login failed!" });
    }
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
});

router.get('/issuer', function(req, res, next) {
  res.render('issuerLogin', { title: 'Issuer Login' });
});

router.post('/issuer', function(req, res, next) {
  console.log(`${process.env.API_LINK}/issuers/verify`);
  console.log(JSON.parse(req.body.diddoc));
  axios.post(`${process.env.API_LINK}/issuers/verify`,
    JSON.parse(req.body.diddoc)
  )
  .then(apiResult => {
    if(apiResult.data.verified) {
      // ToDo: need to know DID!!
      res.redirect('/issuer');
    } else {
      res.render('issuerLogin', { title: 'Issuer Login', msg: "Login failed!" });
    }
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;
