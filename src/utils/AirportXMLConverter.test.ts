import { expect, test, describe } from "vitest";

import fs from "fs";
import path from "path";

import { Airport } from "@/models/Airport";
import { AirportRadio } from "@/models/AirportRadio";
import { AirportXMLConverter } from "./AirportXMLConverter";

const AirportMockXMLData = fs.readFileSync(
  path.resolve(__dirname, "../mockDatas/airport.xml"),
  "utf-8"
);

const airport = AirportXMLConverter.convert(AirportMockXMLData);

describe("AirportXMLConverter", () => {
  test("O método .convert deve retornar uma instancia de Airport", () => {
    expect(airport).toBeInstanceOf(Airport);
  });

  test("O método .convert deve criar uma instancia de Airport corretamente", () => {
    expect(airport.icao).toBe("SBSP");
    expect(airport.name).toBe("Congonhas");

    expect(airport.location.city).toBe("São Paulo");
    expect(airport.location.state).toBe("SP");
    expect(airport.location.latitude).toBe("-23.626111111111");
    expect(airport.location.longitude).toBe("-46.656388888889");

    expect(airport.radios).toEqual([
      new AirportRadio("Torre", ["118.050", "127.150"]),
      new AirportRadio("Solo", ["121.900"]),
      new AirportRadio("Tráfego", ["120.600"]),
      new AirportRadio("ATIS", ["127.650"]),
    ]);

    expect(airport.lastUpdate.getTime()).toBe(new Date("2023-09-07 12:00").getTime());

    expect(airport.charts.items).toEqual([]);
  });

  test("O método .convert deve criar uma instancia de Airport corretamente mesmo que o XML não tenha todos os dados", () => {
    const airport = AirportXMLConverter.convert("<airport></airport>");

    expect(airport.icao).toBe("");
    expect(airport.name).toBe("");

    expect(airport.location.city).toBe("");
    expect(airport.location.state).toBe("");
    expect(airport.location.latitude).toBe("");
    expect(airport.location.longitude).toBe("");

    expect(airport.radios).toEqual([]);

    expect(airport.charts.items).toEqual([]);
  });
});
