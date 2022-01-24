"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gauth_1 = __importDefault(require("~/api/gauth"));
const googleAuthRequest = new gauth_1.default({
    redirect_uri: "http://localhost:3000",
    client_id: process.env.CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    access_type: "offline",
    client_secret: process.env.CLIENT_SECRET,
    hosted_domain: "bagelhouse.co",
    TOKEN_PATH: process.cwd() + '/src/storage/token.json'
});
exports.default = googleAuthRequest;
