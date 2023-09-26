import { DOMParser } from "@xmldom/xmldom";

import { AirportChart } from "@/models/AirportChart";
import { AirportChartList } from "@/models/AirportChartList";

export class AirportChartsXMLConverter {
  static convert(xml: string): AirportChartList {
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

    const lastUpdate = doc.getElementsByTagName("cartas")[0]?.getAttribute("emenda");
    const lastUpdateDate = lastUpdate ? new Date(`${lastUpdate} 12:00`) : new Date();

    return new AirportChartList(
      charts,
      lastUpdateDate
    );
  }
}