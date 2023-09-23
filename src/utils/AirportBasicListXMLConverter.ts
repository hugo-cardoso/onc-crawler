import { DOMParser } from "@xmldom/xmldom";

import { AirportBasic } from "@/models/AirportBasic";
import { AirportBasicList } from "@/models/AirportBasicList";

export class AirportBasicListXMLConverter {
  static convert(xml: string): AirportBasicList {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    
    const items = doc.getElementsByTagName("item");
    const total = Number(doc.getElementsByTagName("rotaer")[0].getAttributeNS(null, "total"));

    const airports = Array.from(items).map(item => {
      const icao = item.getElementsByTagName("AeroCode")[0]?.textContent?.trim() || "";
      const name = item.getElementsByTagName("name")[0]?.textContent?.trim() || "";

      return new AirportBasic(
        icao,
        name,
      );
    });

    return new AirportBasicList(
      airports,
      total
    );
  }
}