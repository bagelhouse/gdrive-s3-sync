import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import GAuthRequestor from './api/gauth';


dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));


const googleAuthRequest = new GAuthRequestor({
    redirect_uri: "http://localhost:3000",
    client_id: process.env.CLIENT_ID,
    scopes: ['https://www.googleapis.com/auth/drive.metadata.readonly'],
    access_type: "offline",
    client_secret: process.env.CLIENT_SECRET,
    hosted_domain: "bagelhouse.co",
    TOKEN_PATH: './storage/token.json'
})

 

app.get('/', async (req: Request, res: Response) => {

    const tokenStatus = await googleAuthRequest.tokenStatus()
    if (tokenStatus.OK) {
        res.send("all good")
        console.log("AUTHENTICATION STATUS OK")
    }
    if (tokenStatus.EXPIRED_REFRESH_TOKEN) {

    res.send(`<h1><a href = "${googleAuthRequest.getOAuthURL()}"> Click here </a> </h1>
            <h1>    
            <form action="/" , method="POST">
            <input type="text" id="code" name="code" value="${req.query.code}"><br><br>
            <button type="submit" >Click here after Authentication</button>
            </form>
    
        </h1>`
    );
    }
    if (tokenStatus.EXPIRED_ACCESS_TOKEN) {
        googleAuthRequest.setAuthentication()
    }
}

);

app.post('/', (req: Request, res: Response) => {
    console.log(req.body.code)
    googleAuthRequest.setupAuthentication(req.body.code)
    res.send('all good')

});
    



