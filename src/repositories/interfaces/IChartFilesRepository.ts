import { AirportChart } from "@/models/AirportChart";
import { AirportChartList } from "@/models/AirportChartList";

export interface IChartFilesRepository {
  saveChartFile: (icao: string, chart: AirportChart) => Promise<void>;
  saveChartFiles: (icao: string, charts: AirportChartList) => Promise<void>;
}
