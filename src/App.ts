import { AiswebService } from "@/services/AiswebService";
import { AIRPORTS_PER_PAGE } from "@/constants";

export class App {
  aiswebService = new AiswebService();

  constructor() {
    console.log("App is running");
    this.init();
  }

  async init() {
    try {
      const airportCount = await this.aiswebService.getAirportsCount();
      console.log(`Total de aeroportos: ${airportCount}`);

      const airportsPageCount = Math.ceil(airportCount / AIRPORTS_PER_PAGE);
      console.log(`Total de páginas: ${airportsPageCount}`);

      for (let page = 1; page <= airportsPageCount; page++) {
        console.log(`Página ${page}/${airportsPageCount}`);
        const airports = await this.aiswebService.getAirports(page);
  
        for (const airport of airports) {
          console.log(`${airport.icao} - ${airport.name}, ${airport.city} - ${airport.state}`);
  
          const charts = await airport.charts;
          charts.forEach(chart => {
            console.log(`${chart.id} - ${chart.name} - ${chart.type}`);
          });
        }
      }

    } catch (error) {
      console.error(error);
    }
  }
}