import TokenParser from "~/storage/tokenParser"

const parser = new TokenParser({TOKEN_PATH: process.cwd() + "/src/storage/token.json"})

export default parser