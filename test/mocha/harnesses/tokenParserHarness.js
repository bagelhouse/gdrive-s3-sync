"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenParser_1 = __importDefault(require("~/storage/tokenParser"));
const parser = new tokenParser_1.default({ TOKEN_PATH: process.cwd() + '/src/storage/token.json' });
exports.default = parser;
