"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = __importStar(require("chai"));
const tokenParser_1 = __importDefault(require("@storage/tokenParser"));
const sinon_1 = __importDefault(require("sinon"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
chai_1.default.use(sinon_chai_1.default);
describe('[TEST][UNIT][TOKENPARSER] Running Tests...', function () {
    beforeEach(() => {
        sinon_1.default.stub(process, 'exit');
    });
    afterEach(() => {
        sinon_1.default.restore();
    });
    it("[ACCESS_TOKEN] Testing Access Token Parsing Method - Delta", function () {
        const parser = new tokenParser_1.default({ TOKEN_PATH: process.cwd() + '/src/test/mocha/junk/token.json' });
        const input_token = 'Bearer ya29.A0ARrdaM8zDHibv8pxhU-k-m-MuetJ1caGUUsdfsafmnhbvsdfmj,gaswjdfhgsdfvhbsdfjhg3425345345fYvTtrwrg29Q';
        const expected_token = 'ya29.A0ARrdaM8zDHibv8pxhU-k-m-MuetJ1caGUUsdfsafmnhbvsdfmj,gaswjdfhgsdfvhbsdfjhg3425345345fYvTtrwrg29Q';
        const testToken = parser.parseAccessToken(input_token);
        (0, chai_1.expect)(testToken).to.equal(expected_token);
    });
    it("[ACCESS_TOKEN] Testing Access Token Parsing Method - Failed", function () {
        const parser = new tokenParser_1.default({ TOKEN_PATH: process.cwd() + '/src/test/mocha/junk/token.json' });
        const input_token = 'ya29.A0ARrdaM8zDHibv8pxhU-k-m-MuetJ1caGUUsdfsafmnhbvsdfmj,gaswjdfhgsdfvhbsdfjhg3425345345fYvTtrwrg29Q';
        parser.parseAccessToken(input_token);
        (0, chai_1.expect)(process.exit).to.have.been.called;
    });
});
