import GAuthRequestor from "~/google-api/gauth"

export default function Request () {
  if (process.env.IS_OFFLINE) {
    const googleAuthRequest = new GAuthRequestor({
      redirect_uri: "http://localhost:3000",
      client_id: process.env.LOCAL_CLIENT_ID,
      scopes: ["https://www.googleapis.com/auth/drive"],
      access_type: "offline",
      client_secret: process.env.LOCAL_CLIENT_SECRET,
      hosted_domain: "bagelhouse.co",
      TOKEN_PATH: process.cwd() + "/src/storage/token.json"
    })
    console.log("[GAUTH_REQUEST] Running Offline")
    return googleAuthRequest
  }
  else {
    const googleAuthRequest = new GAuthRequestor({
      redirect_uri: "https://2ysedfq0bk.execute-api.us-east-1.amazonaws.com",
      client_id: process.env.G_AUTH_GOOGLE_CLIENT_ID,
      scopes: ["https://www.googleapis.com/auth/drive"],
      access_type: "offline",
      client_secret: process.env.G_AUTH_GOOGLE_CLIENT_SECRET_ID,
      hosted_domain: "bagelhouse.co",
      TOKEN_PATH: process.cwd() + "/src/storage/token.json"
    })
    console.log("[GAUTH_REQUEST] Running on Service")
    return googleAuthRequest
  }
}