import { OAuth2Client } from "google-auth-library"
import { google } from "googleapis"
import fs from "fs"
import TokenParser from "~storage/tokenParser"
import Tokens from "~storage/tokenParser"

const enum Status {
  EXPIRED_ACCESS_TOKEN = "EXPIRED_ACCESS_TOKEN",
  EXPIRED_REFRESH_TOKEN = "EXPIRED_REFRESH_TOKEN",
  OK = "OK"
}
type StatusKeys = { [key in Status]: boolean }

export default class GAuthRequestor extends TokenParser {
  redirect_uri: string
  client_id: string | undefined
  scopes: Array<string>
  access_type: string
  client_secret: string | undefined
  hosted_domain: string
  state: string | undefined
  authConstruct: OAuth2Client
  authRequestURL: string | undefined
  fsPromises = fs.promises

  constructor(params: {
    redirect_uri: string,
    client_id: string | undefined,
    scopes: Array<string>,
    access_type: string,
    client_secret: string | undefined,
    hosted_domain: string
    TOKEN_PATH: string
  }) {
    super(params)
    this.redirect_uri = params.redirect_uri
    this.client_id = params.client_id
    this.scopes = params.scopes
    this.access_type = params.access_type
    this.client_secret = params.client_secret
    this.hosted_domain = params.hosted_domain
    this.state = process.env.STATE
    this.authConstruct = new google.auth.OAuth2(this.client_id, this.client_secret, this.redirect_uri)
    this.authRequestURL = undefined
  }

  getOAuthURL() {
    try {
      const authURL = this.authConstruct.generateAuthUrl({
        access_type: this.access_type,
        hd: this.hosted_domain,
        scope: this.scopes,
        state: this.state
      })
      this.authRequestURL = authURL
      return authURL
    }
    catch (err) {
      console.log(err)
      return err
    }
  }

  async setupAuthentication(code: string) {
    if (code) {
      const { tokens } = await this.authConstruct.getToken(code)
      console.log("[GAUTH] Retrieved Credentials")
      if (tokens) {
        console.log("[GAUTH] Setting Credentials")
        await this.writeTokens(tokens)
        this.authConstruct.setCredentials(tokens)
        return true
      }
    }
  }

  async setAuthentication(): Promise<boolean> {
    const parsedTokens = await this.loadTokens()
    if (parsedTokens) {
      console.log("Setting Credentials")
      this.authConstruct.setCredentials(parsedTokens)
      return true
    }
    else {
      return false
    }
  }

  async setNewAuthentication(): Promise<boolean> {
    try {
      const parsedTokens = await this.loadTokens()
      const { refresh_token } = parsedTokens
      this.authConstruct.setCredentials({ refresh_token: refresh_token })
      const newAccessToken = await this.authConstruct.getRequestHeaders()
      console.log(newAccessToken.Authorization)
      await this.writeTokens({ access_token: newAccessToken.Authorization, new_access_token: true })
      const tokens = await this.loadTokens()
      this.authConstruct.setCredentials(tokens)
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async tokenStatus(): Promise<StatusKeys> {
    console.log("GETTING TOKEN STATUS")
    const status: StatusKeys = {
      [Status.EXPIRED_ACCESS_TOKEN]: false,
      [Status.EXPIRED_REFRESH_TOKEN]: false,
      [Status.OK]: false
    }
    if (!await this.refreshTokenStatus()) {
      status.EXPIRED_REFRESH_TOKEN = true
      console.log("EXPIRED REFRESH TOKEN")
    }
    else if (await this.accessTokenStatus() && await this.refreshTokenStatus()) {
      status.OK = true
      console.log("OK STATUS")
    }
    else if (!await this.accessTokenStatus() && await this.refreshTokenStatus()) {
      status.EXPIRED_ACCESS_TOKEN = true
      console.log("EXPIRED ACCESS TOKEN")
    }
    return status
  }

  async accessTokenStatus(): Promise<boolean> {
    const parsedTokens = await this.loadTokens()
    const { access_token } = parsedTokens
    if (access_token) {
      try {
        console.log("TESTING ACCESSS TOKEN STATUS")
        const accessTokenInfo = await this.authConstruct.getTokenInfo(access_token)
        console.log(accessTokenInfo)
        return true
      } catch (e) {
        console.log(e)
        return false
      }
    }
    else return false
  }

  async testRefreshTokenHeaders() {
    const parsedTokens = await this.loadTokens()
    const { refresh_token } = parsedTokens
    this.authConstruct.setCredentials({ refresh_token: refresh_token })
    try {
      const res = await this.authConstruct.getRequestHeaders()
      if (res)
        return false
    }
    catch (err) {
      console.log(err)
      return true
    }
  }

  async refreshTokenStatus(): Promise<boolean> {
    if (await this.testRefreshTokenHeaders()) {
      return false
    }
    else return true
  }

  async getAccessToken(): Promise<string | undefined> {
    const { access_token } = await this.loadTokens()
    if (access_token) {
      return access_token
    }
  }

}

