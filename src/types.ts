export type AirportChartType = {
  id: string;
  type: string;
  name: string;
  chartUrl: string;
}

export type AirportType = {
  id: string;
  icao: string;
  name: string;
  location: {
    city: string;
    state: string;
    coordinates: {
      lat: string;
      lng: string;
    };
  },
  charts: AirportChartType[];
  radios: {
    frequences: string[];
    type: string;
  }[];
  runways: {
    headboards: string[];
    ident: string;
    length: string;
    type: string;
    width: string;
  }[];
};

export interface IAirport extends AirportType {};