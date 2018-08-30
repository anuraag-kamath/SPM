
var objectId = "";


loadObject = (objectId) => {
    if (objectId != undefined) {
        fetch('/api/bpm/objects/' + objectId, {
            credentials: 'include'
        }).then((prom) => prom.text()).then((res) => {
            var obj = JSON.parse(res)[0];
            document.getElementById('root').value = String(obj.schemaName).substr(0, String(obj.schemaName).indexOf("_v"));
            var keys = Object.keys(obj.schemaStructure);
            for (var i = 0; i < keys.length; i++) {
                addChild(keys[i], obj.schemaStructure[keys[i]].type, obj.schemaStructure[keys[i]].control, obj.schemaStructure[keys[i]].pattern, obj.schemaStructure[keys[i]].required, String(obj.schemaStructure[keys[i]].options).split(","));
            }
            removeLoadBar();
        })
    }
    else {
        removeLoadBar();
    }
}


document.getElementById('addChild').addEventListener('click', (ev) => {
    console.log("ADD");
    addChild("", "String", "text", "", "", []);
})

addChild = (name, type, control, pattern, required, options) => {
    StringSelected = "";
    NumberSelected = "";
    DateSelected = "";
    DateTimeSelected = "";
    EmailSelected = "";
    TextSelected = "";
    RadioSelected = "";
    if (control == "text") {
        TextSelected = "selected"
    } else if (control == "radio") {
        RadioSelected = "selected"
    }
    if (type == "String") {
        StringSelected = "selected";
    } else if (type == "Number") {
        NumberSelected = "selected";

    } else if (type = "Date") {
        DateSelected = "selected";

    } else if (type = "DateTime") {
        DateTimeSelected = "selected";

    } else if (type = "Email") {
        EmailSelected = "selected";

    } else {
        StringSelected = "selected";

    }
    if (typeof (required) !== 'undefined' && required == true) {
        required = "checked"
    }
    else {
        required = "";
    }

    var newNode = document.createElement("DIV");
    ts = Math.ceil(new Date().getTime() * Math.random());
    newNode.className = "row"
    newNode.id = "div_" + ts;

    newNode.innerHTML = '<div class="col-1"><h3 style="float:right">-></h3></div><div class="col-3"><input id="ele_' + ts + '" name="root " class="form-control" placeholder="element name" required value="' + name + '"></div><div class="col-1" ><select id="type_' + ts + '" class="form-control"><option ' + StringSelected + '>String</option><option ' + NumberSelected + '>Number</option><option ' + DateSelected + '>Date</option></select></div><div class="col-1"><select id="control_' + ts + '" class="form-control"><option value="text" ' + TextSelected + '>Text</option><option value="radio" ' + RadioSelected + '>Radio</option></select></div><div class="col-2"><input type="text" id="listAdd_' + ts + '" style="width:80%;height:calc(2.25rem + 2px)" placeholder="option" ><button id="listAddButton_' + ts + '">+</button><ul id="list_' + ts + '"></ul></div><div class="col-3"><input type="text" id="pattern_' + ts + '" class="form-control"  value="' + decodeURI(pattern) + '"  placeholder="regex"></div><div class="col-1 checkbox"><label>req: <input type="checkbox" id="required_' + ts + '" ' + required + '></label></div>'
    document.getElementById('myFormDiv').appendChild(newNode);
    if (TextSelected == "selected") {
        document.getElementById("listAdd_" + ts).disabled = true;
        document.getElementById("listAddButton_" + ts).style.visibility = false;
        document.getElementById("pattern_" + ts).disabled = false;
    } else {
        document.getElementById("listAddButton_" + ts).style.visibility = true;
        document.getElementById("listAdd_" + ts).disabled = false;
        document.getElementById("pattern_" + ts).disabled = true;

    }
    document.getElementById('control_' + ts).addEventListener('change', (ev) => {
        console.log("#####");
        console.log(ev.target.value);
        console.log("#####");
        if (ev.target.value == "text") {
            document.getElementById(String(ev.target.id).replace("control", "listAdd")).disabled = true;
            document.getElementById(String(ev.target.id).replace("control", "listAddButton")).style.visibility = false;
            document.getElementById(String(ev.target.id).replace("control", "pattern")).disabled = false;
        } else {
            document.getElementById(String(ev.target.id).replace("control", "listAddButton")).style.visibility = true;
            document.getElementById(String(ev.target.id).replace("control", "listAdd")).disabled = false;
            document.getElementById(String(ev.target.id).replace("control", "pattern")).disabled = true;

        }
    });
    if (control == "radio") {
        for (var i = 0; i < options.length; i++) {
            addOptions('listAddButton_' + ts, options[i])
        }
    }
    document.getElementById('listAddButton_' + ts).addEventListener('click', (ev) => {
        ev.preventDefault();
        tid = ev.target.id;
        if (document.getElementById(String(tid).replace("listAddButton", "listAdd")).value.length > 0) {
            addOptions(tid, document.getElementById(String(tid).replace("listAddButton", "listAdd")).value);
        } else {
            alert("Add value to option!");
        }
        document.getElementById(String(tid).replace("listAddButton", "listAdd")).value = "";


    })
}

