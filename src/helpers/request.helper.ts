import _ from 'lodash';

type ResourceUrl = string;

export class RequestHelper {
  private readonly resourceUrl: ResourceUrl;

  constructor(url: string) {
    this.resourceUrl = url;
  }

  addQueries(queryObj?: Record<string, any>): ResourceUrl {
    if (!queryObj) {
      return this.resourceUrl;
    }

    const keys: string[] = [];
    let queryString = this.resourceUrl;

    // Store the keys that have values
    _.each(queryObj, (value, key) => {
      if (!_.isNil(value)) {
        keys.push(key);
      }
    });

    if (keys.length) {
      keys.forEach((key, index) => {
        const symbol = !!index ? '&' : '?';
        // @ts-ignore
        queryString = `${queryString}${symbol}${_.snakeCase(
          key,
        )}=${encodeURIComponent(queryObj[key].toString())}`;
      });
    }

    return queryString;
  }
}
