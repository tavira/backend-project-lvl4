import { AjvValidator, Model } from 'objection';
import ajvErrors from 'ajv-errors';

class BaseModel extends Model {
  static createValidator() {
    return new AjvValidator({
      onCreateAjv(ajv) {
        return ajvErrors(ajv, { singleError: false, jsonPointers: true });
      },
      options: {
        allErrors: true,
        validateSchema: false,
        ownProperties: true,
      },
    });
  }
}

export default BaseModel;
