import chai, { expect } from "chai"
import TokenParser from "~storage/tokenParser"
import sinon from "sinon"
import sinonChai from "sinon-chai"
chai.use(sinonChai)

describe("[TEST][UNIT][TOKENPARSER] Running Tests...", function () {

  beforeEach(() => {

    sinon.stub(process, "exit")
  })
  afterEach(() => {
    sinon.restore()
  })

  it("[ACCESS_TOKEN] Testing Access Token Parsing Method - Delta", function () {
    const parser = new TokenParser({ TOKEN_PATH: process.cwd() + "/src/test/mocha/junk/token.json" })
    const input_token = "Bearer ya29.A0ARrdaM8zDHibv8pxhU-k-m-MuetJ1caGUUsdfsafmnhbvsdfmj,gaswjdfhgsdfvhbsdfjhg3425345345fYvTtrwrg29Q"
    const expected_token = "ya29.A0ARrdaM8zDHibv8pxhU-k-m-MuetJ1caGUUsdfsafmnhbvsdfmj,gaswjdfhgsdfvhbsdfjhg3425345345fYvTtrwrg29Q"
    const testToken = parser.parseAccessToken(input_token)
    expect(testToken).to.equal(expected_token)
  })

  it("[ACCESS_TOKEN] Testing Access Token Parsing Method - Failed", function () {
    const parser = new TokenParser({ TOKEN_PATH: process.cwd() + "/src/test/mocha/junk/token.json" })
    const input_token = "ya29.A0ARrdaM8zDHibv8pxhU-k-m-MuetJ1caGUUsdfsafmnhbvsdfmj,gaswjdfhgsdfvhbsdfjhg3425345345fYvTtrwrg29Q"
    parser.parseAccessToken(input_token)
    expect(process.exit).to.have.been.called
  })


})


// for later
// async loadTokens(): Promise<Tokens> {
//   const tokenFile = await this.fsPromises.readFile(this.TOKEN_PATH)
//   const parsedTokens = await JSON.parse(tokenFile.toString())


// for later

// async writeTokens(tokens: Tokens) {
//   if (tokens.access_token && tokens.new_access_token) {
//     const parsedAccessToken = this.parseAccessToken(tokens.access_token)
//     tokens.access_token = parsedAccessToken
//   }
//   // ---> using merge, will return the delta in tokens for new access_token
//   const tokenFile = await this.fsPromises.readFile(this.TOKEN_PATH)
//   const oldParsedTokens = await JSON.parse(tokenFile.toString())
//   const newTokens: Tokens = deepmerge(oldParsedTokens, tokens)
//   this.fsPromises.writeFile(this.TOKEN_PATH, JSON.stringify(newTokens))
// }
