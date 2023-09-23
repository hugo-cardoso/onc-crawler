import { AiswebService } from "@/services/AiswebService";
import { OpenNavChartsService } from "./services/OpenNavChartsService";

import { AIRPORTS_PER_PAGE } from "@/constants";

export class App {
  aiswebService = new AiswebService();
  openNavChartsService = new OpenNavChartsService();

  constructor() {
    console.clear();
    console.log("App is running");
    this.init();
  }

  async init() {
    try {
      const airportCount = await this.aiswebService.getAirportsCount();
      const airportsPageCount = Math.ceil(airportCount / AIRPORTS_PER_PAGE);

      console.log(`Total Airports: ${airportCount}`);
      console.log(`Total Pages:    ${airportsPageCount}`);

      for (let page = 1; page <= airportsPageCount; page++) {
        console.log("--------------------------------------------------");
        console.log(`Page: ${page}/${airportsPageCount}`);
        console.log("--------------------------------------------------");
        
        const airports = await this.aiswebService.getAirports(page);

        for (const airport of airports) {
          console.log(`[${airport.icao}] - Loading`);
          airport.charts = await this.aiswebService.getAirportChartsByIcao(airport.icao);

          await this.openNavChartsService.saveAirport(airport);
          console.log(`[${airport.icao}] - OK`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}