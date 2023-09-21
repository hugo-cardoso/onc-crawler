import { DOMParser } from "@xmldom/xmldom";
import { AirportListItemXML } from "@/models/AirportListItemXML";

export class AirportListXML {
  private data: string;
  private doc: Document;

  constructor(_data: string) {
    this.data = _data;
    this.doc = new DOMParser().parseFromString(this.data, "text/xml");
  }

  get items() {
    const items = this.doc.getElementsByTagName("item");
    return Array.from(items).map(item => new AirportListItemXML(item.toString()));
  }

  get total() {
    return Number(this.doc.getElementsByTagName("rotaer")[0].getAttributeNS(null, "total"));
  }
}