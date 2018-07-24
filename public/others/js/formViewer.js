var objs = [];

var cur;
console.log("LOADING");
var tempArr = [];
var instanceId = "";
var processId = "";
var formId = "";
var workitemId = "";
onLoad = (formId, processId, workitemId, instanceId) => {

    fetch('http://localhost:3000/objects', {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        objs = JSON.parse(res);


    }).then(() => {
        var tempJSON = '{"processId":"' + processId + '"}'

        fetch('http://localhost:3000/forms/' + formId, {
            credentials: 'include'
        }).then((prom) => {
            return prom.text()
        }).then((res) => {

            if (workitemId.length == 0) {
                fetch('http://localhost:3000/instance', {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'

                    },
                    credentials: 'include',
                    body: tempJSON
                }).then((prom) => prom.text()).then((res) => {
                    instanceId = JSON.parse(res)._id;
                }).then(() => {
                    loadObjects();
                })
            }

            tempArr = (JSON.parse(res).structure)
            document.getElementById('main-section').innerHTML = "";

            for (var i = 1; i < tempArr.length; i++) {
                var beta = document.createElement(tempArr[i].tagName);
                beta.id = tempArr[i].id;
                beta.name = tempArr[i].name;

                beta.className = tempArr[i].class;
                if (tempArr[i].tagName != "DIV" && tempArr[i].tagName != "FORM" && tempArr[i].tagName != "TABLE") beta.innerText = tempArr[i].text;
                beta.style.display = tempArr[i].display;
                beta.style.backgroundColor = tempArr[i].bgc;
                beta.style.height = tempArr[i].height;
                beta.style.width = tempArr[i].width;
                beta.style.overflow = tempArr[i].overflow;
                beta.style.textAlign = tempArr[i].align;
                beta.style.padding = tempArr[i].padding;
                beta.style.margin = tempArr[i].margin;
                beta.setAttribute('placeholder', tempArr[i].holder);
                beta.setAttribute('bind', tempArr[i].binding);
                beta.setAttribute('src', tempArr[i].src);
                beta.style.background = tempArr[i].background;
                beta.style.opacity = tempArr[i].opacity;
                beta.style.position = tempArr[i].position;
                beta.style.border = tempArr[i].border;
                beta.style.float = tempArr[i].float; 
                beta.style.color = tempArr[i].color;

                document.getElementById(tempArr[i].parentId).appendChild(beta);
                if (beta.name == "Submit") {

                    document.getElementById(beta.id).addEventListener('click', (ev) => {
                        ev.preventDefault();
                        var tempCount = 0;
                        var jsonBody = "{";
                        for (var i = 0; i < tempArr.length; i++) {
                            if (tempArr[i].tagName == "FORM") {
                                if (tempCount != 0) {
                                    jsonBody += ",";
                                }
                                tempCount++;
                                var bind_element = tempArr[i].binding;
                                jsonBody += '"' + bind_element + '":{';

                                for (var j = 0; j < objs.length; j++) {

                                    if (bind_element == objs[j].schemaName) {
                                        var schema = objs[j].schemaStructure;
                                        var le = 0;
                                        for (key in schema) {
                                            le++;
                                            if (schema[key].control == "radio") {

                                                var ts = schema[key].options
                                                var checkedEl = "";
                                                for (k in ts[0]) {
                                                    if (document.getElementById(tempArr[i].id + "_" + key + "_" + k).checked) {
                                                        checkedEl = k;
                                                    }
                                                }
                                                jsonBody += '"' + key + '":"' + checkedEl + '"'



                                            } else {

                                                jsonBody += '"' + key + '":"' + document.getElementById(tempArr[i].id + "_" + key).value + '"'

                                            }
                                            if (le != (Object.keys(schema).length)) {
                                                jsonBody += ",";
                                            }
                                        }
                                    }


                                }
                                jsonBody += "}";

                            } else if (tempArr[i].tagName == "TABLE") {
                                if (tempCount != 0) {
                                    jsonBody += ",";
                                }
                                tempCount++;

                                tbodyC = document.getElementById("tbody" + tempArr[i].id).childNodes;
                                jsonBody += '"' + tempArr[i].binding + '":[';


                                for (var l = 0; l < tbodyC.length; l++) {
                                    var tempJson = "{";
                                    for (var m = 0; m < tbodyC[l].childNodes.length; m++) {
                                        tempJson += '"' + tbodyC[l].childNodes[m].getAttribute('value') + '":"' + tbodyC[l].childNodes[m].innerText + '"';
                                        if (m != tbodyC[l].childNodes.length - 1) {
                                            tempJson += ",";
                                        }
                                    }
                                    tempJson += "}"
                                    if (l != (tbodyC.length - 1)) {
                                        tempJson += ","

                                    }
                                    jsonBody += tempJson;

                                }
                                jsonBody += "]"


                            }

                        }
                        jsonBody += "}"
                        var wi = "";
                        if (workitemId.length > 0) {
                            wi = "/" + workitemId;
                        }
                        var sendJson = {
                            "processId": processId,
                            "instanceId": instanceId,
                            "objects": jsonBody
                        };
                        fetch('http://localhost:3000/instance/' + instanceId + wi, {
                            method: "POST",
                            headers: {
                                'content-type': 'application/json'

                            },
                            credentials: 'include',
                            body: JSON.stringify(sendJson)
                        }).then((prom) => {
                            return prom.text()
                        }).then((res) => {
                        })
                        window.location.hash = "workitems"
                    });
                }

                if (String(beta.id).indexOf("bt") != -1) {

                    document.getElementById(beta.id).addEventListener('click', (ev) => {

                        cur = String(ev.target.id).replace("bt", "");

                        for (var i = 0; i < objs.length; i++) {

                            if (document.getElementById(String(ev.target.id).replace("bt", "")).getAttribute('bind') == objs[i].schemaName) {

                                schemaStructure = objs[i].schemaStructure;
                            }
                        }



                        //            document.getElementById('megaCheck').style.height = "100%"
                        //            document.getElementById('megaCheck').style.width = "100%"
                        console.log(document.getElementById('megaCheck'));
                        document.getElementById('megaCheck').style.display = "block"
                        document.getElementById('contentModal1').innerHTML = "";
                        //   document.getElementById('main-section').style.display="none"
                        //            document.getElementById('megaCheck').style.backgroundColor = "grey"
                        //            document.getElementById('megaCheck').style.position = "absolute"
                        //            document.getElementById('megaCheck').style.zIndex = "1"
                        //            document.getElementById('megaCheck').style.opacity = "0.7"
                        var test = document.createElement("FORM");
                        test.id = "formModal";
                        var tis = new Date().getTime();
                        for (key in schemaStructure) {

                            test.innerHTML += "<input type='input' id=" + key + tis + " class='form-control' placeholder='" + key + "'>";

                        }
                        var newButton = document.createElement('BUTTON');
                        newButton.innerText = "Add";
                        newButton.style.margin = "auto";
                        newButton.id = "modalAdd" + tis
                        newButton.className = "btn btn-primary"
                        test.appendChild(newButton);

                        document.getElementById('contentModal1').appendChild(test);

                        document.getElementById('modalAdd' + tis).addEventListener('click', (ev) => {
                            ev.preventDefault();
                            var tempRow = "<tr>";
                            for (key in schemaStructure) {
                                var temp = String(ev.target.id).replace("modalAdd", key)
                                tempRow += "<td value='" + key + "'>" + document.getElementById(temp).value + "</td>"
                            }

                            tempRow += "</tr>"
                            document.getElementById('megaCheck').style.display = "none";



                            document.getElementById("tbody" + cur).innerHTML += (tempRow);
                        })



                    });
                }

                if (tempArr[i].tagName == "FORM" || tempArr[i].tagName == "TABLE") {
                    bindObject(beta.getAttribute('bind'), beta.id)
                }


            }

        }).then(() => {

            if (instanceId.length > 0) {
                loadObjects();
            }
        });




    });
}

