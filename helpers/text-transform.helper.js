module.exports.removeChar = (str, char) => {
  var regExp = new RegExp(char, 'g')
  var newStr = str.replace(regExp, '')
  return newStr
}

module.exports.convertToNumber = (str) => {
  return Number((str.trim().split(' ')[0]).replace(',', '.'))
}
