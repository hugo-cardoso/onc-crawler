import Axios from "axios";

import { Airport } from "@/models/Airport";

import { AirportXMLConverter } from "@/utils/AirportXMLConverter";
import { AirportChartsXMLConverter } from "@/utils/AirportChartsXMLConverter";
import { AirportBasicListXMLConverter } from "@/utils/AirportBasicListXMLConverter";

import { AIRPORTS_PER_PAGE } from "@/constants";
import { AirportChartList } from "@/models/AirportChartList";

export class AiswebService {
  static readonly baseUrl = "http://aisweb.decea.gov.br/api";
  private key = process.env.AISWEB_API_KEY;
  private pass = process.env.AISWEB_API_PASS;

  private http = Axios.create({
    baseURL: AiswebService.baseUrl,
    params: {
      apiKey: this.key,
      apiPass: this.pass,
    },
  });

  async getAirportsCount(): Promise<number> {
    try {
      const response = await this.http({
        params: {
          rowstart: 0,
          rowend: 1,
          area: "rotaer",
          type: "AD",
        },
      });

      const airports = AirportBasicListXMLConverter.convert(response.data);

      return airports.total;
    } catch (error) {
      throw new Error("Error getting airports count");
    }
  }

  async getAirports(page: number): Promise<Airport[]> {
    try {
      const response = await this.http({
        params: {
          rowstart: page ? (page - 1) * AIRPORTS_PER_PAGE : 0,
          rowend: AIRPORTS_PER_PAGE,
          area: "rotaer",
          type: "AD",
        }
      });

      const airportList = AirportBasicListXMLConverter.convert(response.data);
      const icaos = airportList.airports.map(airport => airport.icao).filter(Boolean);

      const airports = await Promise.all(icaos.map(icao => this.getAirportByIcao(icao)));

      return airports.filter(airport => airport.icao);
    } catch (error) {
      throw new Error("Error getting airports");
    }
  }

  async getAirportByIcao(icao: string): Promise<Airport> {
    try {
      const response = await this.http({
        params: {
          icaoCode: icao,
          area: "rotaer",
        }
      });

      return AirportXMLConverter.convert(response.data);
    } catch (error) {
      console.log(error);
      throw new Error("Error getting airport by ICAO");
    }
  }

  async getAirportChartsByIcao(icao: string): Promise<AirportChartList> {
    try {
      const response = await this.http({
        params: {
          icaoCode: icao,
          area: "cartas",
        }
      });

      const chartList = AirportChartsXMLConverter.convert(response.data);

      return chartList;
    } catch (error) {
      throw new Error("Error getting airport charts by ICAO");
    }
  }
}
