import { AirportLocation } from "@/models/AirportLocation";
import { AirportRadio } from "@/models/AirportRadio";
import { AirportChartList } from "@/models/AirportChartList";

export class Airport {
  constructor(
    public readonly icao: string,
    public readonly name: string,
    public readonly location: AirportLocation,
    public readonly radios: AirportRadio[],
    public readonly lastUpdate: Date,
    public charts: AirportChartList,
  ) {}

  static checkIsUpdated(local: Airport, remote: Airport) {
    if (!local.lastUpdate || !remote.lastUpdate) return false;
    return remote.lastUpdate.getTime() >= local.lastUpdate.getTime();
  }
}
