import { DOMParser } from "@xmldom/xmldom";

import { Airport } from "@/models/Airport";
import { AirportLocation } from "@/models/AirportLocation";
import { AirportRadio } from "@/models/AirportRadio";

export class AirportXMLConverter {
  static convert(xml: string): Airport {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    
    const icao = doc.getElementsByTagName("AeroCode")[0]?.textContent || "";
    const name = doc.getElementsByTagName("name")[0]?.textContent?.trim() || "";
    const city = doc.getElementsByTagName("city")[0]?.textContent?.trim() || "";
    const state = doc.getElementsByTagName("uf")[0]?.textContent?.trim() || "";
    const latitude = doc.getElementsByTagName("lat")[0]?.textContent?.trim() || "";
    const longitude = doc.getElementsByTagName("lng")[0]?.textContent?.trim() || "";

    const services = doc.getElementsByTagName("service");
    const comServices = Array.from(services).filter((service) => service.getAttribute("type") === "COM");

    const airportRadios: AirportRadio[] = Array.from(comServices).map((radio) => new AirportRadio(
      radio.getElementsByTagName("type")[0].textContent || "",
      Array.from(radio.getElementsByTagName("freq")).map((freq) => freq.textContent || "")
    ));

    const airportLocation = new AirportLocation(
      city,
      state,
      latitude,
      longitude
    );

    const airport = new Airport(
      icao,
      name,
      airportLocation,
      airportRadios,
      []
    );

    return airport;
  }
}