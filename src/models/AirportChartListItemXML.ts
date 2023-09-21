import { DOMParser } from "@xmldom/xmldom";

export class AirportChartListItemXML {
  private data: string;
  private doc: Document;

  constructor(_data: string) {
    this.data = _data;
    this.doc = new DOMParser().parseFromString(this.data, "text/xml");
  }

  get id() {
    return this.doc.getElementsByTagName("id")[0]?.textContent;
  }

  get name() {
    return this.doc.getElementsByTagName("nome")[0]?.textContent;
  }

  get type() {
    return this.doc.getElementsByTagName("tipo")[0]?.textContent;
  }

  get pdfUrl() {
    return this.doc.getElementsByTagName("link")[0]?.textContent;
  }
}