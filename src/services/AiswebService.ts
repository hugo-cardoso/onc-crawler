import Axios from "axios";

import { AirportXML } from "@/models/AirportXML";
import { AirportListXML } from "@/models/AirportListXML";
import { AirportChartListXML } from "@/models/AirportChartListXML";

import { AIRPORTS_PER_PAGE } from "@/constants";

export class AiswebService {
  readonly baseUrl = "http://aisweb.decea.gov.br/api";
  private key = process.env.AISWEB_API_KEY;
  private pass = process.env.AISWEB_API_PASS;

  private http = Axios.create({
    baseURL: this.baseUrl,
    params: {
      apiKey: this.key,
      apiPass: this.pass,
    },
  });

  async getAirportsCount() {
    try {
      const response = await this.http({
        params: {
          rowstart: 0,
          rowend: 1,
          area: "rotaer",
          type: "AD",
        },
      });

      const airports = new AirportListXML(response.data);

      return airports.total;
    } catch (error) {
      throw new Error("Error getting airports count");
    }
  }

  async getAirports(page: number) {
    try {
      const response = await this.http({
        params: {
          rowstart: page ? (page - 1) * AIRPORTS_PER_PAGE : 0,
          rowend: page * AIRPORTS_PER_PAGE,
          area: "rotaer",
          type: "AD",
        }
      });

      const airportList = new AirportListXML(response.data);
      const icaos = airportList.items.map(airport => airport.icao).filter(Boolean) as string[];

      const airports = await Promise.all(icaos.map(icao => this.getAirportByIcao(icao)));

      return airports.filter(airport => airport.hasDoc);
    } catch (error) {
      throw new Error("Error getting airports");
    }
  }

  async getAirportByIcao(icao: string) {
    try {
      const response = await this.http({
        params: {
          icaoCode: icao,
          area: "rotaer",
        }
      });

      if (!response.data) {
        throw new Error(`Airport ${icao} not found`);
      }

      const airport = new AirportXML(response.data);

      return airport;
    } catch (error) {
      console.log(error);
      throw new Error("Error getting airport by ICAO");
    }
  }

  async getAirportChartsByIcao(icao: string) {
    try {
      const response = await this.http({
        params: {
          icaoCode: icao,
          area: "cartas",
        }
      });

      const charts = new AirportChartListXML(response.data);

      return charts.items;
    } catch (error) {
      throw new Error("Error getting airport charts by ICAO");
    }
  }
}
