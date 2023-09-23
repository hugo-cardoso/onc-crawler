import { AirportLocation } from "@/models/AirportLocation";
import { AirportChart } from "@/models/AirportChart";
import { AirportRadio } from "@/models/AirportRadio";

export class Airport {
  constructor(
    public readonly icao: string,
    public readonly name: string,
    public readonly location: AirportLocation,
    public readonly radios: AirportRadio[],
    public charts: AirportChart[],
  ) {}
}
