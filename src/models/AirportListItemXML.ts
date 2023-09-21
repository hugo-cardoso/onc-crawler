import { DOMParser } from "@xmldom/xmldom";

export class AirportListItemXML {
  private data: string;
  private doc: Document;

  constructor(_data: string) {
    this.data = _data;
    this.doc = new DOMParser().parseFromString(this.data, "text/xml");
  }

  get icao() {
    return this.doc.getElementsByTagName("AeroCode")[0]?.textContent;
  }

  get name() {
    return this.doc.getElementsByTagName("name")[0]?.textContent;
  }
}