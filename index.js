const http = require('http')
const request = require('request')
const jsdom = require('jsdom')
const { JSDOM } = jsdom
const token = process.env['tg_api_key'] || '755380132:AAH326o9uguBRBOC9qpGX_n5TvQug85W8Ys'
const webHookUrl = 'https://telebot.mudrayaod.now.sh'

const sendMessage = (chatId, text, res) => {
  const sendMessageUrl = `https://api.telegram.org/bot${token}/sendMessage`

  request.post({
        url: sendMessageUrl,
        method: 'post',
        body: {
          chat_id: chatId,
          text: text
        },
        json: true
      },
      (error, response, body) => {
        console.log(error)
        console.log(body)
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end()
      }
  )
}

http.createServer(function (req, res) {
  let data = ''

  req.on('data', chunk => {
    data += chunk
  })

  req.on('end', () => {
    const parsedUpdate = data != '' ? JSON.parse(data) : {}
    if (typeof parsedUpdate.message !== 'undefined') {
      const text = parsedUpdate.message.text.toString()
      const chatId = parsedUpdate.message.chat.id
      sendMessage(chatId,text,res)
    }
  })
}).listen(3000)

const setWebHook = () => {
  const setWebhookUrl = `https://api.telegram.org/bot${token}/setWebhook`

  request.post({
        url: setWebhookUrl,
        method: 'post',
        body: {
          url: webHookUrl
        },
        json: true
      },
      (error, response, body) => {
        console.log(body)
        console.log(error)
      })
}

setWebHook()
