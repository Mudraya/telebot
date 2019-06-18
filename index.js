const jsdom = require('jsdom')
const { JSDOM } = jsdom
const http = require('http')
const TelegramBot = require('node-telegram-bot-api')
const token = process.env['tg_api_key'] || '755380132:AAH326o9uguBRBOC9qpGX_n5TvQug85W8Ys'
const bot = new TelegramBot(token, { polling: true })
const url = 'https://javascript.mudrayaod.now.sh'

bot.setWebHook(`${url}/bot${token}`)

bot.on('message', (msg) => {
  // console.log(msg);
  var fromId = msg.from.id
  var sign = msg.text.toString().toLowerCase()

  let optionsJsdom = {
    referrer: 'http://astroscope.ru/horoskop/ejednevniy_goroskop/' + sign + '.html'
  }

  let request = http.get('http://astroscope.ru/horoskop/ejednevniy_goroskop/' + sign + '.html', function (response) {
    if (response.statusCode === 200) {
      JSDOM.fromURL('http://astroscope.ru/horoskop/ejednevniy_goroskop/' + sign + '.html', optionsJsdom).then(dom => {
        let horoscope = dom.window.document.querySelectorAll('.p-3')[1].innerHTML
        bot.sendMessage(fromId, horoscope)
      }
      )
    } else { if (sign !== '/start' && sign !== '/help') bot.sendMessage(fromId, 'Пожалуйста, придерживайся инструкции ;)') }
  })

  request.on('error', function (error) {
    console.error(error.status)
  })
})

bot.onText(/\/(start|help)/, function (msg, match) {
  var fromId = msg.from.id

  if (match[1].toString() === 'start') {
    bot.sendMessage(fromId, 'Добро пожаловать!\nЧтобы узнать как пользоваться ботом используй команду /help')
  }

  if (match[1].toString() === 'help') {
    bot.sendMessage(fromId, 'Давай же вместе узнаем, что интересного ждет тебя сегодня)\n' +
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
      'pisces - если ты Рыбы\n')
  }
})
