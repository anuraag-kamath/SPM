
var objs = [];

var cur;
console.log("LOADING");
var tempArr = [];
var instanceId1 = "";
var processId = "";
var formId = "";
var iaa = "";
var workitemId = "";
var submitExists = false;
var rejectExists = false;
onLoad = (formId, processId, workitemId, instanceId1, role) => {


    console.log("AM");
    fetch('/api/bpm/objects', {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        objs = JSON.parse(res);


    }).then(() => {
        var tempJSON = '{"processId":"' + processId + '"}'

        fetch('/api/bpm/forms/' + formId, {
            credentials: 'include'
        }).then((prom) => {
            return prom.text()
        }).then((res) => {
            console.log(res);

            if (workitemId.length == 0) {
                fetch('/api/bpm/instance', {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'

                    },
                    credentials: 'include',
                    body: tempJSON
                }).then((prom) => prom.text()).then((res) => {
                    //                    instanceId1 = JSON.parse(res)._id;
                    instanceId1 = 1234;
                    iaa = JSON.parse(res)._id;
                    console.log("Instance ID after loading for first time:-" + instanceId1);
                    loadObjects();

                }).then(() => {
                    console.log("instanceId1 is set:-" + instanceId1);

                }).then(() => {
                    console.log("Random1" + instanceId1);

                    loadContents(res, role);
                });
            } else {
                console.log("Random2" + instanceId1);

                loadContents(res, role);
            }



        }).then(() => {
            console.log("###############");
            console.log(instanceId1);
            console.log("###############");
            if (typeof (instanceId1) !== 'undefined' && instanceId1.length > 0) {
                loadObjects();
            }
            removeLoadBar();

        });


        removeLoadBar();


    });
}

loadContents = (res, role) => {
    tempArr = (JSON.parse(res).structure)
    document.getElementById('main-section').innerHTML = "";
    // var button = document.createElement("BUTTON");
    // button.id = "comments_button"
    // button.innerHTML = '<i class="fas fa-comment"></i>'
    // button.style.position = "fixed";
    // button.style.top = "6vh";
    // button.style.marginRight = "15px";
    // button.style.right = "0";
    // button.style.zIndex = "1";
    var button = document.createElement("BUTTON");
    button.id = "comments_button"
    //button.innerHTML = '<i class="fas fa-comment"></i>'
    button.style.position = "fixed";
    button.className = "fas fa-comment editUsers"
    button.style.top = "6vh";
    button.style.marginRight = "25px";
    button.style.right = "0";
    button.style.zIndex = "2";
    button.style.transform = "scale(2.5,2)";

    document.getElementById('main-section').appendChild(button);

    var commentsDiv = document.createElement("DIV");
    commentsDiv.id = "commentsDiv"
    commentsDiv.style.height = "80%";
    commentsDiv.style.position = "fixed";
    commentsDiv.style.top = "9vh";
    commentsDiv.style.marginRight = "15px";
    commentsDiv.style.right = "0";
    commentsDiv.style.backgroundColor = "red"
    commentsDiv.style.zIndex = "1";

    commentsDiv.style.overflow = "scroll";
    commentsDiv.className = "commentsDiv"
    var commentsList = document.createElement("DIV");
    commentsList.className = "commentsDiv"
    commentsList.id = "commentsList"




    document.getElementById('main-section').appendChild(commentsDiv);
    var newRow = document.createElement("DIV");
    newRow.className = "commentsDiv"
    newRow.id = "addNewCommentRow"

    newRow.className = "row";
    var newCol1 = document.createElement("DIV");
    newCol1.id = "inputCommentCol";
    newCol1.className = "col-9 commentsDiv";
    newCol1.style.width = "100%"
    newCol1.style.margin = "0"
    newCol1.style.padding = "0"


    var newComment = document.createElement("INPUT");
    newComment.id = "inputComment";
    newComment.className = "commentsDiv"
    newComment.style.width = "100%"

    newComment.id = "newComment";
    newCol1.appendChild(newComment);
    var newCol3 = document.createElement("DIV");
    newCol3.id = "inputCommentButtonDiv";

    newCol3.style.padding = "0";
    newCol3.className = "col-2 commentsDiv";
    var newCommentButton = document.createElement("BUTTON");
    newCommentButton.id = "inputCommentButton";

    newCommentButton.className = "commentsDiv"

    newCommentButton.innerText = "+";
    newCol3.style.margin = "0"
    newCol3.style.padding = "0"
    newCommentButton.style.width = "100%";
    newCommentButton.id = "newCommentsButton_" + instanceId1;
    newCol3.appendChild(newCommentButton);

    newRow.appendChild(newCol1);
    newRow.appendChild(newCol3);
    newRow.style.margin = "0"
    document.getElementById('commentsDiv').appendChild(newRow);
    document.getElementById('commentsDiv').appendChild(commentsList);
    loadComments();
    document.getElementById("commentsDiv").style.display = "none";





    document.getElementById('newCommentsButton_' + instanceId1).addEventListener('click', (ev) => {
        jsonBody = '{"comment": "' + document.getElementById('newComment').value + '"}';
        console.log(jsonBody);
        fetch('/api/bpm/comments/' + instanceId1, {
            credentials: "include",
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: jsonBody
        }).then((prom) => prom.text()).then((res) => {
            loadComments();
            document.getElementById('newComment').value = "";
        })
    });



    console.log("AM I LOADING>");
    console.log(tempArr);
    var readOnly = "";
    if (role == "view") {
        readOnly = "readOnly";
    }
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

        if (beta.tagName == "MYDMS") {
            beta.innerText = "";
            beta.setAttribute("uniqueIdentifier", instanceId1);
            createDms();
        }




        if (beta.name == "Submit") {
            submitExists = true;

            eventPage("submit", beta.id)
        }

        if (beta.name == "Reject") {
            rejectExists = true;

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
                                            if (document.getElementById(tempArr[i].id + "_" + key + "_" + ts[k]).checked) {
                                                checkedEl = ts[k];
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
                    "instanceId1": instanceId1,
                    "objects": jsonBody
                };
                fetch('/api/bpm/instance/' + instanceId1 + wi, {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'

                    },
                    credentials: 'include',
                    body: JSON.stringify(sendJson)
                }).then((prom) => {
                    return prom.text()
                }).then((res) => {
                    window.location.hash = "workitems"
                })
            });
        }
        if (readOnly == "readOnly" && String(beta.id).indexOf("bt") != -1) {
            document.getElementById(beta.id).style.visibility = "hidden";
        }
        else if (String(beta.id).indexOf("bt") != -1) {

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
                        console.log(temp);
                        tempRow += "<td value='" + key + "'>" + document.getElementById(temp).value + "</td>"
                    }

                    tempRow += "</tr>"
                    document.getElementById('megaCheck').style.display = "none";



                    document.getElementById("tbody" + cur).innerHTML += (tempRow);
                })



            });
        }

        if (tempArr[i].tagName == "FORM" || tempArr[i].tagName == "TABLE") {
            bindObject(beta.getAttribute('bind'), beta.id, role)
        }


    }


    putMe(document.getElementById('app'));
}

