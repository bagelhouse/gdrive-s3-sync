import GAuthRequestor from "~/api/gauth"

const googleAuthRequest = new GAuthRequestor({
  redirect_uri: "http://localhost:3000",
  client_id: process.env.CLIENT_ID,
  scopes: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
  access_type: "offline",
  client_secret: process.env.CLIENT_SECRET,
  hosted_domain: "bagelhouse.co",
  TOKEN_PATH: process.cwd() + "/src/storage/token.json"
})

export default googleAuthRequest
