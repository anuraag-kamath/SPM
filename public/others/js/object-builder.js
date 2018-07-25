var objectId = "";


loadObject = (objectId) => {
    if (objectId != undefined) {
        fetch('/objects/' + objectId, {
            credentials: 'include'
        }).then((prom) => prom.text()).then((res) => {
            var obj = JSON.parse(res)[0];
            document.getElementById('root').value = String(obj.schemaName).substr(0, String(obj.schemaName).indexOf("_v"));
            var keys = Object.keys(obj.schemaStructure);
            for (var i = 0; i < keys.length; i++) {
                addChild(keys[i], obj.schemaStructure[keys[i]].type, obj.schemaStructure[keys[i]].control);
            }
        })
    }
}


document.getElementById('addChild').addEventListener('click', (ev) => {
    console.log("ADD");
    addChild("", "", "");
})

addChild = (name, type, control) => {
    StringSelected = "";
    BooleanSelected = "";
    NumberSelected = "";
    if (type == "String") {
        StringSelected = "selected";
    } else if (type == "Number") {
        NumberSelected = "selected";

    } else if (type = "Boolean") {
        BooleanSelected = "selected";

    }

    var newNode = document.createElement("DIV");
    ts = new Date().getTime();
    newNode.className = "row"
    newNode.id = "div_" + ts;
    newNode.innerHTML = '<div class="col-1"><h3>-></h3></div><div class="col-3"><input id="ele_' + ts + '" name="root " class="form-control" placeholder="element name" required value="' + name + '"></div><div class="col-3" ><select id="type_' + ts + '" class="form-control"><option ' + StringSelected + '>String</option><option ' + NumberSelected + '>Number</option><option ' + BooleanSelected + '>Boolean</option></select></div><div class="col-4"><select id="control_' + ts + '" class="form-control"><option value="text" selected>Text</option></select></div><div class="col-1></div>"'
    document.getElementById('myFormDiv').appendChild(newNode);
}


document.getElementById('myForm').addEventListener('submit', (ev) => {
    ev.preventDefault();
    var nodes = document.getElementById('myFormDiv').childNodes;
    var rootEl = document.getElementById('root').value;
    var json = ''
    for (var i = 0; i < nodes.length; i++) {
        var _id = nodes[i].id;
        if (_id != undefined && _id != '') {
            var elName = String(_id).replace('div_', 'ele_');
            var elType = String(_id).replace('div_', 'type_');
            var elControl = String(_id).replace('div_', 'control_');
            
            json += '"' + document.getElementById(elName).value + '":{"type":"' + document.getElementById(elType).value + '","control":"'+document.getElementById(elControl).value+'"}'
            if (i != nodes.length - 1) {
                json += ","
            }
        }

    }
    json += ''
    bodyJson = '{"schemaName":"' + rootEl + '","schemaStructure":{' + json + '}}'
    var ext = "";
    var method = "POST";
    if (objectId != undefined && objectId.length > 0) {
        ext = "/" + objectId;
        method = "PUT";

    }
    fetch('http://localhost:3000/objects' + ext, {
        method: method,
        headers: {
            'content-type': 'application/json'
        },
        credentials: 'include',
        body: bodyJson
    }).then((prom) => {
        return prom.text();
    }).then((res) => {
        window.location.hash="listObjects";
    })

})


var lochash = window.location.hash;
if (lochash.substr(7).length > 0) {
    objectId = window.location.hash.substr(7);
    loadObject(objectId)
}