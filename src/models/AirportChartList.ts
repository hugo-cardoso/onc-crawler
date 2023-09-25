import { AirportChart } from "./AirportChart";

export class AirportChartList {
  constructor (
    readonly items: AirportChart[],
    readonly lastUpdate: Date
  ) {}

  static checkIsUpdated(local: AirportChartList, remote: AirportChartList) {
    if (!local.lastUpdate || !remote.lastUpdate) return false;
    return local.lastUpdate.getTime() > remote.lastUpdate.getTime();
  }
}
