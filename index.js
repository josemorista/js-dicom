const dicom = require('dicom-parser')
const fs = require('fs')
const jpeg = require('jpeg-js')
const dicomFileAsBuffer = fs.readFileSync('./dcm1.dcm')

const dataSet = dicom.parseDicom(dicomFileAsBuffer)

// get the pixel data element (contains the offset and length of the data)
var pixelDataElement = dataSet.elements.x7fe00010

// create a typed array on the pixel data (this example assumes 8 bit unsigned data)
var pixelData = new Uint8Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length),
  i = 0

var frameData = new Buffer(1024 * 256 * 4)

while (i < frameData.length) {
  let ind = i
  frameData[i++] = pixelData[ind] // red
  frameData[i++] = pixelData[ind] // green
  frameData[i++] = pixelData[ind] // blue
  frameData[i++] = 255 // alpha - ignored in JPEGs
}

var rawImageData = {
  data: frameData,
  width: 256,
  height: 1024
}

const data = jpeg.encode(rawImageData, 50)
fs.writeFileSync('test.jpg', data.data)

//console.log(dataSet.string('x00100010'))

let str = ''
Object.keys(dataSet.elements).forEach(key => {
  let element = dataSet.elements[key]
  if (element.vr === 'US') {
    let value = dataSet.uint16(key)
    console.log(value)
  }
})
