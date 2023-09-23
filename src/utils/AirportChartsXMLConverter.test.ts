import { expect, test, describe } from "vitest";

import fs from "fs";
import path from "path";

import { AirportChartsXMLConverter } from "./AirportChartsXMLConverter";
import { AirportChart } from "@/models/AirportChart";

const ChartsMockXMLData = fs.readFileSync(path.resolve(__dirname, "../mockDatas/charts.xml"), "utf-8");

const airportCharts = AirportChartsXMLConverter.convert(ChartsMockXMLData);

describe("AirportChartsXMLConverter", () => {
  test("O método .convert deve retornar uma lista de AirportChart", () => {
    for (const airportChart of airportCharts) {
      expect(airportChart).instanceOf(AirportChart);
    }

    expect(airportCharts).toHaveLength(3);
  });

  test("O método .convert deve criar AirportChart corretamente", () => {
    const airportChart = airportCharts.at(0)!;

    expect(airportChart.id).toBe("c989852d-7005-403a-b094a64a50bd071c");
    expect(airportChart.name).toBe("AD 2 SBSP A");
    expect(airportChart.type).toBe("AOC");
    expect(airportChart.url).toBe("https://aisweb.decea.gov.br/download/?arquivo=c989852d-7005-403a-b094a64a50bd071c&amp;apikey=1635529713");
  });

  test("O método .convert deve criar as instancias de AirportChart corretamente mesmo que o XML não tenha todos os dados", () => {
    const airportCharts = AirportChartsXMLConverter.convert("<item></item>");
    const airportChart = airportCharts.at(0)!;

    expect(airportChart.id).toBe("");
    expect(airportChart.name).toBe("");
    expect(airportChart.type).toBe("");
    expect(airportChart.url).toBe("");
  });
});
