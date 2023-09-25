import { AirportChart } from "./AirportChart";

export class AirportChartList {
  constructor (
    readonly items: AirportChart[],
    readonly lastUpdate: Date
  ) {}
}
