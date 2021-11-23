const api = require('axios').default

const GOOGLE_URL = "https://oauth2.googleapis.com/tokeninfo?access_token="

export class Api {
  static async verifyAccessToken(token: string) {
    return await api.get(GOOGLE_URL + token)
  }
}