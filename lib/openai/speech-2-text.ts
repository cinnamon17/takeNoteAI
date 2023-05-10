const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
let data = new FormData()


export const speech2Text = async (filePath: string) => {


  data.append('file', fs.createReadStream(filePath))
  data.append('model', 'whisper-1')

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.openai.com/v1/audio/transcriptions',
    headers: {
      'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
      ...data.getHeaders()
    },
    data: data
  }

  const response = await axios.request(config)

  return response.data.text

}
