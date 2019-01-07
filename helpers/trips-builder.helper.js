// const cheerio = require('cheerio')
const moment = require('moment')

var buildTrip = ($1, $2) => {
  var date = $2.text().trim() // temporary date
  var type = $1.find('.travel-way').text().trim()
  var departureTime = $1.find('.origin-destination-hour').first().text().trim()
  var departureStation = $1.find('.origin-destination-station').first().text().trim()
  var arrivalTime = $1.find('.origin-destination-hour').eq(1).text().trim()
  var arrivalStation = $1.find('.origin-destination-station').eq(1).text().trim()
  var trainType = $1.find('.segment').first().text().trim()
  var trainNumber = $1.find('.segment').eq(1).text().trim()

  return {
    'type': type,
    'date': date,
    'trains': [
      {
        'departureTime': departureTime,
        'departureStation': departureStation,
        'arrivalTime': arrivalTime,
        'arrivalStation': arrivalStation,
        'type': trainType,
        'number': trainNumber
      }
    ]
  }
}

var addPassengersWithIndex = (trains, $, i) => {
  trains['passengers'] = []
  $('.passengers').eq(i).find('.typology').each(function (j, elem) {
    var passenger = $(this).text()
    var description = $('.passengers').eq(i).find('.fare-details').eq(j).text()
    var passengerAge = passenger.split('(')[1].trim().slice(0, -1)
    trains['passengers'].push(
      {
        type: isEchangeable(description) ? 'échangeable' : 'pas échangeable',
        age: passengerAge
      }
    )
  })
}

var isEchangeable = (string) => {
  return string.includes('Billet échangeable')
}

var addYearToDates = (trips, $) => {
  trips.forEach((trip, i) => {
    var summary = $('.pnr-summary').eq(Math.floor(i / 2)).text()
    var found = summary.match(/\d{2}\/\d{2}\/\d{4}/g)
    trip.date = moment(found[i % 2], 'DD/MM/YYYY').toDate()
  })
}

module.exports.buildTrips = ($) => {
  var trips = []
  $('.product-details').each(function (i, elem) {
    trips.push(buildTrip($(this), $('.product-travel-date').eq(i)))
  })
  var last = trips.length - 1
  addPassengersWithIndex(trips[last].trains[0], $, last)
  addYearToDates(trips, $)
  return trips
}
