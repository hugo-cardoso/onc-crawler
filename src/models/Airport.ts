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
}
