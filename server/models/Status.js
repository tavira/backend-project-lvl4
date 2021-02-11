import objectionUnique from 'objection-unique';
import i18next from 'i18next';

import BaseModel from './BaseModel';

const unique = objectionUnique({ fields: ['name'] });

export default class Status extends unique(BaseModel) {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: {
          type: 'string',
          minLength: 1,
          errorMessage: {
            minLength: i18next.t('validation.status.name.minLength'),
          },
        },
      },
    };
  }
}
