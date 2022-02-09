import AWS from "aws-sdk"
import { defaultProvider } from "@aws-sdk/credential-provider-node"
import {
  S3Client,
  paginateListObjectsV2,
} from "@aws-sdk/client-s3" 

export default class S3Manager {

  client: S3Client
  secretId: string | undefined

  constructor( 
  ) {
    this.client = new S3Client(defaultProvider)
  }

  async getS3Files (params: { Bucket: string, Prefix: string}) {

    const totalFiles = []
    for await (const data of paginateListObjectsV2({client: this.client}, params)) {
      totalFiles.push(...(data.Contents ?? []))
    }
    return totalFiles
  }

}