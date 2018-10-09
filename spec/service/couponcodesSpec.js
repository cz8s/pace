/* jshint node: true */
/* global describe, beforeEach, it, expect, jasmine */
'use strict';
const mockery = require('mockery');
const Q = require('q');


describe('couponcode service', () => {

  let dbHelperMock;


  describe('start()', () => {
    let couponcodes;


    beforeEach(() => {
      mockery.enable({
        useCleanCache: true,
        warnOnReplace: false,
        warnOnUnregistered: false
      });

      mockery.resetCache();

      dbHelperMock = {
        select: jasmine.createSpy(),
        insert: jasmine.createSpy(),
        update: jasmine.createSpy()
      };

      mockery.registerMock('../service/util/dbHelper', dbHelperMock);

      mockery.registerAllowables(['q', 'lodash', '../../service/util/dbHelper.js']);
      dbHelperMock.select.and.returnValue(Q.fcall(() => [{id: 1, code: '123', used: false}, {
        id: 2,
        code: '321',
        used: true
      }]));
      dbHelperMock.insert.and.returnValue(Q.fcall(() => 'some id'));
      dbHelperMock.update.and.returnValue(Q.fcall(() => 'whatever'));


      couponcodes = require('../../service/couponcodes');
    });

    it('should create a new code in the DB', (done) => {
      couponcodes.create().then(couponcodeAndId => {
        expect(dbHelperMock.insert).toHaveBeenCalledWith('INSERT INTO couponcodes (code, used) values($1, $2) returning id', [couponcodeAndId.code, false]);
        done();
      }).catch(done.fail);
    });

    it('should get all codes', (done) => {
      couponcodes.getAll().then( () => {
        expect(dbHelperMock.select).toHaveBeenCalledWith('SELECT * FROM couponcodes');
        done();
      }).catch(done.fail);
    });

    it('should mark as used', (done) => {
      let couponcode = '123';
      couponcodes.markAsUsed(couponcode).then( () => {
        expect(dbHelperMock.update).toHaveBeenCalledWith('UPDATE couponcodes SET used=$1 WHERE code=$2 ', [true, couponcode]);
        done();
      }).catch(done.fail);
    });

    it('should return true if code is valid and discount is free', (done) => {
      let returnValue = [{count: 1}];
      dbHelperMock.select.and.returnValue(Q.fcall(() => returnValue));
      let couponcode = '123';
      let discount = 'free';
      couponcodes.validateCode(couponcode, discount).then(result => {
        expect(dbHelperMock.select).toHaveBeenCalledWith('SELECT COUNT(*) FROM couponcodes WHERE code = $1 AND used=false', [couponcode]);
        expect(result).toBe(true);
        done();
      }).catch(done.fail);
    });

    it('should return true if code is empty but discount is no', (done) => {
      let discount = 'no';
      let couponcode = '';
      couponcodes.validateCode(couponcode, discount).then(result => {
        expect(dbHelperMock.select).not.toHaveBeenCalled();
        expect(result).toBe(true);
        done();
      }).catch(done.fail);
    });

    it('should return false if code is invalid or used and discount is free', (done) => {
      let returnValue = [{count: 0}];
      dbHelperMock.select.and.returnValue(Q.fcall(() => returnValue));
      let couponcode = '123';
      let discount = 'free';
      couponcodes.validateCode(couponcode, discount).then(result => {
        expect(dbHelperMock.select).toHaveBeenCalledWith('SELECT COUNT(*) FROM couponcodes WHERE code = $1 AND used=false', [couponcode]);
        expect(result).toBe(false);
        done();
      }).catch(done.fail);
    });
  });
});