loadComments = () => {
    document.getElementById('commentsList').innerText = "";
    fetch('/api/bpm/comments/' + instanceId1, {
        credentials: "include"
    }).then((prom) => prom.json()).then((res) => {
        for (var i = 0; i < res.length; i++) {
            var newRow1 = document.createElement("DIV");
            newRow1.className = "commentsDiv"
            newRow1.id = "commentsDiv1" + i;


            // newRow1.className = "row";
            newRow1.innerText = res[i].comment;
            newRow1.style.color = "white"
            newRow1.style.marginRight = "15px"
            document.getElementById('commentsList').appendChild(newRow1);
            var newRow2 = document.createElement("DIV");
            newRow2.id = "commentsDiv2" + i;
            newRow2.style.width = "6em"
            newRow2.className = "commentsDiv"

            // newRow2.className = "row";
            var dt = String(res[i].commentDate);

            newRow2.innerHTML = dt.substr(0, dt.indexOf("T")) + "-<strong class='commentsDiv' id='" + i + "_" + res[i].user + "'>" + res[i].user + "</strong>"
            newRow2.style.marginRight = "15px"
            document.getElementById('commentsList').appendChild(newRow2);
            var hr = document.createElement("HR");
            hr.id = "hr" + i;

            hr.className = "commentsDiv"

            document.getElementById('commentsList').appendChild(hr);

            userName(i + "_" + res[i].user)

        }
    })
}

userName = (userId) => {
    fetch('/api/uam/user/' + (userId).substr(2), {
        credentials: 'include'
    }).then((prom) => prom.text()).then((doc) => {
        console.log("*****");
        console.log(doc);
        console.log(userId);
        console.log("*****");
        document.getElementById(userId).innerText = JSON.parse(doc).user;
    })
}

