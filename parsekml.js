var fs = require('fs');
var path = require('path');
var xmlReader = require('read-xml');
var stringify = require('csv-stringify');
var convert = require('xml-js');

var FILE = path.join(__dirname, './input.kml');

xmlReader.readXML(fs.readFileSync(FILE), function (err, data) {
    if (err) {
        console.error(err);
    }
    var xml = data.content;
    //parse xml to json for easy traversal
    var result = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }));
    //first row will be the csv headers
    var multiDimesionalArray = [['name', 'longitude', 'latitude', 'coordinates']];
    //edit loop and params to your relevant kml
    for (var i = 0; i < result.kml.Document.Placemark.length; i++) {
        var longitude = result.kml.Document.Placemark[i].LookAt.longitude._text;
        var latitude = result.kml.Document.Placemark[i].LookAt.latitude._text;
        var coordinates = result.kml.Document.Placemark[i].Point.coordinates._text;
        var name = result.kml.Document.Placemark[i].name._text;
        var array = [name, longitude, latitude, coordinates]
        multiDimesionalArray.push(array);
    }
    //convert the multiDimesionalArray to csv string and write to string to csv
    stringify(multiDimesionalArray, function (err, output) {
        fs.writeFile('output.csv', output, 'utf8', function (err) {
            if (err) {
                console.log('Some error occured -');
            } else {
                console.log('It\'s saved!');
            }
        });
    });
});