if (location.hash.substr(1).indexOf("frm") != -1) {
    formId = location.hash.substr(4).split("$")[1];
    processId = location.hash.substr(4).split("$")[0];
    workitemId = "";

    onLoad(formId, processId, workitemId)
} else {
    var search = '{"_id":"' + location.hash.substr(1) + '"}'
    fetch('/workitems/'+location.hash.substr(1), {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        res=JSON.parse(res);
        formId = res.formId;
        processId = res.processId;
        workitemId = res._id;
        instanceId = res.instanceId;
        onLoad(formId, processId, workitemId, res.instanceId);

    })

}

loadObjects = () => {
    console.log("***************");
    console.log("INSTANCE LOAD");
    if (instanceId.length > 0) {
        fetch('http://localhost:3000/instance/' + instanceId, {
            credentials: 'include'
        }).then((prom) => {
            console.log("###########################################");
            console.log(prom);
            console.log("###########################################");
            return prom.text();
        }).then((res) => {
            console.log("***1");
            console.log(res);
            console.log("***1");
            for (obj in JSON.parse(res).objects) {
                fetch('http://localhost:3000/objects/' + JSON.parse(res).objects[obj].id + '/' + JSON.parse(res).objects[obj].name, {
                    credentials: 'include'
                }).then((prom1) => prom1.text()).then((res2) => {
                    for (var i = 0; i < tempArr.length; i++) {
                        if (tempArr[i].binding == Object.keys(JSON.parse(res2))[1]) {
                            var body = "";
                            objName = Object.keys(JSON.parse(res2))[1];
                            res2 = JSON.parse(res2)[objName];
                            console.log(res2);
                            console.log(tempArr[i]);
                            for (var j = 0; j < res2.length; j++) {
                                console.log("$$" + tempArr[i].tagName + "$$");
                                if (tempArr[i].tagName == "TABLE") {
                                    var tempRow = "<tr>";
                                    for (key in res2[j]) {
                                        if (key != "_id") {
                                            tempRow += "<td value='" + key + "'>" + res2[j][key] + "</td>"
                                        }
                                    }
                                    tempRow += "</tr>";
                                    document.getElementById("tbody" + tempArr[i].id).innerHTML += tempRow;
                                    console.log(tempRow)
                                }
                                else {

                                    for (key in res2[j]) {
                                        if (key != "_id") {
                                            document.getElementById(tempArr[i].id + "_" + key).value = res2[j][key];
                                        }
                                    }

                                }
                            }
                            //                            for (key in objs[i].schemaStructure) {
                            //                                console.log(key + "#" + objs[i].schemaStructure[key].type);
                            //                                body += "<tr>" + key + "</tr>";
                            //
                            //
                            //                            }


                            break;
                        }
                    }

                })
            }
        })

    }
    console.log("***************");

}