document.addEventListener('click', (ev) => {
    console.log(ev.target.id);
    if (String(ev.target.id).length > 0 && document.getElementById(ev.target.id) != undefined && document.getElementById(ev.target.id) !== 'undefined') {
        if (String(document.getElementById(ev.target.id).className).indexOf("commentsDiv") == -1 &&
            String(ev.target.id).indexOf("comments_button") == -1) {
            document.getElementById("commentsDiv").style.display = "none";
        };
        if (String(ev.target.id).indexOf("comments_button") != -1) {
            if (document.getElementById("commentsDiv").style.display == "none") {
                document.getElementById("commentsDiv").style.display = "block";

            } else {
                document.getElementById("commentsDiv").style.display = "none";

            }
        }

    }
});

eventPage = (type, id) => {
    document.getElementById(id).addEventListener('click', (ev) => {
        ev.preventDefault();

        if (type == "reject") {
            fetch('/api/bpm/rejectWorkItem/' + workitemId + '/' + document.getElementById('rejectSelect').value, {
                credentials: "include",
                method: "GET"
            }).then((prom) => prom.text()).then((rr) => {
                window.location.hash = "workitems"

            })
        } else {

            var tempCount = 0;
            var jsonBody = "{";
            var problemField = "";

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
                            var oneAdded = false;
                            for (key in schema) {
                                le++;
                                if (schema[key].control == "radio") {

                                    var ts = schema[key].options.split(",")
                                    var checkedEl = "";
                                    for (k in ts) {
                                        console.log(tempArr[i].id + "_" + key + "_" + ts[k]);
                                        if (document.getElementById(tempArr[i].id + "_" + key + "_" + ts[k]).checked) {
                                            checkedEl = ts[k];
                                        }
                                    }
                                    console.log("####");
                                    console.log(checkedEl);
                                    console.log(document.getElementById(tempArr[i].id + "_" + key + "_0"));
                                    console.log("####");
                                    if (checkedEl.length == 0 && document.getElementById(tempArr[i].id + "_" + key +"_"+ ts[0]).required == true) {
                                        alert("Focussing on the problematic field");
                                        problemField = tempArr[i].id + "_" + key +"_"+ts[0];
                                        break;
                                    }
                                    else if (oneAdded == true) {

                                        jsonBody += ',"' + key + '":"' + checkedEl + '"'
                                    } else {
                                        jsonBody += '"' + key + '":"' + checkedEl + '"'
                                        oneAdded = true;
                                    }


                                } else {
                                    console.log("#@#@##" + document.getElementById(tempArr[i].id + "_" + key).checkValidity() + "@@" + tempArr[i].id + "_" + key);
                                    if (document.getElementById(tempArr[i].id + "_" + key).checkValidity() == false) {
                                        alert("Focussing on the problematic field");
                                        problemField = tempArr[i].id + "_" + key;
                                        break;

                                    }


                                    if (oneAdded == true) {
                                        jsonBody += ',"' + key + '":"' + document.getElementById(tempArr[i].id + "_" + key).value + '"'

                                    } else {
                                        jsonBody += '"' + key + '":"' + document.getElementById(tempArr[i].id + "_" + key).value + '"'
                                        oneAdded = true;
                                    }



                                }
                                // if (le != (Object.keys(schema).length)) {
                                //     jsonBody += ",";
                                // }
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
            console.log(jsonBody);

            if (problemField.length > 0) {
                console.log(problemField);
                document.getElementById(problemField).focus();
            } else {
                jsonBody += "}"
                var wi = "";
                if (workitemId.length > 0) {
                    wi = "/" + workitemId;
                }
                var sendJson = {
                    "processId": processId,
                    "instanceId1": instanceId1,
                    "objects": jsonBody
                };
                //alert(instanceId1);
                fetch('/api/bpm/instance/' + instanceId1 + wi, {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json'

                    },
                    credentials: 'include',
                    body: JSON.stringify(sendJson)
                }).then((prom) => {
                    return prom.text()
                }).then((res) => {
                    if (JSON.parse(res).status != "OK") {
                        if (JSON.parse(res).message != undefined && JSON.parse(res).message !== 'undefined')
                            alert(JSON.parse(res).message);
                    }
                    window.location.hash = "workitems"
                })

            }
        }
    });

}

var rejectionOptions = "";

