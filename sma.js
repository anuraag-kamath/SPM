
var fs = require('fs');
fs.readFile('activation.html', function (err, data) {

    console.log(data.toString());

    data = data.toString().replace("##userId##", "AK");
    data = data.toString().replace("##emailId##", "AK");
    data = data.toString().replace("##activationId##", "AK");
    console.log(data.toString());



});