bindObject = (bindObjName, currentEl) => {
    for (var i = 0; i < objs.length; i++) {
        if (bindObjName == objs[i].schemaName) {

            var ts = new Date().getTime();

            if (document.getElementById(currentEl).tagName == "FORM") {
                var doc = document.createElement("DIV");
                doc.id = ts;
                //console.log(objs[i].schemaStructure)
                var schema = objs[i].schemaStructure;
                for (key in schema) {
                    if (schema[key].control == "text") {
                        var newEl = document.createElement("INPUT");
                        newEl.className = "form-control";
                        newEl.type = "text";
                        newEl.setAttribute("placeholder", key);
                        newEl.id = document.getElementById(currentEl).id + "_" + key;
                        //document.getElementById(cur).appendChild(newEl);
                        doc.appendChild(newEl);

                    } else if (schema[key].control == "radio") {
                        var ts = schema[key].options
                        console.log(ts[0]);
                        var alpha = document.createElement("DIV");

                        for (k in ts[0]) {
                            var newDiv = document.createElement("LABEL");
                            newDiv.className = "radio-inline";
                            var newEl = document.createElement("INPUT");
                            //newEl.className = "form-control";
                            newEl.type = "radio";
                            newEl.name = key;
                            newEl.value = k;
                            newEl.id = document.getElementById(currentEl).id + "_" + key + "_" + k;
                            newDiv.appendChild(newEl);

                            newDiv.innerHTML += ts[0][k]
                            alpha.appendChild(newDiv);


                        }

                        doc.appendChild(alpha);


                    } else if (schema[key].control == "select") {
                        var ts = schema[key].options
                        console.log(ts[0]);
                        var alpha = document.createElement("SELECT");
                        alpha.className = "form-control";
                        alpha.id = document.getElementById(currentEl).id + "_" + key;
                        for (k in ts[0]) {
                            alpha.innerHTML += '<option value="' + k + '">' + ts[0][k] + '</option>'


                        }

                        doc.appendChild(alpha);


                    }
                }
                document.getElementById(currentEl).appendChild(doc);



            } else {
                var header = "";
                console.log("#@$" + document.getElementById(currentEl).innerHTML);
                schemaStructure = objs[i].schemaStructure;
                for (key in objs[i].schemaStructure) {
                    console.log(key + "#" + objs[i].schemaStructure[key].type);
                    header += "<th>" + key + "</th>";


                }
                console.log("%%%" + header);

                document.getElementById(currentEl).innerHTML = header + "<tbody id='tbody" + currentEl + "'></tbody>";

                //document.getElementById(currentEl).innerHTML = header + "<tbody id='tbody" + currentEl + "'></tbody>";
            }

        }
    }


    document.getElementById(currentEl).setAttribute('bind', bindObjName);
}



document.getElementById('closeModal').addEventListener('click', (ev) => {
    document.getElementById('megaCheck').style.display = "none";
});
