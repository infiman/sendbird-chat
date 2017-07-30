/* @flow */
type LocationLevels = {
  level1: string,
  level2?: string,
  level3?: string,
  level4?: string,
  level5?: string,
  geoAreaServed?: string,
};

export type Location = {
  value: string,
};

export type LocationSuggestions = Array<Location>;

export const DEFAULT_USER_LOCATION = 'America';
export const USA_FULL_NAME = 'United States';
const DEFAULT_LOCATION_LEVEL_1 = 'US';

const LEVEL_1 = 'country';
const LEVEL_2 = 'administrative_area_level_1';
const LEVEL_3 = 'administrative_area_level_2';
const LEVEL_4_TYPES = [
  'sublocality_level_1',
  'locality',
];
const LEVEL_5_TYPES = [
  'postal_code',
  'postal_code_suffix',
];

const GEO_AREA_NATIONAL = 'N';
const GEO_AREA_STATE = 'S';
const GEO_AREA_LOCAL = 'L';

class LocationUtils {
  get defaultLocationLevel(): LocationLevels {
    return {
      geoAreaServed: GEO_AREA_NATIONAL,
      level1: DEFAULT_LOCATION_LEVEL_1,
    };
  }

  get _geocodeService(): Object {
    return new google.maps.Geocoder;
  }

  get _autocompleteService(): Object {
    return new google.maps.places.AutocompleteService;
  }

  _getAddressDetails(opt: Object): Promise {
    return new Promise((resolve, reject) => {
      this._geocodeService.geocode(opt, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  }

  _getPredictions(opt: Object): Promise {
    return new Promise((resolve, reject) => {
      this._autocompleteService.getPlacePredictions(opt, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  }

  _placesAdapter(predictions: Array<Object>): LocationSuggestions {
    return predictions.map(({ description }) => {
      let value = description;
      const commaId = value.lastIndexOf(',');

      if (value === 'USA') value = USA_FULL_NAME;
      if (commaId !== -1) value = value.slice(0, commaId);

      return { value };
    });
  }

  _locationByCoordinatesAdapter(results: Array<Object> = []): string {
    let result = DEFAULT_USER_LOCATION;

    if (!results.length) return result;

    const level1 = this._getLevelByType(results, LEVEL_1);
    const level2 = this._getLevelByType(results, LEVEL_2, true);

    if (!level1 || level1 !== DEFAULT_LOCATION_LEVEL_1 || !level2) return result;
    result = level2;

    return result;
  }

  _locationByAddressAdapter(results: Array<Object> = []): LocationLevels {
    if (!results.length) return this.defaultLocationLevel;

    const level1 = this._getLevelByType(results, LEVEL_1);
    const level2 = this._getLevelByType(results, LEVEL_2);
    const level3 = this._getLevelByType(results, LEVEL_3);
    const level4 = this._getLevelByTypes(results, LEVEL_4_TYPES);
    const level5Code = this._getLevelByType(results, LEVEL_5_TYPES[0]);
    const level5Suffix = this._getLevelByType(results, LEVEL_5_TYPES[1]);
    let result = { ...this.defaultLocationLevel };

    if (!level1) return result;
    result = { ...result, ...{ level1, geoAreaServed: GEO_AREA_NATIONAL } };

    if (!level2) return result;
    result = { ...result, ...{ level2, geoAreaServed: GEO_AREA_STATE } };

    if (!level3) return result;
    result = { ...result, ...{ level3, geoAreaServed: GEO_AREA_LOCAL } };

    if (!level4) return result;
    result = { ...result, ...{ level4, geoAreaServed: GEO_AREA_LOCAL } };

    if (!level5Suffix || !level5Code) return result;
    result = {
      ...result,
      ...{ level5: `${level5Code}, ${level5Suffix}`, geoAreaServed: GEO_AREA_LOCAL },
    };

    return result;
  }

  _getLevelByType(results: Array<Object>, targetType: string, isLongName?: boolean = false): string {
    const addresses = results[0].address_components;
    const target = addresses && addresses.find(address => {
      return address.types && address.types.find(type => type === targetType);
    }) || {};

    return (isLongName ? target.long_name : target.short_name) || '';
  }

  _getLevelByTypes(results: Array<Object>, targetTypes: Array<string>): string {
    for (const type of targetTypes) {
      const level = this._getLevelByType(results, type);
      if (level) return level;
    }

    return '';
  }

  async getPlaces(input: string = ''): Promise<LocationSuggestions> {
    const results = await this._getPredictions({
      input: input || USA_FULL_NAME,
      types: ['geocode'],
      componentRestrictions: {
        country: 'US',
      },
    });

    try {
      return this._placesAdapter(results);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getLocationByAddress(address: string = ''): Promise<LocationLevels> {
    const results = await this._getAddressDetails({
      address,
      componentRestrictions: {
        country: 'US',
      },
    });

    try {
      return this._locationByAddressAdapter(results);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getLocationByCoordinates(location: Object): Promise<string> {
    const result = await this._getAddressDetails({ location });

    try {
      return this._locationByCoordinatesAdapter(result);
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new LocationUtils();
