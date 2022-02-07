import AWS from "aws-sdk"
import { ConfigurationOptions } from "aws-sdk/lib/config-base"

export default class SecretsManager {

  clientCredentials: ConfigurationOptions
  client: AWS.SecretsManager
  secretId: string | undefined

  constructor(params: { secretId: string | undefined }
  ) {
    this.clientCredentials = {
      region: process.env.AWS_REGION_ENV,
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY
    }
    this.client = new AWS.SecretsManager({ ...this.clientCredentials })
    this.secretId = params.secretId
  }

  async getSecretValue(): Promise<string | undefined> {
    if (this.secretId) {
      const res = await this.client.getSecretValue({ SecretId: this.secretId }).promise()
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