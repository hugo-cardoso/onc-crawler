import { DatabaseService } from "@/services/DatabaseService";

import { Airport } from "@/models/Airport";

export class OpenNavChartsService {
  private databaseService = new DatabaseService();

  async saveAirport(airport: Airport) {
    return this.databaseService.db.airports.upsert({
      where: {
        id: airport.icao
      },
      create: {
        id: airport.icao,
        icao: airport.icao,
        name: airport.name,
        location: {
          state: airport.location.state,
          city: airport.location.city,
          coordinates: {
            lat: airport.location.latitude,
            lng: airport.location.longitude,
          }
        },
        charts: airport.charts.map(chart => ({
          id: chart.id,
          name: chart.name,
          type: chart.type,
          chartUrl: chart.url,
        })),
        radios: airport.radios.map(radio => ({
          type: radio.type,
          frequences: radio.frequences
        }))
      },
      update: {
        icao: airport.icao,
        name: airport.name,
        location: {
          state: airport.location.state,
          city: airport.location.city,
          coordinates: {
            lat: airport.location.latitude,
            lng: airport.location.longitude,
          }
        },
        charts: airport.charts.map(chart => ({
          id: chart.id,
          name: chart.name,
          type: chart.type,
          chartUrl: chart.url,
        })),
        radios: airport.radios.map(radio => ({
          type: radio.type,
          frequences: radio.frequences,
        }))
      }
    });
  }
}