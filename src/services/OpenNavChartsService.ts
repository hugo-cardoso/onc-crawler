import Axios from "axios";

import { DatabaseService } from "@/services/DatabaseService";
import { BucketS3Service } from "@/services/BucketS3Service";

import { Airport } from "@/models/Airport";

export class OpenNavChartsService {
  private databaseService = new DatabaseService();
  private bucketS3Service = new BucketS3Service();

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

  async saveAirportChartsToBucket(airport: Airport) {
    try {
      console.log(`[${airport.icao}] - Loading charts [${airport.charts.length}]`);
      const chartsFile = await Promise.all(
        airport.charts.map(chart => {
          return Axios.get(chart.url, {
            responseType: "stream"
          })
        })
      );

      console.log(`[${airport.icao}] - Uploading charts [${chartsFile.length}]`);
      await Promise.all(
        chartsFile.map((fileResponse, index) => {
          const chart = airport.charts.at(index)!;

          return this.bucketS3Service.uploadFile(
            fileResponse.data,
            `${airport.icao}/${chart.id}.pdf`
          );
        })
      )
    } catch (error) {
      console.error(error);
    }
  }
}