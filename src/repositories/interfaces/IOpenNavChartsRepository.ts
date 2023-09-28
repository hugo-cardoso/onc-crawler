import { Airport } from "@/models/Airport";

export interface IOpenNavChartsRepository {
  saveAirport: (airport: Airport) => Promise<void>;
  updateAirportChartsLastUpdate: (icao: string, lastUpdate: Date) => Promise<void>;
  getAirports: () => Promise<Airport[]>;
  getAirportByIcao: (icao: string) => Promise<Airport | null>;
}
