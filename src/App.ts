import { Airport } from "./models/Airport";
import { AirportChartList } from "@/models/AirportChartList";

import { AiswebService } from "@/services/AiswebService";
import { OpenNavChartsRepositoryPrisma } from "@/repositories/OpenNavChartsRepositoryPrisma";
import { ChartFilesRepositoryS3Bucket } from "@/repositories/ChartFilesRepositoryS3Bucket";

import { AIRPORTS_PER_PAGE } from "@/constants";

export class App {
  aiswebService = new AiswebService();
  openNavChartsRepository = new OpenNavChartsRepositoryPrisma();
  chartFilesRepository = new ChartFilesRepositoryS3Bucket(
    process.env.AWS_ACCESS_KEY_ID!,
    process.env.AWS_SECRET_ACCESS_KEY!,
    process.env.AWS_BUCKET_REGION!,
    process.env.AWS_BUCKET_NAME!,
  );

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

      const airportsSaveds = await this.openNavChartsRepository.getAirports();
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
                await this.openNavChartsRepository.saveAirport(airport),
                await this.chartFilesRepository.saveChartFiles(airport.icao, airport.charts)
              ]);
            } else {
              await Promise.all([
                await (async () => {
                  if (!Airport.checkIsUpdated(airport, savedAirport)) {
                    console.log(`[${airport.icao}] - Updated`);
                    await this.openNavChartsRepository.saveAirport(airport);
                  }
                })(),
                await (async () => {
                  if (!AirportChartList.checkIsUpdated(airport.charts, savedAirport.charts)) {
                    console.log(`[${airport.icao}] - Updated Charts`);
                    await this.openNavChartsRepository.updateAirportChartsLastUpdate(airport.icao, airport.charts.lastUpdate);
                    await this.chartFilesRepository.saveChartFiles(airport.icao, airport.charts);
                  }
                })()
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