if (location.hash.substr(1).indexOf("frm") != -1) {
    formId = location.hash.substr(4).split("$")[1];
    processId = location.hash.substr(4).split("$")[0];
    workitemId = "";

    onLoad(formId, processId, workitemId, "", "")
} else {
    var search = '{"_id":"' + location.hash.substr(1) + '"}'
    fetch('/api/bpm/workitems/' + location.hash.substr(1), {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        console.log("HERE1" + location.hash.substr(1));
        res = JSON.parse(res);
        console.log(res);
        formId = res.formId;
        processId = res.processId;
        workitemId = res._id;
        instanceId1 = res.instanceId;

        role = res.participant;
        rejectionApplicable = res.rejectionApplicable;

        if (workitemId.length > 0) {
            fetch('/api/bpm/rejectionSteps/' + workitemId, {
                credentials: "include",
                method: "GET"
            }).then((prom) => prom.text()).then((steps) => {
                console.log("###");
                console.log(steps);
                steps = JSON.parse(steps);
                console.log("HERE I AM ")
                console.log(steps);
                var keys = Object.keys(steps)
                rejectionOptions = "<option value=''></option>"
                if (keys.length > 0) {

                    for (var i = 0; i < keys.length; i++) {
                        rejectionOptions += "<option value='" + steps[keys[i]].stepNumber + "_" + steps[keys[i]].stepId + "'>" + steps[keys[i]].stepName + "</option>"
                    }
                } else {



                }
                fetch('/api/uam/roles?ids=' + role, {
                    credentials: 'include'
                }).then((prom) => prom.text()).then((res123) => {
                    console.log(res);
                    console.log(res.instanceId + "!!@@");
                    instanceId1 = res.instanceId;
                    onLoad(formId, processId, workitemId, res.instanceId, res123);
                })
                console.log("###");
            })


        }


        console.log("Instance ID after loading existing process:-" + instanceId1);
        //alert(instanceId1);


    })

}



