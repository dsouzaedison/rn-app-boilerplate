import _ from 'lodash';
import {ErrorResponse} from '../../services/core/error.response';

export class BaseResponse<T> {
  success: boolean;
  error: ErrorResponse;
  data: T;

  constructor(response: any) {
    this.success = _.get(response, 'success', false);
    this.data = _.get(response, 'data');
    this.error = _.get(response, 'error');
  }
}
