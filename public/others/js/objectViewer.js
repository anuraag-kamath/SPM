var objectId = window.location.hash.substr(4);
getObjects = (filter) => {
    fetch('/objects/' + objectId, {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res1) => {
        var objName = JSON.parse(res1)[0].schemaName;
        fetch('/objects/' + objectId + "/" + objName + "?mode=showAll&filter=" + filter, {
            credentials: 'include'
        }).then((prom) => prom.text()).then((res2) => {
            document.getElementById('objectContent').innerHTML = "";
            var headers = Object.keys(JSON.parse(res1)[0].schemaStructure);
            var tableHeader = "";
            tableHeader += "<th>Instance Id</th>"
            tableHeader += "<th>Object Id</th>"
            for (var i = 0; i < headers.length; i++) {
                tableHeader += "<th>" + headers[i] + "</th>"
            }

            document.getElementById('objectContent').innerHTML += "<thead>" + tableHeader + "</thead>"
            tableBody = "";
            if (JSON.parse(res2).length > 0) {
                document.getElementById('objectContent').style.display = "block";
                document.getElementById('noObjects').style.display = "none";
            }
            else {
                document.getElementById('objectContent').style.display = "none";
                document.getElementById('noObjects').style.display = "block";

            }
            document.getElementById('objectContent').innerHTML += "<tbody>";
            for (var i = 0; i < JSON.parse(res2).length; i++) {
                var inds = JSON.parse(res2)[i][objName];
                for (var j = 0; j < inds.length; j++) {
                    tableBody = "<tr>"
                    var keys = Object.keys(inds[j])
                    tableBody += "<td class='editUsers' id='" + i + "_" + JSON.parse(res2)[i]["instanceId"] + "'>" + JSON.parse(res2)[i]["instanceId"] + "</td>"

                    tableBody += "<td>" + JSON.parse(res2)[i]["_id"] + "</td>"
                    for (var k = 1; k < keys.length; k++) {
                        tableBody += "<td>" + inds[j][keys[k]] + "</td>"
                    }

                    tableBody += "</tr>"

                    document.getElementById('objectContent').innerHTML += tableBody
                    console.log("****" + i + "********");

                    console.log(i + "_" + JSON.parse(res2)[i]["instanceId"]);

                    console.log("****" + i + "********");

                }
            }
            document.getElementById('objectContent').innerHTML += "</tbody>"
            removeLoadBar();
            for (var i = 0; i < JSON.parse(res2).length; i++) {
                var bindingId = i + "_" + JSON.parse(res2)[i]["instanceId"];
                instanceIdLoader(bindingId, "workitem");

            }

        })
    });
}


getObjects("");

document.getElementById('seeker').addEventListener("keyup", (ev) => {
    console.log(ev.target.value);
    var filter = ev.target.value;
    getObjects(filter);
});