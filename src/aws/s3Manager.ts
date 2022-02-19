import { defaultProvider } from "@aws-sdk/credential-provider-node"
import { S3, paginateListObjectsV2 } from "@aws-sdk/client-s3" 

export default class S3Manager {

  client: S3
  secretId: string | undefined

  constructor( 
  ) {
    this.client = new S3(defaultProvider)
  }

  async listS3Files (params: { Bucket: string, Prefix: string}) {
    console.log("ANGELO TESTING LIST FILES S3")
    const totalFiles = []
    for await (const data of paginateListObjectsV2({client: this.client}, params)) {
      totalFiles.push(...(data.Contents ?? []))
    }
    return totalFiles
  }

  

}