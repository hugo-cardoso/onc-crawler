import { expect, test, describe } from "vitest";

import fs from "fs";
import path from "path";

import { AirportBasicListXMLConverter } from "./AirportBasicListXMLConverter";
import { AirportBasic } from "@/models/AirportBasic";

const AirportsBasicMockXMLData = fs.readFileSync(path.resolve(__dirname, "../mockDatas/airportsBasic.xml"), "utf-8");

const airportsBasicList = AirportBasicListXMLConverter.convert(AirportsBasicMockXMLData);

describe("AirportBasicListXMLConverter", () => {
  test("O método .convert deve criar retornar uma lista de AirportBasic", () => {
    for (const airportBasic of airportsBasicList.airports) {
      expect(airportBasic).instanceOf(AirportBasic);
    }

    expect(airportsBasicList.airports).toHaveLength(1);
  });

  test("O método .convert deve criar as instancias de AirportBasic corretamente", () => {
    const airportBasic = airportsBasicList.airports.at(0)!;

    expect(airportBasic.icao).toBe("SBCH");
    expect(airportBasic.name).toBe("Serafin Enoss Bertaso");
  });

  test("O método .total deve retornar o número total de aeroportos", () => {
    expect(airportsBasicList.total).toBe(3659);
  });
});
