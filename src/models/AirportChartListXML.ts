import { DOMParser } from "@xmldom/xmldom";
import { AirportChartListItemXML } from "@/models/AirportChartListItemXML";

export class AirportChartListXML {
  private data: string;
  private doc: Document;

  constructor(_data: string) {
    this.data = _data;
    this.doc = new DOMParser().parseFromString(this.data, "text/xml");
  }

  get items() {
    const items = this.doc.getElementsByTagName("item");
    return Array.from(items).map(item => new AirportChartListItemXML(item.toString()));
  }
}