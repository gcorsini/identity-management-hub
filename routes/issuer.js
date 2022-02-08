require('dotenv').config();

const axios = require('axios');
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const express = require('express');
const router = express.Router();

// ToDo: should only be accessible with a token
router.get('/', function(req, res, next) {
  axios.get(`${process.env.API_LINK}/issuers/vcs`)
  .then(listOfVC => {
    res.render('issuer', { title: 'Manage Verifiable Credentials', vcs: listOfVC.data, issuerDID: 'did:key:zUC7JvPL6mGE7S9VCNskTb2Qt3saBgjwTqaD7jVfbGDUzP8v5in2qg8tKwa8m8kfBAtttQyrcUNCV3hqCaXbfi8z9NFFVxh5eUSv2ziJtEiq11io3iYFh4cDoD5DosrNQFAT8UZ' });
  })
  .catch(err => {
    console.error(err);
    res.render('issuer', { msg: 'Error loading VCs. Is the API accessible?', title: 'Manage Verifiable Credentials', vcs: {}, issuerDID: 'did:key:zUC7JvPL6mGE7S9VCNskTb2Qt3saBgjwTqaD7jVfbGDUzP8v5in2qg8tKwa8m8kfBAtttQyrcUNCV3hqCaXbfi8z9NFFVxh5eUSv2ziJtEiq11io3iYFh4cDoD5DosrNQFAT8UZ' });
  });  
});

router.post('/', function(req, res, next) {
  // Create new VC
  console.log(req.body);
  axios.post(`${process.env.API_LINK}/vcs`, req.body)
  .then(generatedVC => {
    let jsonData = JSON.stringify(generatedVC.data.cred, null, 4);
    res.render('issuerVC', { title: 'Generated Verifiable Credential', "cred": jsonData, "targetDid": generatedVC.data.targetDID, "oriCred": JSON.stringify(generatedVC.data.cred) });
  })
  .catch(err => {
    console.error(err);
    axios.get(`${process.env.API_LINK}/issuers/vcs`)
    .then(listOfVC => {
      res.render('issuer', { msg: 'Error generating the new VC. Please try again.', title: 'Manage Verifiable Credentials', vcs: listOfVC.data, issuerDID: 'did:key:zUC7JvPL6mGE7S9VCNskTb2Qt3saBgjwTqaD7jVfbGDUzP8v5in2qg8tKwa8m8kfBAtttQyrcUNCV3hqCaXbfi8z9NFFVxh5eUSv2ziJtEiq11io3iYFh4cDoD5DosrNQFAT8UZ' });
    })
    .catch(err => {
      console.error(err);
      res.render('issuer', { msg: 'Error loading VCs. Is the API accessible?', title: 'Manage Verifiable Credentials', vcs: {}, issuerDID: 'did:key:zUC7JvPL6mGE7S9VCNskTb2Qt3saBgjwTqaD7jVfbGDUzP8v5in2qg8tKwa8m8kfBAtttQyrcUNCV3hqCaXbfi8z9NFFVxh5eUSv2ziJtEiq11io3iYFh4cDoD5DosrNQFAT8UZ' });
    });  
  });
});

router.post('/:id', function(req, res, next) {
  // DELETE the existing VC
  axios.delete(`${process.env.API_LINK}/vcs/${req.params.id}`)
  .then(apiResult => {  
    if (apiResult.data.delted) {
      axios.get(`${process.env.API_LINK}/issuers/vcs`)
      .then(listOfVC => {
        res.render('issuer', { title: 'Manage Verifiable Credentials', vcs: listOfVC.data, msg: `VC ${req.params.id} deleted!` });
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    } else {
      axios.get(`${process.env.API_LINK}/issuers/vcs`)
      .then(listOfVC => {
        res.render('issuer', { title: 'Manage Verifiable Credentials', vcs: listOfVC.data, msg: `FAILED to delete VC ${req.params.id}!` });
      })
      .catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    }
  })
  .catch(err => {
    console.error(err);
    res.sendStatus(500);
  });
});


router.post('/send/:targetDID', function(req, res, next) {
  axios.post(`${process.env.API_LINK}/vcs/share/${req.params.targetDID}`, req.body.credential)
  .then(sentInfo => {
    if (sentInfo.data.sent) {
      res.render('issuerVCsent', { title: 'Verifiable Credentials sent' });
    } else {
      res.render('issuerVCsent', { title: 'FAILED to send! Please try again.' });
    }
  })
  .catch(err => {
    console.error(err);
    res.render('issuerVCsent', { title: 'FAILED to send! Please go back and try again.' });
  });  
})

module.exports = router;
