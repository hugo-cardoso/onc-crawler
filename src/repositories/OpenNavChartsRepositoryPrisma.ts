import { PrismaClient } from "@prisma/client";

import { Airport } from "@/models/Airport";
import { IOpenNavChartsRepository } from "./interfaces/IOpenNavChartsRepository";
import { AirportLocation } from "@/models/AirportLocation";
import { AirportChartList } from "@/models/AirportChartList";
import { AirportChart } from "@/models/AirportChart";

export class OpenNavChartsRepositoryPrisma implements IOpenNavChartsRepository {
  private prismaClient = new PrismaClient();

  async getAirports() {
    const airportsData = await this.prismaClient.airports.findMany();

    return airportsData.map(airportData => new Airport(
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
    ));
  }

  async getAirportByIcao(icao: string) {
    const airportData = await this.prismaClient.airports.findUnique({
      where: {
        id: icao
      }
    });

    if (!airportData) return null;

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

  async saveAirport(airport: Airport) {
    await this.prismaClient.airports.upsert({
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

  async updateAirportChartsLastUpdate(icao: string, lastUpdate: Date) {
    await this.prismaClient.airports.update({
      where: {
        id: icao
      },
      data: {
        chartsLastUpdate: lastUpdate
      }
    });
  }
}
