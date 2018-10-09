'use strict';
/* jshint node: true */
/* global describe, it, expect, spyOn */

const crypto = require('crypto');
const config = require('config');

describe('editUrlHelper', () => {

  const editUrlHelper = require('../../domain/editUrlHelper.js');

  describe('generateSecureID()', () => {

    it('should generate a cryptographically secure id', () => {
      spyOn(crypto, 'randomBytes').and.returnValue("testID");

      const secureID = editUrlHelper.generateSecureID();
      expect(crypto.randomBytes.calls.count()).toEqual(1);
      expect(crypto.randomBytes).toHaveBeenCalledWith(32);

      expect(secureID).toBe("testID");

    });
  });

  describe('generateUrl()', () => {
    it('should produce absolute URI', () => {
      const secureID = editUrlHelper.generateUrl('secureId');

      expect(secureID).toBe(`${config.get('pace-url')}/editparticipant/secureId`);
    });
  });

  describe('generateUrlForAdmin()', () => {
    it('should produce absolute URI', () => {
      const secureID = editUrlHelper.generateUrlForAdmin('secureId');

      expect(secureID).toBe(`${config.get('pace-url')}/admin/editparticipant/secureId`);
    });
  });

});
