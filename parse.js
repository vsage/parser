const cheerio = require('cheerio')
const fs = require('fs')
const { removeChar, convertToNumber } = require('./helpers/text-transform.helper')
const { buildTrips } = require('./helpers/trips-builder.helper')

var rawHtml = fs.readFileSync('test.html', 'utf8')

var cleanHtml = removeChar(rawHtml, '\\\\r\\\\n')
cleanHtml = removeChar(cleanHtml, '\\\\')

const $ = cheerio.load(cleanHtml)

var answer = {
  status: 'ok',
  result: {
    trips: [
      {
        code: '',
        name: '',
        details: {
        }
      }
    ],
    custom: {
      prices: [

      ]
    }
  }
}

var addOverallInformations = (trip, $) => {
  var totalAmount, dossier, name
  totalAmount = convertToNumber($('.total-amount').find($('.very-important')).text())
  dossier = $('.block-pnr').last().find('.pnr-ref').find('span').text().trim()
  name = $('.block-pnr').last().find('.pnr-name').find('span').text().trim()

  trip['code'] = dossier
  trip['name'] = name
  trip.details['price'] = totalAmount
}

var addCustomInformation = (prices, $) => {
  $('.product-header').each(function (i, elem) {
    var price = $(this).find('.cell').last().text() || $(this).find('.amount').text()
    prices.push({
      value: convertToNumber(price)
    })
  })
}

var fillAnswer = (answer, $) => {
  answer.result.trips[0].details.roundTrips = buildTrips($)
  addOverallInformations(answer.result.trips[0], $)
  addCustomInformation(answer.result.custom.prices, $)
}

fillAnswer(answer, $)

fs.writeFile('final-answer.json', JSON.stringify(answer), 'utf8', () => {
  console.log('File written as final-answer.json')
})
