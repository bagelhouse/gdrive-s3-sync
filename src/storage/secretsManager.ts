import AWS from "aws-sdk"
import { ConfigurationOptions } from "aws-sdk/lib/config-base"

export default class SecretsManager {

  clientCredentials: ConfigurationOptions
  client: AWS.SecretsManager
  secretId: string | undefined

  constructor(params: { secretId: string | undefined }
  ) {
    this.clientCredentials = {
      region: process.env.IS_OFFLINE ? process.env.LOCAL_AWS_REGION_ENV: process.env.AWS_REGION_ENV ,
      accessKeyId: process.env.IS_OFFLINE ? process.env.LOCAL_ACCESS_KEY_ID : process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.IS_OFFLINE ? process.env.LOCAL_SECRET_ACCESS_KEY : process.env.SECRET_ACCESS_KEY
    }
    this.client = new AWS.SecretsManager({ ...this.clientCredentials })
    this.secretId = params.secretId
  }



  async getSecretValue(): Promise<string | undefined> {
    console.log("[SECRETS MANAGER] SECRET KEY ID", this.secretId)
    if (this.secretId) {
      const res = await this.client.getSecretValue({ SecretId: this.secretId }).promise()
      console.log("[SECRETS MANAGER] GETTING SECRET", this.secretId)
      if (res.SecretString) {
        return res.SecretString
      }
      else {
        throw "[SECRETS_MANAGER] Error retrieving tokens from key in AWS Secrets Manager"
      }
    }
    else {
      throw "[SECRETS_MANAGER] Error retrieving keyId from AWS Parameter Store"
    }
  }

  async putSecretValue(value: string): Promise<undefined> {
    console.log("[SECRETS MANAGER] SECRET KEY ID", this.secretId)
    console.log("[SECRETS MANAGER] PUTTING SECRET", value)
    if (value && this.secretId) {
      const res = await this.client.putSecretValue({ SecretId: this.secretId, SecretString: value }).promise()
      console.log(res.$response)
    }
    else {
      console.log("some error happened")
      return undefined
    }

  }

}