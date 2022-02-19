import S3Manager from "~/aws/s3Manager"
import GDriver from "~/google-api/gdrive"
import { OAuth2Client } from "google-auth-library"

import { queries } from "~/config/queries"


console.log("[SYNC MANAGER] Running")


export default class SyncManager {

  gDriver: GDriver

  constructor(
    params : { googleAuthConstruct: OAuth2Client}
  ) {
    console.log("[SYNC MANAGER] instantiated")
    this.gDriver = new GDriver({authConstruct: params.googleAuthConstruct, queries: queries})

  }
}
