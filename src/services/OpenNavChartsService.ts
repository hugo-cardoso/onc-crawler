import Axios from "axios";

import { DatabaseService } from "@/services/DatabaseService";
import { BucketS3Service } from "@/services/BucketS3Service";

import { Airport } from "@/models/Airport";
import { AirportLocation } from "@/models/AirportLocation";
import { AirportChart } from "@/models/AirportChart";
import { AirportChartList } from "@/models/AirportChartList";

export class OpenNavChartsService {
  private databaseService = new DatabaseService();
  private bucketS3Service = new BucketS3Service();

  async saveAirport(airport: Airport) {
    return await this.databaseService.db.airports.upsert({
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
        charts: airport.charts.items.map(chart => ({
          id: chart.id,
          name: chart.name,
          type: chart.type,
          chartUrl: chart.url,
        })),
        chartsLastUpdate: airport.charts.lastUpdate,
        radios: airport.radios.map(radio => ({
          type: radio.type,
          frequences: radio.frequences
        })),
        lastUpdate: airport.lastUpdate,
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
        charts: airport.charts.items.map(chart => ({
          id: chart.id,
          name: chart.name,
          type: chart.type,
          chartUrl: chart.url,
        })),
        chartsLastUpdate: airport.charts.lastUpdate,
        radios: airport.radios.map(radio => ({
          type: radio.type,
          frequences: radio.frequences,
        })),
        lastUpdate: airport.lastUpdate,
      }
    });
  }

  async saveAirportChartsToBucket(airport: Airport) {
    try {
      console.log(`[${airport.icao}] - Loading charts [${airport.charts.items.length}]`);
      const chartsFile = await Promise.all(
        airport.charts.items.map(chart => {
          return Axios.get(chart.url, {
            responseType: "stream"
          })
        })
      );

      console.log(`[${airport.icao}] - Uploading charts [${chartsFile.length}]`);
      await Promise.all(
        chartsFile.map((fileResponse, index) => {
          const chart = airport.charts.items.at(index)!;

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

  async getAirportByIcao(icao: string): Promise<Airport> {
    const airportData = await this.databaseService.db.airports.findUnique({
      where: {
        id: icao
      }
    });

    if (!airportData) throw new Error("Airport not found");

    return new Airport(
      airportData.icao,
      airportData.name,
      new AirportLocation(
        airportData.location.city,
        airportData.location.state,
        airportData.location.coordinates.lat,
        airportData.location.coordinates.lng
      ),
      airportData.radios,
      airportData.lastUpdate,
      new AirportChartList(
        airportData.charts.map(chart => new AirportChart(chart.id, chart.name, chart.type, chart.chartUrl)),
        airportData.chartsLastUpdate
      )
    )
  }
}