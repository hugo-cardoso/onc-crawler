import { S3Client } from "@aws-sdk/client-s3";
import { Upload  } from "@aws-sdk/lib-storage";

export class BucketS3Service {
  private accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
  private secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;
  private region = process.env.AWS_BUCKET_REGION!;
  private name =  process.env.AWS_BUCKET_NAME!;

  readonly client = new S3Client({
    credentials: {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    },
    region: this.region,
  });

  async uploadFile(file: File, key: string) {
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.name,
        Key: key,
        Body: file,
      },
    });

    return upload.done();
  }
}
