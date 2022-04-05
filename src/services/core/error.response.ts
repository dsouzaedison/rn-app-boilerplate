import {AxiosError} from 'axios';
import {BaseResponse} from '../../models/core/base-response';

export class ErrorResponse {
  private static defaultError = 'Something went wrong. Please try again later!';
  private readonly error: AxiosError<BaseResponse<any>>;

  constructor(error: AxiosError<BaseResponse<any>>) {
    this.error = error;
  }

  get message(): string {
    return (
      this.error.response?.data?.error?.message || ErrorResponse.defaultError
    );
  }

  get statusCode(): number | unknown {
    return this.error.response?.status;
  }

  getMessage() {
    return this.message;
  }
}
