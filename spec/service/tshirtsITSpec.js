'use strict';
/* jshint node: true */
/* global describe, beforeEach, afterAll, it, expect*/

describe('tshirt service', () => {
  const participant = require('../../domain/participant');
  const participants = require('../../service/participants');
  const tshirts = require('../../service/tshirts');
  const helper = require('../journeyHelper');

  const aParticipant = participant.from({
    firstname: 'Hertha',
    lastname: 'Mustermann',
    email: 'h.mustermann@example.com',
    category: 'Unicorn',
    birthyear: 1980,
    visibility: 'yes',
    discount: 'no',
    team: 'Crazy runners'
  }).withToken('token').withSecureId('someId');

  beforeEach((done) => {
    helper.changeOriginalTimeout();
    helper.setupDbConnection(done);
  });

  afterAll((done) => {
    helper.resetToOriginalTimeout();
    helper.closeDbConnection(done);
  });

  describe('addFor()', () => {
    it('stores tshirt', (done) => {
      participants.save(aParticipant.withStartNr(10))
        .then((id) => {
          tshirts.addFor({size: 'M', model: 'Skin fit'}, id)
            .then(() => {
              tshirts.getFor(id)
                .then(function (shirts) {
                  expect(shirts.length).toBe(1);
                  done();
                })
                .catch(done.fail);
            });
        });
    });
  });

  describe('getFor()', () => {
    it('returns [] if no tshirt ordered', (done) => {
      tshirts.getFor(200).then(result => {
        expect(result.length).toBe(0);
        done();
      }).catch(done.fail);
    });
  });
});