addOptions = (tid, optionValue) => {
    var ts = Math.ceil(new Date().getTime() * Math.random());
    var li_ts = "li_" + ts;
    var button_ts = "btn_" + ts;

    var li = document.createElement("LI");
    var button = document.createElement("BUTTON");
    button.innerText = "X";
    button.id = button_ts;
    li.id = li_ts

    li.innerText = optionValue;
    li.appendChild(button)
    document.getElementById(String(tid).replace("listAddButton", "list")).appendChild(li);
    document.getElementById(button_ts).addEventListener("click", (ev1) => {
        ev1.preventDefault();
        console.log(String(ev1.target.id).replace("btn", "li"));
        document.getElementById(String(ev1.target.id).replace("btn", "li")).parentNode.removeChild(document.getElementById(String(ev1.target.id).replace("btn", "li")))
    })
}

document.getElementById('myForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    var nodes = document.getElementById('myFormDiv').childNodes;
    console.log(nodes);
    var rootEl = document.getElementById('root').value;
    var json = ''
    for (var i = 0; i < nodes.length; i++) {
        var _id = nodes[i].id;
        if (_id != undefined && _id != '') {
            var elName = String(_id).replace('div_', 'ele_');
            var elType = String(_id).replace('div_', 'type_');
            var elControl = String(_id).replace('div_', 'control_');
            var elPattern = String(_id).replace('div_', 'pattern_');
            var elRequired = String(_id).replace('div_', 'required_');
            console.log(document.getElementById(elControl).value);
            var options = [];
            if (document.getElementById(elControl).value == "radio") {
                var elList = String(_id).replace('div_', 'list_');
                var nodes123 = document.getElementById(elList).childNodes;
                for (var j = 0; j < nodes123.length; j++) {
                    options.push(String(nodes123[j].innerText).substr(0, nodes123[j].innerText.length - 1));
                }
            }

            console.log(options);
            var temp = '"' + document.getElementById(elName).value + '":{"type":"' + document.getElementById(elType).value + '","control":"' + document.getElementById(elControl).value + '","options":"' + options.toString() + '","pattern":"' + encodeURI(document.getElementById(elPattern).value) + '","required":' + encodeURI(document.getElementById(elRequired).checked) + '}';
            json += temp;
            if (i != nodes.length - 1) {
                json += ","
            }
        }

    }
    json += ''
    bodyJson = '{"schemaName":"' + rootEl + '","schemaStructure":{' + json + '}}'
    console.log(bodyJson);
    var ext = "";
    var method = "POST";
    if (objectId != undefined && objectId.length > 0) {
        ext = "/" + objectId;
        method = "PUT";

    }
    console.log(method);
    // var script = document.createElement("script");
    // script.src = "js/listObjects.js";
    // script.id = "listObjectsScript"
    // console.log("#1");
    // document.getElementsByTagName("head")[0].appendChild(script);
    loadBar();
    document.getElementById("saveObj").disabled = true;
    document.getElementById("myForm").style.visibility = "hidden";

    fetch('/api/bpm/objects' + ext, {
        method: method,
        headers: {
            'content-type': 'application/json'
        },
        credentials: 'include',
        body: bodyJson
    }).then((prom) => {
        return prom.text();
    }).then((res) => {
        console.log("#1")
        console.log(JSON.parse(res));
        if (JSON.parse(res) != undefined && JSON.parse(res).error != undefined && JSON.parse(res).error.length > 0) {
            console.log("#2")
            removeLoadBar()
            document.getElementById("saveObj").disabled = false;

            document.getElementById("myForm").style.visibility = "visible";

            document.getElementById('message').innerText = JSON.parse(res).error;
            document.getElementById("root").addEventListener('focus', (ev) => {
                document.getElementById('message').innerText = "";
            });
        } else {
            console.log("#3")


            removeLoadBar()
            window.location.hash = "listObjects";
        }

    }).catch((err) => {

    })

})


var lochash = window.location.hash;
if (lochash.substr(7).length > 0) {
    objectId = window.location.hash.substr(7);
    loadObject(objectId)
    removeLoadBar();

}
else {
    removeLoadBar();
}