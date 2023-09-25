import { expect, test, describe } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";

import fs from "fs";
import path from "path";

import { Airport } from "@/models/Airport";
import { AiswebService } from "@/services/AiswebService";
import { AirportChartList } from "@/models/AirportChartList";

const AirportXMLMockData = fs.readFileSync(path.resolve(__dirname, "../mockDatas/airport.xml"), "utf-8");
const AirportsXMLMockData = fs.readFileSync(path.resolve(__dirname, "../mockDatas/airports.xml"), "utf-8");
const AirportsBasicXMLMockData = fs.readFileSync(path.resolve(__dirname, "../mockDatas/airportsBasic.xml"), "utf-8");
const ChartsXMLMockData = fs.readFileSync(path.resolve(__dirname, "../mockDatas/charts.xml"), "utf-8");

const aiswebService = new AiswebService();

describe("AiswebService", () => {
  test("Deve retornar um aeroporto", async () => {
    const server = setupServer(
      rest.get(AiswebService.baseUrl, (_, res, ctx) => {
        return res(ctx.status(200), ctx.xml(AirportXMLMockData));
      })
    );
    server.listen();

    const response = await aiswebService.getAirportByIcao("SBSP");

    expect(response).toBeInstanceOf(Airport);
    expect(response.icao).toBe("SBSP");

    server.close();
  });

  test("Deve retornar uma lista de cartas de um aeroporto", async () => {
    const server = setupServer(
      rest.get(AiswebService.baseUrl, (_, res, ctx) => {
        return res(ctx.status(200), ctx.xml(ChartsXMLMockData));
      })
    );
    server.listen();

    const response = await aiswebService.getAirportChartsByIcao("SBSP");
    
    expect(response).toBeInstanceOf(AirportChartList);

    server.close();
  });

  test("Deve retornar o número de aeroportos", async () => {
    const server = setupServer(
      rest.get(AiswebService.baseUrl, (_, res, ctx) => {
        return res(ctx.status(200), ctx.xml(AirportsBasicXMLMockData));
      })
    );
    server.listen();

    const response = await aiswebService.getAirportsCount();

    expect(response).toBe(3659);

    server.close();
  });

  test("Deve retornar uma lista de aeroportos", async () => {
    const server = setupServer(
      rest.get(AiswebService.baseUrl, (_, res, ctx) => {
        return res(ctx.status(200), ctx.xml(AirportsXMLMockData));
      })
    );
    server.listen();

    const response = await aiswebService.getAirports(1);
    
    response.forEach(item => {
      expect(item).toBeInstanceOf(Airport);
    });

    expect(response).toHaveLength(5);

    server.close();
  });
});