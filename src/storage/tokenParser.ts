import { Credentials } from 'google-auth-library';
import fs from 'fs';
import deepmerge from 'deepmerge';


interface Tokens extends Credentials {

  refresh_token?: string | null;
  /*** The time in ms at which this token is thought to expire.*/
  expiry_date?: number | null;
  /*** A token that can be sent to a Google API.*/
  access_token?: string | null;
  /*** Identifies the type of token returned. At this time, this field always has the value Bearer.*/
  new_access_token?: boolean;
  /*** Signifies wether a new token is being returned or not */
  token_type?: string | null;
  /*** A JWT that contains identity information about the user that is digitally signed by Google.*/
  id_token?: string | null;
  /*** The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings.*/
  scope?: string;
}

export default class TokenParser {
  TOKEN_PATH: string;
  fsPromises = fs.promises;
  patternToMatch: RegExp;

  constructor(params: {
    TOKEN_PATH: string
  }) {
    this.TOKEN_PATH = params.TOKEN_PATH
    this.fsPromises = fs.promises
    this.patternToMatch = /(?<=Bearer ).+/
  }

  async writeTokens(tokens: Tokens) {
    if (tokens.access_token && tokens.new_access_token) {
      const parsedAccessToken = this.parseAccessToken(tokens.access_token)
      tokens.access_token = parsedAccessToken
    }
    // ---> using deepmerge, will return the delta in tokens for new access_token
    const tokenFile = await this.fsPromises.readFile(this.TOKEN_PATH)
    const oldParsedTokens = await JSON.parse(tokenFile.toString())
    const newTokens: Tokens = deepmerge(oldParsedTokens, tokens)
    this.fsPromises.writeFile(this.TOKEN_PATH, JSON.stringify(newTokens))
  }

  async loadTokens(): Promise<Tokens> {
    const tokenFile = await this.fsPromises.readFile(this.TOKEN_PATH)
    const parsedTokens = await JSON.parse(tokenFile.toString())
    return parsedTokens
  }

  parseAccessToken(access_token: string): string {
    const parsedAccessToken = access_token.match(this.patternToMatch)
    if (parsedAccessToken)
      return parsedAccessToken[0]
    else {
      console.log('[TOKENPARSER][ACCESS_TOKEN] Error Parsing Access Token, ')
      process.exit(1)
    }
  }
}
