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
    const parsedUpdate = data !== '' ? JSON.parse(data) : {}
    if (typeof parsedUpdate.message !== 'undefined') {
      const text = parsedUpdate.message.text.toString()
      const chatId = parsedUpdate.message.chat.id
      if (text === '/start') {
        const start = 'Добро пожаловать!\nЧтобы узнать как пользоваться ботом используй команду /help'
        sendMessage(chatId, start, res)
      } else if (text === '/help') {
        const help = 'Давай же вместе узнаем, что интересного ждет тебя сегодня)\n' +
            'Надеюсь, ты знаешь свой зодиакальный знак) В зависимости от этого введи одно из следующих слов:\n\n' +
            'aries - если ты Овен\n' +
            'taurus - если ты Телец\n' +
            'gemini - если ты Близнецы\n' +
            'cancer - если ты Рак\n' +
            'leo - если ты Лев\n' +
            'virgo - если ты Дева\n' +
            'libra - если ты Весы\n' +
            'scorpio - если ты Скорпион\n' +
            'sagittarius - если ты Стрелец\n' +
            'capricorn - если ты Козерог\n' +
            'aquarius - если ты Водолей\n' +
            'pisces - если ты Рыбы\n'
        sendMessage(chatId, help, res)
      } else if (text === 'aries' || text === 'taurus' || text === 'gemini' || text === 'cancer' || text === 'leo' || text === 'virgo' ||
          text === 'libra' || text === 'scorpio' || text === 'sagittarius' || text === 'capricorn' || text === 'aquarius' || text === 'pisces') {
        let optionsJsdom = {
          referrer: 'http://astroscope.ru/horoskop/ejednevniy_goroskop/' + text + '.html'
        }
        let requestHoroscope = http.get('http://astroscope.ru/horoskop/ejednevniy_goroskop/' + text + '.html', function (responseHoroscope) {
          if (responseHoroscope.statusCode === 200) {
            JSDOM.fromURL('http://astroscope.ru/horoskop/ejednevniy_goroskop/' + text + '.html', optionsJsdom).then(dom => {
                  let horoscope = dom.window.document.querySelectorAll('.p-3')[1].innerHTML
                  sendMessage(chatId, horoscope, res)
                }
            )
          } else { sendMessage(chatId, 'Пожалуйста, придерживайся инструкции ;)', res) }
        })
        requestHoroscope.on('error', function (error) {
          console.error(error.status)
        })
      } else { sendMessage(chatId, 'Пожалуйста, придерживайся инструкции ;)', res) }
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
