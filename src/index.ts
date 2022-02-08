
import app from "./app"
// import serverless from "serverless-http"
import serverless from "@vendia/serverless-express"


module.exports.handler = serverless({app})

