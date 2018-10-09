/* jshint node: true */
'use strict';

const router = require('express').Router();
const pdfGeneration = require('../pdf/pdfGeneration');

router.get('/:startnumber', (req, res) => {
    pdfGeneration.generateCertificate (res,req.params.startnumber)
    .catch( () =>
      res.render('error', {
        message: "Teilnehmer nicht bekannt",
        error: {status: "Möglicherweise wurde ein falscher Link verwendet"}
      })
    );
});

module.exports = router;
