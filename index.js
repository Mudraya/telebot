var TelegramBot = require('node-telegram-bot-api');
var needle = require('needle'),
    cheerio = require("cheerio");
var token = 'MY_TOKEN';
var bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    var fromId = msg.from.id;
    var sign = msg.text.toString().toLowerCase();
    var URL = 'http://astroscope.ru/horoskop/ejednevniy_goroskop/'+ sign +'.html';

    needle.get(URL, function(err, res){
        if (res.statusCode == 200)
        {
            var $ = cheerio.load(res.body),
                horoscope = $(".p-3").text();
            bot.sendMessage(fromId, horoscope);        }
    });
});


bot.onText(/\/(start|help)/, function (msg, match) {
    var fromId = msg.from.id;

    if (match[1].toString() == 'start')
    {
        bot.sendMessage(fromId, 'Добро пожаловать!\nЧтобы узнать как пользоваться ботом используй команду /help');
    }

    if (match[1].toString() == 'help')
    {
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
            'pisces - если ты Рыбы\n');
    }
});
