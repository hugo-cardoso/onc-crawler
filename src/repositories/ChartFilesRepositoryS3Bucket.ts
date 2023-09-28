import Axios from "axios";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

import { AirportChart } from "@/models/AirportChart";
import { AirportChartList } from "@/models/AirportChartList";
import { IChartFilesRepository } from "./interfaces/IChartFilesRepository";

export class ChartFilesRepositoryS3Bucket implements IChartFilesRepository {
  readonly client: S3Client;

  constructor(
    private accessKeyId: string,
    private secretAccessKey: string,
    private region: string,
    private bucketName: string
  ) {
    this.client = new S3Client({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      region: this.region,
    });
  }

  async saveChartFile(icao: string, chart: AirportChart) {
    const fileResponse = await Axios.get(chart.url, {
      responseType: "stream",
    });

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucketName,
        Key: `${icao}/${chart.id}`,
        Body: fileResponse.data,
      },
    });

    await upload.done();
  }

  async saveChartFiles(icao: string, charts: AirportChartList) {
    console.log(`[${icao}] - Uploading charts [${charts.items.length}]`);
    await Promise.all(
      charts.items.map((chart) => this.saveChartFile(icao, chart))
    );
  };
}
