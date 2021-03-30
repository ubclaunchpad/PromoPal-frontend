import axios, { AxiosResponse } from 'axios';

import { EnumResponse } from '../types/api';
import { isError } from '../utils/api';
import Routes from '../utils/routes';

interface Endpoint {
  endpoint: string;
  name: '_cuisineTypes' | '_daysOfWeek' | '_discountType' | '_promotionTypes';
}

const endpoints: Endpoint[] = [
  {
    endpoint: Routes.ENUMS.CUISINE_TYPES,
    name: '_cuisineTypes',
  },
  {
    endpoint: Routes.ENUMS.DAYS_OF_WEEK,
    name: '_daysOfWeek',
  },
  {
    endpoint: Routes.ENUMS.DISCOUNT_TYPES,
    name: '_discountType',
  },
  {
    endpoint: Routes.ENUMS.PROMOTION_TYPES,
    name: '_promotionTypes',
  },
];

class EnumService {
  private _cuisineTypes: string[] = [];
  private _daysOfWeek: string[] = [];
  private _discountType: string[] = [];
  private _promotionTypes: string[] = [];

  public get cuisineTypes(): Readonly<string[]> {
    return this._cuisineTypes;
  }

  public get daysOfWeek(): Readonly<string[]> {
    return this._daysOfWeek;
  }

  public get discountTypes(): Readonly<string[]> {
    return this._discountType;
  }

  public get promotionTypes(): Readonly<string[]> {
    return this._promotionTypes;
  }

  public load(): void {
    endpoints.forEach(({ endpoint, name }) => {
      this.getEnum(endpoint)
        .then((options) => {
          this[name] = options;
        })
        .catch(() => {
          this[name] = [];
        });
    });
  }

  /**
   * Fetches the enumeration at the given endpoint.
   *
   * Example usage:
   * ```
   * import Routes from "<path-to>/utils/routes";
   * getEnum(Routes.ENUMS.CUISINE_TYPES);
   * ```
   */
  public async getEnum(endpoint: string): Promise<string[]> {
    return axios
      .get(endpoint)
      .then(({ data }: AxiosResponse<EnumResponse>) => {
        if (isError<EnumResponse>(data)) {
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      })
      .catch((err: Error) => Promise.reject(err));
  }
}

export default new EnumService();
