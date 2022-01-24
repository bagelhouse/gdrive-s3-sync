import chai, { expect } from 'chai'
import TokenParser from '~storage/tokenParser'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)

describe('[TEST][UNIT][TOKENPARSER] Running Tests...', function () {

  beforeEach(() => {

    sinon.stub(process, 'exit');
  });
  afterEach(() => {
    sinon.restore();
  });

  it("[ACCESS_TOKEN] Testing Access Token Parsing Method - Delta", function () {
    const parser = new TokenParser({ TOKEN_PATH: process.cwd() + '/src/test/mocha/junk/token.json' })
    const input_token = 'Bearer ya29.A0ARrdaM8zDHibv8pxhU-k-m-MuetJ1caGUUsdfsafmnhbvsdfmj,gaswjdfhgsdfvhbsdfjhg3425345345fYvTtrwrg29Q'
    const expected_token = 'ya29.A0ARrdaM8zDHibv8pxhU-k-m-MuetJ1caGUUsdfsafmnhbvsdfmj,gaswjdfhgsdfvhbsdfjhg3425345345fYvTtrwrg29Q'
    const testToken = parser.parseAccessToken(input_token)
    expect(testToken).to.equal(expected_token)
  })

  it("[ACCESS_TOKEN] Testing Access Token Parsing Method - Failed", function () {
    const parser = new TokenParser({ TOKEN_PATH: process.cwd() + '/src/test/mocha/junk/token.json' })
    const input_token = 'ya29.A0ARrdaM8zDHibv8pxhU-k-m-MuetJ1caGUUsdfsafmnhbvsdfmj,gaswjdfhgsdfvhbsdfjhg3425345345fYvTtrwrg29Q'
    parser.parseAccessToken(input_token)
    expect(process.exit).to.have.been.called
  })


});