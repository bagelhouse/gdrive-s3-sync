import { OAuth2Client } from 'google-auth-library';
import {
  google,   // The top level object used to access services
  drive_v3, // For every service client, there is an exported namespace
  Auth,     // Namespace for auth related types
  Common,   // General types used throughout the library
} from 'googleapis';
import { http, https } from 'follow-redirects';
import express, { Express, Request, Response } from 'express';
import fs from 'fs';


interface Tokens {
  access_token: string;
  scope: Array<string> | string;
  refresh_token: string;
}

export default class GAuthRequestor {
  redirect_uri: string;
  client_id: string | undefined;
  scopes: Array<string>;
  access_type: string;
  client_secret: string | undefined;
  hosted_domain: string;
  state: string | undefined;
  authConstruct: OAuth2Client;
  authRequestURL: string | undefined;
  authCode: string | undefined;
  TOKEN_PATH: string;
  fsPromises = fs.promises;

  constructor(params: {
    redirect_uri: string,
    client_id: string | undefined,
    scopes: Array<string>,
    access_type: string,
    client_secret: string | undefined,
    hosted_domain: string
  }) {
    this.redirect_uri = params.redirect_uri
    this.client_id = params.client_id;
    this.scopes = params.scopes;
    this.access_type = params.access_type;
    this.client_secret = params.client_secret;
    this.hosted_domain = params.hosted_domain;
    this.state = process.env.STATE;
    this.authConstruct = new google.auth.OAuth2(this.client_id, this.client_secret, this.redirect_uri)
    this.authRequestURL = undefined
    this.authCode = undefined
    this.TOKEN_PATH = 'storage/token.json'
    this.fsPromises = fs.promises
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
  async setupAuthentication(code: any) {
    this.authCode = code
    if (this.authCode != undefined) {
      const { tokens } = await this.authConstruct.getToken(this.authCode)
      console.log(tokens)
      this.authConstruct.setCredentials(tokens)
      this.fsPromises.writeFile(this.TOKEN_PATH, JSON.stringify(tokens))
    }
  }

  async parser(): Promise<Tokens> {
    const token = await this.fsPromises.readFile(this.TOKEN_PATH)
    const parsedToken = await JSON.parse(token.toString())
    return parsedToken
  }


  async authenticate(): Promise<boolean> {

    try {

      const token = await this.fsPromises.readFile(this.TOKEN_PATH)
      const parsedToken = await JSON.parse(token.toString())
      this.authConstruct.setCredentials(parsedToken)

      return true

    } catch (err) {
      console.log(err)
      return false
    }

  }

  async authStatus() {
    const tokens = await this.parser()
    console.log(await this.authConstruct.getTokenInfo(tokens.access_token))
  }




}

