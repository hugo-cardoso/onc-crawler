import { DOMParser } from "@xmldom/xmldom";

import { AiswebService } from "@/services/AiswebService";

export class AirportXML {
  private data: string;
  private doc: Document;
  private aiswebService = new AiswebService();

  constructor(_data: string) {
    this.data = _data;
    this.doc = new DOMParser().parseFromString(this.data, "text/xml");
  }

  get hasDoc() {
    return !!this.icao;
  }

  get id() {
    return this.doc.getElementsByTagName("id")[0]?.textContent;
  }

  get icao() {
    return this.doc.getElementsByTagName("AeroCode")[0]?.textContent;
  }

  get name() {
    return this.doc.getElementsByTagName("name")[0]?.textContent;
  }

  get city() {
    return this.doc.getElementsByTagName("city")[0]?.textContent;
  }

  get state() {
    return this.doc.getElementsByTagName("uf")[0]?.textContent;
  }

  get charts() {
    return (async () => {
      const charts = await this.aiswebService.getAirportChartsByIcao(this.icao!);
      return charts;
    })();
  }
}