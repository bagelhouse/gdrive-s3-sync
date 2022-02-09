
import { defaultProvider } from "@aws-sdk/credential-provider-node"
import { SecretsManager as AWSSecretsManager } from "@aws-sdk/client-secrets-manager"


export default class SecretsManager {

  client: AWSSecretsManager
  secretId: string | undefined

  constructor(params: { secretId: string | undefined }
  ) {
    this.client = new AWSSecretsManager(defaultProvider)
    this.secretId = params.secretId
  }


  async getSecretValue(): Promise<string | undefined> {
    console.log("[SECRETS MANAGER] SECRET KEY ID", this.secretId)
    if (this.secretId) {
      const res = await this.client.getSecretValue({ SecretId: this.secretId })
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
      const res = await this.client.putSecretValue({ SecretId: this.secretId, SecretString: value })
      console.log(res.$metadata)
    }
    else {
      console.log("some error happened")
      return undefined
    }

  }

}