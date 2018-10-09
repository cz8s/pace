/* jshint node: true */
'use strict';

const Q = require('q');
const router = require('express').Router();
const isAuthenticated = require('../../acl/authentication');
const participants = require('../../service/participants');
const tshirts = require('../../service/tshirts');
const editUrlHelper = require('../../domain/editUrlHelper');
const costCalculator = require('../../domain/costCalculator');
const registration = require('../../service/registration');


//TODO Move those 2 method out of the Ctrl.
let addEditUrlTo = (participants) => {
  participants.map(participant => {
    participant.editUrl = editUrlHelper.generateUrlForAdmin(participant.secureid);
    return participant;
  });
};

let addAmountTo = (participants) => {
  participants.map((participant) => {
    participant.amount = costCalculator.priceFor(participant);
    return participant;
  });
};


router.get('/', isAuthenticated, (req, res) => {
  participants.get.all().then(allParticipants => {
    addEditUrlTo(allParticipants);
    Q.all(allParticipants.map(tshirts.findAndAddTo))
      .then(() => {
        addAmountTo(allParticipants);
        res.render('admin/list', {participants: allParticipants});
      });
  });
});

router.post('/resend-mail', isAuthenticated, (req, res) => {
  participants.get.byId(req.body.participantid)
    .then((participant) => {
      return registration.sendConfirmationMail(participant, participant.paymenttoken);
    })
    .then(res.render('admin/sentMail'));
});

module.exports = router;
