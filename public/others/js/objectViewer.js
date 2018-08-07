var objectId = window.location.hash.substr(4);

fetch('/objects/' + objectId, {
    credentials: 'include'
}).then((prom) => prom.text()).then((res1) => {
    var objName = JSON.parse(res1)[0].schemaName;
    fetch('/objects/' + objectId + "/" + objName + "?mode=showAll", {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res2) => {
        var headers = Object.keys(JSON.parse(res1)[0].schemaStructure);
        var tableHeader = "";
        tableHeader += "<th>Object Id</th>"
        for (var i = 0; i < headers.length; i++) {
            tableHeader += "<th>" + headers[i] + "</th>"
        }
        document.getElementById('objectContent').innerHTML += "<thead>" + tableHeader + "</thead>"
        tableBody = "";
        console.log(res2);
        if (JSON.parse(res2).length > 0) {
            document.getElementById('objectContent').style.display = "block";
            document.getElementById('noObjects').style.display = "none";
        }
        else{
            document.getElementById('objectContent').style.display = "none";
            document.getElementById('noObjects').style.display = "block";

        }
        for (var i = 0; i < JSON.parse(res2).length; i++) {
            var inds = JSON.parse(res2)[i][objName];
            for (var j = 0; j < inds.length; j++) {
                tableBody += "<tr>"
                var keys = Object.keys(inds[j])
                tableBody += "<td>" + JSON.parse(res2)[i]["_id"] + "</td>"
                for (var k = 1; k < keys.length; k++) {
                    tableBody += "<td>" + inds[j][keys[k]] + "</td>"
                }

                tableBody += "</tr>"

            }
        }
        removeLoadBar();
        document.getElementById('objectContent').innerHTML += "<tbody>" + tableBody + "</tbody>"

    })
});