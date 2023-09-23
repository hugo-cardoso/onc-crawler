import { DOMParser } from "@xmldom/xmldom";
import { AirportChart } from "@/models/AirportChart";

export class AirportChartsXMLConverter {
  static convert(xml: string): AirportChart[] {
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    
    const items = doc.getElementsByTagName("item");
    const charts = Array.from(items).map(item => {
      const id = item.getElementsByTagName("id")[0]?.textContent?.trim() || "";
      const name = item.getElementsByTagName("nome")[0]?.textContent?.trim() || "";
      const type = item.getElementsByTagName("tipo")[0]?.textContent?.trim() || "";
      const url = item.getElementsByTagName("link")[0]?.textContent?.trim() || "";

      return new AirportChart(
        id,
        name,
        type,
        url
      );
    });

    return charts;
  }
}