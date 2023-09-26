import { AiswebService } from "@/services/AiswebService";
import { OpenNavChartsService } from "./services/OpenNavChartsService";
import { AirportChartList } from "@/models/AirportChartList";

import { AIRPORTS_PER_PAGE } from "@/constants";
import { Airport } from "./models/Airport";

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

      const airportsSaveds = await this.openNavChartsService.getAirports();
      console.log(`Saveds Airports: ${airportsSaveds.length}`);

      for (let page = 1; page <= airportsPageCount; page++) {
        console.time("Finished in");
        console.log("--------------------------------------------------");
        console.log(`Page: ${page}/${airportsPageCount}`);
        console.log("--------------------------------------------------");
        
        const airports = await this.aiswebService.getAirports(page);

        await Promise.all(
          airports.map(async (airport) => {
            console.log(`[${airport.icao}] - Loading`);
            airport.charts = await this.aiswebService.getAirportChartsByIcao(airport.icao);

            const savedAirport = airportsSaveds.find(savedAirport => savedAirport.icao === airport.icao);

            if (!savedAirport) {
              console.log(`[${airport.icao}] - New`);
              await Promise.all([
                await this.openNavChartsService.saveAirport(airport),
                await this.openNavChartsService.saveAirportChartsToBucket(airport)
              ]);
            } else {
              await Promise.all([
                new Promise(async (resolve) => {
                  if (!Airport.checkIsUpdated(airport, savedAirport)) {
                    console.log(`[${airport.icao}] - Updated`);
                    await this.openNavChartsService.saveAirport(airport);
                  }
                  resolve("");
                }),
                new Promise(async (resolve) => {
                  if (!AirportChartList.checkIsUpdated(airport.charts, savedAirport.charts)) {
                    console.log(`[${airport.icao}] - Updated Charts`);
                    await this.openNavChartsService.updateAirportChartsLastUpdate(airport.icao, airport.charts.lastUpdate);
                    await this.openNavChartsService.saveAirportChartsToBucket(airport);
                  }
                  resolve("");
                })
              ]);
            }

            console.log(`[${airport.icao}] - OK`);
          })
        )

        console.timeEnd("Finished in");
      }
    } catch (error) {
      console.error(error);
    }
  }
}