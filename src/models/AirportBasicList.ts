import { AirportBasic } from "./AirportBasic";

export class AirportBasicList {
  constructor(
    public readonly airports: AirportBasic[],
    public readonly total: number
  ) {}
}
