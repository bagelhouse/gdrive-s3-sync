import fs from "fs"
import deepmerge from "deepmerge"
import _ from "lodash"
import SecretsManager from "~/aws/secretsManager"

export default class TokenParser {
  TOKEN_PATH: string
  fsPromises = fs.promises
  patternToMatch: RegExp
  secretsManager: SecretsManager
  secretId: string | undefined

  constructor(params: {
    TOKEN_PATH: string
  }) {
    this.TOKEN_PATH = params.TOKEN_PATH
    this.fsPromises = fs.promises
    this.patternToMatch = /(?<=Bearer ).+/
    this.secretId = process.env.IS_OFFLINE ? 
      process.env.G_AUTH_AWS_SM_ID_TESTING : process.env.G_AUTH_AWS_SM_ID || undefined
    this.secretsManager = new SecretsManager({ secretId: this.secretId })
  }

  async writeTokens(tokens: Tokens) {
    if (tokens.access_token && tokens.new_access_token) {
      const parsedAccessToken = this.parseAccessToken(tokens.access_token)
      tokens.access_token = parsedAccessToken
    }
    // ---> using merge, will return the delta in tokens for new access_token
    const secretValue = await this.secretsManager.getSecretValue()
    if (secretValue) {
      const oldParsedTokens = await JSON.parse(secretValue)
      const mergedTokens: Tokens = deepmerge(oldParsedTokens, tokens)
      const newTokens = _.omit(mergedTokens, "new_access_token")
      console.log("[TOKEN PARSER] Adding Tokens", newTokens, "FOR SECRET ID", secretValue)
      await this.secretsManager.putSecretValue(JSON.stringify(newTokens))
    }
  }

  async loadTokens(): Promise<Tokens> {
    const secretValue = await this.secretsManager.getSecretValue()
    if (secretValue) {
      const parsedTokens = await JSON.parse(secretValue)
      console.log("[TOKENPARSER] RETRIEVED TOKENS,", parsedTokens)
      return parsedTokens
    }
    else {
      throw "[TOKEN_PARSER] Error parsing tokens"
    }
  }

  parseAccessToken(access_token: string): string {
    const parsedAccessToken = access_token.match(this.patternToMatch)
    if (parsedAccessToken)
      return parsedAccessToken[0]
    else {
      console.log("[TOKENPARSER][ACCESS_TOKEN] Error Parsing Access Token, ")
      process.exit(1)
    }
  }
}
