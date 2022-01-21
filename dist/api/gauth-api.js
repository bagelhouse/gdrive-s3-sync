"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
class GAuthRequestor {
    constructor(params) {
        this.fsPromises = fs_1.default.promises;
        this.redirect_uri = params.redirect_uri;
        this.client_id = params.client_id;
        this.scopes = params.scopes;
        this.access_type = params.access_type;
        this.client_secret = params.client_secret;
        this.hosted_domain = params.hosted_domain;
        this.state = process.env.STATE;
        this.authConstruct = new googleapis_1.google.auth.OAuth2(this.client_id, this.client_secret, this.redirect_uri);
        this.authRequestURL = undefined;
        this.authCode = undefined;
        this.TOKEN_PATH = 'storage/token.json';
        this.fsPromises = fs_1.default.promises;
    }
    getOAuthURL() {
        try {
            const authURL = this.authConstruct.generateAuthUrl({
                access_type: this.access_type,
                hd: this.hosted_domain,
                scope: this.scopes,
                state: this.state
            });
            this.authRequestURL = authURL;
            return authURL;
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }
    setupAuthentication(code) {
        return __awaiter(this, void 0, void 0, function* () {
            this.authCode = code;
            if (this.authCode != undefined) {
                const { tokens } = yield this.authConstruct.getToken(this.authCode);
                console.log(tokens);
                this.authConstruct.setCredentials(tokens);
                this.fsPromises.writeFile(this.TOKEN_PATH, JSON.stringify(tokens));
            }
        });
    }
    parser() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield this.fsPromises.readFile(this.TOKEN_PATH);
            const parsedToken = yield JSON.parse(token.toString());
            return parsedToken;
        });
    }
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = yield this.fsPromises.readFile(this.TOKEN_PATH);
                const parsedToken = yield JSON.parse(token.toString());
                this.authConstruct.setCredentials(parsedToken);
                return true;
            }
            catch (err) {
                console.log(err);
                return false;
            }
        });
    }
    authStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokens = yield this.parser();
            console.log(yield this.authConstruct.getTokenInfo(tokens.access_token));
        });
    }
}
exports.default = GAuthRequestor;
// http://localhost:3000/?state=F33B20A920C7C9D46D38DCC443A8F4566271CE77758CA65DC926115054DEC7CE&code=4/0AX4XfWhSSLHsLU6QH-shbGdX5M0j7ebK2G_77Y-xFZCPN7PumOhagDhmlPF4yTczZSBWSQ&scope=https://www.googleapis.com/auth/drive.metadata.readonly
