import {AxiosError} from 'axios';
import {stores} from '../../stores';
import {ErrorResponse} from './error.response';

/**
 * This class gets access when a request is failed.
 * Things like expired token can be identified here.
 */
export class ServiceErrorHandler {
  static STATUS = {
    UNAUTHORISED: 401,
  };
  static ROUTE_NAMES = {
    AUTH_FAILED: 'AuthFailed',
  };

  private navigateTo(routeName: string, params?: object) {
    if (routeName) {
      console.log(routeName, params);
      // NavigationActions.navigate(routeName)
    }
  }

  handleError(e: AxiosError): AxiosError | undefined {
    let response;
    const errorResponse = new ErrorResponse(e);
    const status = errorResponse.statusCode;

    switch (status) {
      // Whenever an API returns unauthorised status code, clear cache and navigate back to login
      case ServiceErrorHandler.STATUS.UNAUTHORISED:
        this.navigateTo('Login');
        stores.resetStore();
        break;
      default:
        response = e;
    }

    return response;
  }
}
