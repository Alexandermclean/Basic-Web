const fs = require('fs')

const Screen_Size_Map = [
  {min: 900, max: 1199, value: 12},
  {min: 1200, max: 1499, value: 16},
  {min: 1500, max: 1899, value: 20},
  {min: 1900, max: 2199, value: 26},
  {min: 2200, max: 2799, value: 36},
  {min: 2800, max: 3799, value: 50},
  {min: 3800, max: 4100, value: 56}
]

function getCurrentSizeHtmlFontSize (screenWidth) {
  var value = 10
  if (!(screenWidth && !isNaN(parseInt(screenWidth)))) {
    screenWidth = parseInt(document.body.clientWidth)
  }
  for (var i = 0; i < Screen_Size_Map.length; i++) {
    if (screenWidth >= Screen_Size_Map[i].min && screenWidth <= Screen_Size_Map[i].max) {
      value = Screen_Size_Map[i].value
      break
    }
  }
  return value
}

function remToPx (remSize, baseFontSize) {
  var _val = parseFloat(remSize)
  if (!isNaN(_val)) {
    var bfs = baseFontSize || this.getCurrentSizeHtmlFontSize()
    return bfs * _val
  } else {
      throw new TypeError('function remToPx wrong paramter in seccloud.js.');
  }
}

function PxToRem (pxSize, baseFontSize) {
  var _val = parseFloat(pxSize)
  if (_val && !isNaN(_val)) {
    var bfs = baseFontSize || this.getCurrentSizeHtmlFontSize()
    return (_val / bfs)
  } else {
    throw new TypeError('function pxSize only accept number as paramter.')
  }
}

function parseToPxSize (val, isPercent) {
  var result = 0;
  if (val) {
    var _val = val;
    if(!isNaN(_val)){
        _val = parseFloat(_val);
    }
    switch (typeof(_val)) {
      case "number":
        if (isPercent) {
          result = _val + '%';
        } else {
          result = _val + 'px';
        }
        break;
      case "string":
        if (/^\d+(\.\d+)?px$/.test(_val)) {
          result = _val + 'px'
        } else if (/^\d+(\.\d+)?rem$/.test(_val)) {
          result = remToPx(parseFloat(_val)) + 'px'
        }
        break;
    }
  }
  return result;
}

fs.readFile('dist/styles/iview.css', function (err, result){
  if (err) {
    console.error(err)
  } else {
    var cssContent = result.toString()
    var reg = /(\-)?((\d+(\.\d*)?)|(\.\d+))px/g
    var convertCount = 0
    var newContent = cssContent.replace(reg, function (originalText) {
      if (/-\.\d+/.test(originalText)) {
        originalText = originalText.replace('-.','-0.')
      }
      var val = parseFloat(originalText)
      var remVal = val
      if (val) {
        remVal = (PxToRem(val, 20) + 'rem')
        convertCount++
        console.log(`${originalText}=${remVal}`)
      } else {
        console.warn('invalid value ' + originalText)
      }
      return remVal.toString()
    })
    console.log(`----------------------\nSuccess\nConvert ${convertCount} places.\n----------------------`)
    fs.writeFile('dist/styles/iview-seccloud-330.css', newContent, function (err) {
      if (err) {
        console.error(err)
      } else {
        console.log('Convert Finish')
      }
    })
  }
})
