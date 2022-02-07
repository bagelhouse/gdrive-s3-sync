import express, { Express, Request, Response } from "express"
import bodyParser from "body-parser"
import helmet from "helmet"
import dotenv from "dotenv"
import GAuthRequestor from "~api/gauth"
import GDriver from "~api/gdrive"

dotenv.config()

// const PORT = process.env.PORT || 3002;
const app: Express = express()

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

const googleAuthRequest = new GAuthRequestor({
  redirect_uri: "http://localhost:3000",
  client_id: process.env.CLIENT_ID,
  scopes: ["https://www.googleapis.com/auth/drive"],
  access_type: "offline",
  client_secret: process.env.CLIENT_SECRET,
  hosted_domain: "bagelhouse.co",
  TOKEN_PATH: process.cwd() + "/src/storage/token.json"
})


app.get("/", async (req: Request, res: Response) => {
  const tokenStatus = await googleAuthRequest.tokenStatus()
  if (tokenStatus.OK) {
    res.send("all good")
    console.log("AUTHENTICATION STATUS OK")
    await googleAuthRequest.setAuthentication()
    const gDrive = new GDriver({
      queries: [{
        searchFolder: true,
        folderName: "production",
        searchTrashedItems: false,
      },
      {
        searchFolder: true,
        folderName: "staging",
        searchTrashedItems: false
      }],
      authCredentials: googleAuthRequest.authConstruct
    })
    const test = await gDrive.listFiles()
    console.log(test)
    test ? gDrive.downLoadFiles(test) : null

  }
  if (tokenStatus.EXPIRED_REFRESH_TOKEN) {
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
      const gDrive = new GDriver({
        queries: [{
          searchFolder: true,
          folderName: "production",
          searchTrashedItems: false,
        },
        {
          searchFolder: true,
          folderName: "staging",
          searchTrashedItems: false
        }],
        authCredentials: googleAuthRequest.authConstruct
      })
      const test = await gDrive.listFiles()
      console.log(test)
    }
  }
})

app.post("/sendauth", (req: Request, res: Response) => {
  console.log(req.body.code)
  googleAuthRequest.setupAuthentication(req.body.code)
  res.send("all good")
})


export default app