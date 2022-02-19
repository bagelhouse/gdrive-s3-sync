import express, { Express, Request, Response } from "express"
import bodyParser from "body-parser"
import helmet from "helmet"
import dotenv from "dotenv"
import gauthRequest from "~/google-api/gauthRequestor"
import SyncManager from "~/syncManager"

dotenv.config()

const app: Express = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const googleAuthRequest = gauthRequest()

app.get("/", async (req: Request, res: Response) => {

  const tokenStatus = await googleAuthRequest.tokenStatus()  

  const test = new SyncManager()

  if (tokenStatus.OK) {
    console.log("AUTHENTICATION STATUS OK")
    await googleAuthRequest.setAuthentication()
    res.send("all good")

  }
  if (tokenStatus.EXPIRED_REFRESH_TOKEN) {
    console.log("[EXPIRED REFRESH TOKEN]", googleAuthRequest.getOAuthURL())
    res.send(`<h1>
            <a href = "${googleAuthRequest.getOAuthURL()}"> Click here </a> 
        </h1>
        <h1>    
            <form action="/sendauth" , method="POST">
                <input type="text" id="code" name="code" value="${req.query.code}"><br><br>
                <button type="submit" >Click here after Authentication</button>
            </form>
        </h1>`
    )
  }
  if (tokenStatus.EXPIRED_ACCESS_TOKEN) {
    const newTokenStatus = await googleAuthRequest.setNewAuthentication()
    if (newTokenStatus) {
      res.send("all good")
    }
  }
})

app.post("/sendauth", async (req: Request, res: Response) => {
  console.log("[SENDING GAUTH REQUEST]",  req.body.code)
  console.log(req.body.code)
  const test = await googleAuthRequest.setupAuthentication(req.body.code)
  if (test)
    res.send("all good")
})


export default app