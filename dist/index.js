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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const gauth_api_1 = __importDefault(require("./api/gauth-api"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
const googleAuthRequest = new gauth_api_1.default({
    redirect_uri: "http://localhost:3000",
    client_id: process.env.CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    access_type: "offline",
    client_secret: process.env.CLIENT_SECRET,
    hosted_domain: "bagelhouse.co"
});
function runApp(app) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield googleAuthRequest.authenticate()) {
            app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
                res.send("all good");
                yield googleAuthRequest.authStatus();
            }));
        }
        else {
            app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
                res.send(`<h1><a href = "${googleAuthRequest.getOAuthURL()}"> Click here </a> </h1>
                    <h1>    
                    <form action="/" , method="POST">
                    <input type="text" id="code" name="code" value="${req.query.code}"><br><br>
                    <button type="submit" >Click here after Authentication</button>
                    </form>
            
                </h1>`);
            }));
            app.post('/', (req, res) => {
                console.log(req.body.code);
                googleAuthRequest.setupAuthentication(req.body.code);
                res.send('all good');
            });
        }
    });
}
runApp(app);
