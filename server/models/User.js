// @ts-check

import objectionUnique from 'objection-unique';
import i18next from 'i18next';

import encrypt from '../lib/secure.js';
import BaseModel from './BaseModel';

const unique = objectionUnique({ fields: ['email'] });

export default class User extends unique(BaseModel) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password', 'firstname', 'lastname'],
      properties: {
        id: { type: 'integer' },
        email: {
          type: 'string',
          format: 'email',
          errorMessage: {
            format: i18next.t('validation.user.email.format'),
          },
        },
        password: {
          type: 'string',
          minLength: 3,
          errorMessage: {
            minLength: i18next.t('validation.user.password.minLength', { count: 3 }),
          },
        },
        firstname: {
          type: 'string',
          minLength: 1,
          errorMessage: {
            minLength: i18next.t('validation.user.firstname.minLength'),
          },
        },
        lastname: {
          type: 'string',
          minLength: 1,
          errorMessage: {
            minLength: i18next.t('validation.user.lastname.minLength'),
          },
        },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
}