loadObjects = () => {
    console.log("***************");
    console.log("INSTANCE LOAD");
    if (iaa.length > 0) {
        instanceId1 = iaa;

    }
    console.log(instanceId1);
    console.log(iaa);
    if (instanceId1.length > 0) {
        fetch('/api/bpm/instance/' + instanceId1, {
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
                fetch('/api/bpm/objects/' + JSON.parse(res).objects[obj].id + '/' + JSON.parse(res).objects[obj].name, {
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
                                            console.log(tempArr[i].id + "_" + key);
                                            console.log(res2[j]);
                                            console.log("WHAT IS THIS???");
                                            if (document.getElementById(tempArr[i].id + "_" + key + "_" + res2[j][key]) != undefined && document.getElementById(tempArr[i].id + "_" + key + "_" + res2[j][key]).type == "radio") {
                                               console.log("Meh");
                                               console.log(key);
                                               console.log(document.getElementById(tempArr[i].id + "_" + key + "_" + res2[j][key]));
                                               console.log(res2[j][key]);
                                               
                                                document.getElementById(tempArr[i].id + "_" + key + "_" + res2[j][key]).checked = true;
                                            } else {
                                                console.log(new Date(res2[j][key]));
                                                document.getElementById(tempArr[i].id + "_" + key).value = res2[j][key];
                                            }
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



bindObject = (bindObjName, currentEl, role) => {
    var readOnly = "";
    if (role == "view") {
        readOnly = "readonly";
    }
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
                        if (schema[key].type == "String") {
                            newEl.type = "text";

                        } else if (schema[key].type == "Number") {
                            newEl.type = "number";

                        } else if (schema[key].type == "Date") {
                            newEl.type = "datetime-local";

                        } else if (schema[key].type == "DateTime") {
                            newEl.type = "datetime-local";

                        } else if (schema[key].type == "Email") {
                            newEl.type = "email";

                        }
                        if (typeof (schema[key].pattern) !== 'undefined' && schema[key].pattern.length > 0) {
                            newEl.pattern = decodeURI(schema[key].pattern);
                        }
                        console.log(key + "#" + schema[key].required);
                        if (typeof (schema[key].required) !== 'undefined' && schema[key].required == true) {
                            newEl.required = true;
                        }
                        if (readOnly == "readonly") {
                            newEl.readOnly = true;
                        }

                        newEl.setAttribute("placeholder", key);
                        newEl.id = document.getElementById(currentEl).id + "_" + key;
                        //document.getElementById(cur).appendChild(newEl);
                        doc.appendChild(newEl);

                    } else if (schema[key].control == "radio") {
                        var ts = schema[key].options.split(",")
                        console.log(ts);
                        var alpha = document.createElement("DIV");


                        for (k in ts) {
                            var newDiv = document.createElement("LABEL");
                            newDiv.className = "radio-inline";
                            var newEl = document.createElement("INPUT");
                            //newEl.className = "form-control";
                            newEl.type = "radio";
                            newEl.name = key;
                            console.log(key);
                            console.log(k);
                            console.log(ts);
                            newEl.value = ts[k];
                            console.log(key + "#" + schema[key].required);

                            if (typeof (schema[key].required) !== 'undefined' && schema[key].required == true) {
                                newEl.required = true;
                            }
                            newEl.id = document.getElementById(currentEl).id + "_" + key + "_" + ts[k];
                            if (readOnly == "readonly") {
                                newEl.disabled = true;
                            }


                            newDiv.appendChild(newEl);


                            newDiv.innerHTML += ts[k]
                            console.log("########################");
                            console.log(newDiv);
                            console.log("########################");
                            alpha.appendChild(newDiv);


                        }

                        doc.appendChild(alpha);



                    } else if (schema[key].control == "select") {
                        var ts = schema[key].options
                        console.log(ts[0]);
                        var alpha = document.createElement("SELECT");
                        if (readOnly == "readonly") {
                            alpha.readOnly = true;
                        }

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

putMe = (node) => {
    // if (node.lastElementChild != undefined) {
    //     putMe(node.lastElementChild)
    // } else {
    //     console.log(node.getBoundingClientRect());
    //     var but1 = document.createElement('BUTTON');
    //     var but2 = document.createElement('BUTTON');
    //     but1.id = "Submit";
    //     but2.id = "Reject";
    //     but1.innerText = "Submit";
    //     but2.innerText = "Reject";
    //     but1.className = "btn btn-primary";
    //     but2.className = "btn btn-primary";
    //     if (submitExists == false) {
    //         document.getElementById('app').appendChild(but1);

    //     }
    //     if (rejectExists == false) {
    //         document.getElementById('app').appendChild(but2);

    //     }
    // }
    var divDown = document.createElement("DIV");
    divDown.style.display = "flex";
    var but1 = document.createElement('BUTTON');
    var but2 = document.createElement('BUTTON');
    var but3 = document.createElement('BUTTON');
    var sel = document.createElement("SELECT");
    sel.className = "form-control"
    sel.id = "rejectSelect";
    // sel.style.position = "fixed";
    sel.style.width = "100px"

    // sel.style.bottom = "15px";


    but1.id = "Submit" + new Date().getTime();
    but2.id = "Reject";
    but3.id = "Close";
    but1.innerText = "Submit";
    but2.innerText = "Reject";
    but1.className = "btn btn-primary";
    but2.className = "btn btn-primary";
    but3.innerText = "Close";
    but3.className = "btn btn-primary";
    divDown.style.position = "fixed";
    divDown.style.bottom = "15px";
    divDown.style.left = "15px";

    // but1.style.position = "fixed";
    // but1.style.bottom = "15px";
    // but1.style.left = "15px";
    but3.style.position = "fixed";
    but3.style.right = "15px";

    // but2.style.bottom = "15px";
    // but2.style.left = "350px";
    // but3.style.position = "fixed";
    // but3.style.bottom = "15px";
    but3.style.right = "15px";
    //        document.getElementById('app').appendChild(but1);
    //eventPage("submit", but1.id)
    //        document.getElementById('app').appendChild(but3);
    divDown.appendChild(but1);
    if (rejectionOptions.length > 0 && rejectionApplicable == true) {
        sel.innerHTML = rejectionOptions
        divDown.appendChild(sel);
        divDown.appendChild(but2);

    }
    divDown.appendChild(but3);

    // document.getElementById('app').appendChild(sel);
    // document.getElementById('app').appendChild(but2);
    //        document.getElementById('rejectSelect').style.left = (400 - document.getElementById('Reject').getBoundingClientRect().width - 80) + "px";

    console.log("#@!");
    console.log(divDown);
    console.log("#@!");
    document.getElementById('app').appendChild(divDown);

    if (rejectionOptions.length > 0 && rejectionApplicable == true) {
        eventPage("reject", but2.id)

    }

    eventPage("submit", but1.id)
    document.getElementById('Close').addEventListener('click', (ev) => {
        fetch('/api/bpm/workitems/' + workitemId, {
            credentials: "include",
            method: "PUT"
        }).then((prom) => prom.text()).then((res) => {
            window.location.hash = "workitems"
        })
    })




}
