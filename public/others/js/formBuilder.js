
var objs = [];
var formId = "";

var keyValue = [];

onLoad = () => {
    fetch('/objects', {

        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        //////console.log(res);
        objs = JSON.parse(res);
        document.getElementById('ctr-bind').innerHTML += "<option value=''></option>";
        for (var ob in JSON.parse(res)) {
            ////console.log(objs[ob].schemaName);
            document.getElementById('ctr-bind').innerHTML += "<option value='" + objs[ob].schemaName + "'>" + objs[ob].schemaName + "</option>";
        }

    }).then(() => {
        var alpha = window.location.href.substr(window.location.href.indexOf("?") + 1, window.location.href.length)

        formId = window.location.hash.substr(7);
        if (formId != undefined && formId != "undefined" && formId.length > 0) {
            console.log("ABCD");

            ////console.log(formId);
        }
        else {
            removeLoadBar();

        }
        if (formId != undefined && formId != "undefined" && formId.length > 0) {
            fetch('/forms/' + formId, {

                credentials: 'include'
            }).then((prom) => {
                return prom.text()
            }).then((res) => {
                ////console.log("***");
                ////console.log(res);
                ////console.log("***");
                var tempArr = (JSON.parse(res).structure)

                document.getElementById("formName").value = (JSON.parse(res).name);

                //document.getElementById('main-section').appendChild(alpha);
                ////console.log(tempArr);
                console.log("contents of a form");
                console.log(tempArr);
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
                    ////console.log(tempArr[i]);

                    document.getElementById(tempArr[i].parentId).appendChild(beta);
                    if(beta.tagName=="MYDMS"){
                        createDms();
                    }

                    if (String(beta.id).indexOf("bt") != -1) {

                        document.getElementById(beta.id).addEventListener('click', (ev) => {

                            cur = String(ev.target.id).replace("bt", "");

                            for (var i = 0; i < objs.length; i++) {

                                if (document.getElementById(String(ev.target.id).replace("bt", "")).getAttribute('bind') == objs[i].schemaName) {
                                    ////console.log(objs[i].structure);

                                    schemaStructure = objs[i].schemaStructure;
                                }
                            }



                            //            document.getElementById('megaCheck').style.height = "100%"
                            //            document.getElementById('megaCheck').style.width = "100%"
                            ////console.log(document.getElementById('megaCheck'));
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
                            ////console.log("WHO" + schemaStructure);
                            ////console.log(schemaStructure);
                            for (key in schemaStructure) {

                                ////console.log(key + "#" + schemaStructure[key].type);
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
                                ////console.log(document.getElementById('formModal'));
                                var tempRow = "<tr>";
                                for (key in schemaStructure) {
                                    var temp = String(ev.target.id).replace("modalAdd", key)
                                    ////console.log(document.getElementById(temp).value);
                                    tempRow += "<td>" + document.getElementById(temp).value + "</td>"
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

                console.log(document.getElementById('main-section'));

                document.getElementById('right-section').innerHTML = "";
                console.log(document.getElementById('main-section').childNodes);
                checkForMe('main-section', 1, "none");
                console.log(testArr);
                // ////console.log("*******************");
                removeLoadBar();

                for (var it in testArr) {
                    //console.log("display" + it + "#@");
                    for (var it1 in testArr[it]) {
                        ////console.log("*****************************");
                        //console.log("display" + testArr[it][it1]);

                        //                        document.getElementById("display" + it1).style.display = "none";
                        ////console.log("display"+testArr[it][it1]);
                        ////console.log("*****************************");
                    }
                }


            })
        }
    });
}

mode = "";
finalNode = "";


drag = (event) => {
    ////console.log("DATA");
    event.dataTransfer.setData("dr", event.target.id);
}

currentHoverId = "";
currentElDrag = "";
nextNode = "";

onDragOver = (event) => {

    event.preventDefault();

    // //console.log("***");
    // //console.log(event.target.id);
    // //console.log(document.getElementById(event.target.id).childNodes);
    // //console.log("***");
    if (event.target.id != "" && event.target.id != "tempDiv1" &&
        document.getElementById(event.target.id).tagName != "FORM") {

        currentHoverId = event.target.id;

        if (hoverElement != "") {
            try {
                document.getElementById(hoverElement).removeChild(document.getElementById(divId));
            } catch (e) {

            }

        }

        // //console.log(document.elementFromPoint(event.clientX,event.clientX).closest("div"));
        var cren = document.getElementById(event.target.id).childNodes;
        distance = -1;
        distanceX = event.x;
        distanceY = event.y;
        var tempEl = "";
        ////console.log("#############################################");
        for (var i = 0; i < cren.length; i++) {

            if (cren[i].id != null && cren[i].id != "tempDiv1") {
                point1X = document.getElementById(cren[i].id).getBoundingClientRect().x + document.getElementById(cren[i].id).getBoundingClientRect().width;
                point1Y = document.getElementById(cren[i].id).getBoundingClientRect().y;
                point2X = document.getElementById(cren[i].id).getBoundingClientRect().x + document.getElementById(cren[i].id).getBoundingClientRect().width;
                point2Y = document.getElementById(cren[i].id).getBoundingClientRect().y + document.getElementById(cren[i].id).getBoundingClientRect().height;
                point3X = document.getElementById(cren[i].id).getBoundingClientRect().x;
                point3Y = document.getElementById(cren[i].id).getBoundingClientRect().y + document.getElementById(cren[i].id).getBoundingClientRect().height;

                if (distance == -1) {
                    distance1 = Math.sqrt(Math.pow((point1X - distanceX), 2) + Math.pow((distanceY - point1Y), 2));
                    distance2 = Math.sqrt(Math.pow((point2X - distanceX), 2) + Math.pow((distanceY - point2Y), 2));
                    distance3 = Math.sqrt(Math.pow((point3X - distanceX), 2) + Math.pow((distanceY - point3Y), 2));
                    // distanceX = tempX;
                    // distanceY = tempY;
                    distance = Math.min(distance1, distance2, distance3)
                    tempEl = cren[i].id;
                    //     //console.log("**2**");
                    //     //console.log(document.getElementById(tempEl));
                    //     //console.log(distance);
                    //     //console.log("**2**");
                } else {
                    distance1 = Math.sqrt(Math.pow((point1X - distanceX), 2) + Math.pow((distanceY - point1Y), 2));
                    distance2 = Math.sqrt(Math.pow((point2X - distanceX), 2) + Math.pow((distanceY - point2Y), 2));
                    distance3 = Math.sqrt(Math.pow((point3X - distanceX), 2) + Math.pow((distanceY - point3Y), 2));

                    tempDistance = Math.min(distance1, distance2, distance3);

                    // //console.log(tempX);
                    // //console.log(tempY);
                    ////console.log("**3**");
                    ////console.log(document.getElementById(cren[i].id));
                    ////console.log(tempDistance);
                    ////console.log("**3**");

                    if (tempDistance < distance) {
                        // distanceX = tempX;
                        // distanceY = tempY;
                        tempEl = cren[i].id;
                        distance = tempDistance;

                    }

                }
            }
        }
        // //console.log("#############################################");

        // //console.log("********");
        // //console.log(tempEl);
        // //console.log(cren.length);
        // //console.log(cren);
        // //console.log("********");
        if ((tempEl != "" && tempEl != currentElDrag) || cren.length == 0) {
            if (document.getElementById('tempDiv1') != null) {
                document.getElementById('tempDiv1').parentNode.removeChild(document.getElementById('tempDiv1'))
            }

            currentElDrag = tempEl;
            if (tempEl != "") {

                nextNode = document.getElementById(tempEl).nextSibling;
            }
            // //console.log(tempEl);

            // //console.log(nextNode);

            if (cren.length == 0) {
                var div = document.createElement('DIV');
                div.id = "tempDiv1"
                div.style.height = "100px";
                div.style.widows = "100px";
                div.style.backgroundColor = "blue";
                mode = "parent";
                ////console.log(event.target.id);
                finalNode = document.getElementById(event.target.id);
                document.getElementById(event.target.id).appendChild(div);
                ////console.log("APPENDED 3");
            }
            else if (nextNode == null) {
                var div = document.createElement('DIV');
                div.id = "tempDiv1"
                div.style.height = "100px";
                div.style.widows = "100px";
                div.style.backgroundColor = "blue";
                div.className = "col-1";
                mode = "parent";
                div.style.border = "2px solid grey"
                // //console.log(event.target.id);
                // //console.log(tempEl);
                // //console.log("APPENDING DUMMY")
                // if (document.getElementById('formName').value == 'ABCD') {

                //     var dummyDiv = document.createElement('DIV');
                //     dummyDiv.id = "DUMMYDIV"
                //     dummyDiv.style.height = "100px";
                //     dummyDiv.style.widows = "100px";
                //     dummyDiv.style.backgroundColor = "blue";
                //     document.getElementById(tempEl).parentNode.appendChild(dummyDiv);

                // }
                finalNode = document.getElementById(tempEl).parentNode;
                document.getElementById(tempEl).parentNode.appendChild(div);

                ////console.log("APPENDED 1");
            } else {
                var div = document.createElement('DIV');
                div.style.height = "100px";
                div.id = "tempDiv1"
                div.style.widows = "100px";
                div.style.backgroundColor = "blue";
                div.className = "col-1";

                // document.getElementById(tempEl).parentNode.appendChild(div);
                mode = "next";
                finalNode = document.getElementById(tempEl).parentNode;

                document.getElementById(tempEl).parentNode.insertBefore(div, nextNode);
                ////console.log("APPENDED 2");
            }
        }
    }

}



onDragOver1 = (event) => {
    event.preventDefault();
}

var objects;

var dr20 = "";
var dr21 = "";
drop2 = (event) => {

    document.getElementById("pop-up").innerHTML = "";

    var buttonClose = document.createElement("BUTTON");
    buttonClose.innerText = "X";
    //buttonClose.className = "right";
    buttonClose.id = "buttonClose"
    var button1 = document.createElement("BUTTON");
    var button2 = document.createElement("BUTTON");
    var button3 = document.createElement("BUTTON");

    button1.innerText = "Append Child";
    button1.id = "appendChild"
    button2.innerText = "Swap";
    button2.id = "swapElement";
    button3.innerText = "Before the Element";
    button3.id = "beforeElement";
    button1.className = "btn btn-primary"
    button2.className = "btn btn-primary"
    button3.className = "btn btn-primary"
    button1.style.margin = "auto"
    button2.style.margin = "auto"
    button3.style.margin = "auto"
    button1.style.display = "block"
    button2.style.display = "block"
    button3.style.display = "block"
    var newDiv = document.createElement("DIV");
    newDiv.style.height = "200px";
    newDiv.style.width = "200px";
    document.getElementById('pop-up').style.position = "fixed";
    document.getElementById('pop-up').style.top = 0;
    document.getElementById('pop-up').style.left = 0;
    newDiv.style.margin = "auto auto";

    newDiv.style.marginTop = "10%";
    newDiv.style.backgroundColor = "aqua";
    var hr = document.createElement("HR");
    newDiv.appendChild(buttonClose);

    newDiv.appendChild(button1);
    newDiv.appendChild(hr);
    newDiv.appendChild(button2);
    newDiv.appendChild(hr);
    newDiv.appendChild(button3);

    //    document.getElementById("app").style.display = "none";
    document.getElementById("app").style.opacity = 0.3;
    document.getElementById("pop-up").style.display = "block";

    document.getElementById('pop-up').appendChild(newDiv);

    dr20 = event.dataTransfer.getData('dr');
    dr21 = String(event.target.id).replace('display', '');
    document.getElementById("buttonClose").addEventListener('click', (ev) => {
        document.getElementById("app").style.opacity = 1;
        document.getElementById("pop-up").style.display = "none";

    });
    document.getElementById("appendChild").addEventListener('click', (ev) => {
        document.getElementById("app").style.opacity = 1;
        document.getElementById("pop-up").style.display = "none";
        source = dr20;
        ////console.log(source);
        target = dr21;
        if ((document.getElementById(source).tagName == "BUTTON" ||
            document.getElementById(source).tagName == "TABLE" ||
            document.getElementById(source).tagName == "DIV" || document.getElementById(source).tagName == "P"
        ) && (document.getElementById(target).tagName == "DIV" || document.getElementById(target).tagName == "FORM")) {
            document.getElementById(target).appendChild(document.getElementById(source));
        }
        document.getElementById('right-section').innerHTML = "";
        checkForMe('main-section', 1, "none");
    });

    document.getElementById("swapElement").addEventListener('click', (ev) => {
        document.getElementById("app").style.opacity = 1;
        document.getElementById("pop-up").style.display = "none";

        var sourceNext = document.getElementById(dr20).nextSibling;

        var targetNext = document.getElementById(dr21).nextSibling;

        var source = document.getElementById(dr20);
        var target = document.getElementById(dr21);

        var sourceParent = source.parentElement;
        var targetParent = target.parentElement;




        sceneA = targetNext == source;
        sceneB = targetNext == null;
        sceneC = !(sceneA || sceneB);
        sceneD = sourceNext == target;
        sceneE = sourceNext == null;
        sceneF = !(sceneD || sceneE);

        if (sceneA == true) {
            targetParent.insertBefore(source, target)
        }

        if (sceneB == true) {
            targetParent.appendChild(source)
        }

        if (sceneC == true) {
            targetParent.insertBefore(source, targetNext)
        }

        if (sceneD == true) {
            sourceParent.insertBefore(target, source)
        }

        if (sceneE == true) {
            sourceParent.appendChild(target)
        }

        if (sceneF == true) {
            sourceParent.insertBefore(target, sourceNext)
        }

        // //console.log("A:-" + sceneA);
        // //console.log("B:-" + sceneB);
        // //console.log("C:-" + sceneC);
        // //console.log("D:-" + sceneD);
        // //console.log("E:-" + sceneE);
        // //console.log("F:-" + sceneF);

    });


}

drop = (event) => {

    if (document.getElementById('tempDiv1') != null) {
        document.getElementById('tempDiv1').parentNode.removeChild(document.getElementById('tempDiv1'))
    }
    ////console.log("DROPPED");
    ts = new Date().getTime();
    sourceElement = (event.dataTransfer.getData("dr"));
    id = new Date().getTime();

    var noClick = "N";

    if (sourceElement == "container") {
        ;
        var newContainer = document.createElement("DIV");
        newContainer.id = id;
        newContainer.style.backgroundColor = "red";
        newContainer.style.height = "100%";
        //newContainer.style.margin="20px";
        //newContainer.style.border = "2px solid black";
        if (mode == "parent") {
            finalNode.appendChild(newContainer);
        } else {
            finalNode.insertBefore(newContainer, nextNode);
        }
        //        parentNode1.appendChild(newContainer);
        ////console.log("DID I ADD?" + newContainer.id);
        ////console.log("ADDED");
    } else if (sourceElement == "table") {
        var newTable = document.createElement("TABLE");
        newTable.id = "table_" + ts;
        newTable.innerHTML = "<th>Name</th><th>Age</th><tr><td>Anuraag</td><td>27</td></tr>"
        newTable.id = id;
        newTable.style.cursor = "pointer";
        newTable.className = "table";
        newTable.style.backgroundColor = "yellow";
        //newContainer.style.margin="20px";
        //newTable.style.border = "2px solid black";
        if (mode == "parent") {
            finalNode.appendChild(newTable);
        } else {
            finalNode.insertBefore(newTable, nextNode);
        }
        //        parentNode1.appendChild(newTable);
        var newButton = document.createElement("BUTTON");
        newButton.id = "bt" + id;
        newButton.innerText = "+"
        if (mode == "parent") {
            finalNode.appendChild(newButton);
        } else {
            finalNode.insertBefore(newButton, nextNode);
        }
        //        parentNode1.appendChild(newButton)
        document.getElementById('bt' + id).addEventListener('click', (ev) => {
            ////console.log(schemaStructure);
            //            document.getElementById('megaCheck').style.height = "100%"
            //            document.getElementById('megaCheck').style.width = "100%"
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
                ////console.log(key + "#" + schemaStructure[key].type);
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
                ////console.log(document.getElementById('formModal'));
                var tempRow = "<tr>";
                for (key in schemaStructure) {
                    var temp = String(ev.target.id).replace("modalAdd", key)
                    ////console.log(document.getElementById(temp).value);
                    tempRow += "<td>" + document.getElementById(temp).value + "</td>"
                }

                tempRow += "</tr>"
                document.getElementById('megaCheck').style.display = "none";



                document.getElementById("tbody" + cur).innerHTML += (tempRow);
            })



        });
        newTable.addEventListener('click', (event) => {
            ////console.log("ABCD");
            //            newTable.innerHTML = "<th>alpha</th><th>beta</th><tr><td>Gamma</td><td>Theeta</td></tr>"

        })
        bindObject(objs[0].schemaName, ts);
    } else if (sourceElement == "button") {
        var newButton = document.createElement("BUTTON");
        newButton.ondrop = "drop1(event)"
        newButton.innerText = "Submit";
        newButton.id = id;
        newButton.className = "btn btn-primary";
        //newContainer.style.margin="20px";
        if (mode == "parent") {
            finalNode.appendChild(newButton);
        } else {
            finalNode.insertBefore(newButton, nextNode);
        }
        //        parentNode1.appendChild(newButton);
    } else if (sourceElement == "form") {
        var newForm = document.createElement("FORM");
        newForm.id = id;
        newForm.className = "form-group";
        //newContainer.style.margin="20px";
        if (mode == "parent") {
            finalNode.appendChild(newForm);
        } else {
            finalNode.insertBefore(newForm, nextNode);
        }
        // 
        //bindObject(objs[0].schemaName, ts);
        //        parentNode1.appendChild(newForm);
    } else if (sourceElement == "para") {
        var newPara = document.createElement("P");
        newPara.id = id;
        //newContainer.style.margin="20px";
        if (mode == "parent") {
            finalNode.appendChild(newPara);
        } else {
            finalNode.insertBefore(newPara, nextNode);
        }
        //        parentNode1e.appendChild(newPara);
    } else if (sourceElement == "hr") {
        var newHr = document.createElement("HR");
        newHr.id = id;
        ////console.log("HR ADDED");
        //newContainer.style.margin="20px";
        if (mode == "parent") {
            finalNode.appendChild(newHr);
        } else {
            finalNode.insertBefore(newHr, nextNode);
        }
        //       parentNode1.appendChild(newHr);
    } else if (sourceElement == "image") {
        var newImage = document.createElement("IMG");
        newImage.src = "/resources/sample.png";
        newImage.style.border = "1px solid black"
        newImage.id = id;
        //newContainer.style.margin="20px";
        if (mode == "parent") {
            finalNode.appendChild(newImage);
        } else {
            finalNode.insertBefore(newImage, nextNode);
        }
        //       parentNode1.appendChild(newImage);
    } else if (sourceElement == "text") {
        match = false;
        var test = event.target;
        while (test.id != 'main-section' && match == false) {
            ////console.log(test.tagName);
            if (test.tagName == "FORM") {
                match = true;
            } else {
                test = test.parentNode;
            }
        }
        if (match == true) {
            var newText = document.createElement("INPUT");
            newText.id = id;
            newText.className = "form-control";
            //newContainer.style.margin="20px";
            event.target.appendChild(newText);
        } else {
            noClick = "Y";
            alert("Input text can be applied only to a form");
        }
    } else if (sourceElement == "dms") {
        var newDMS = document.createElement("mydms");
        newDMS.id = id;
        newDMS.setAttribute("uniqueIdentifier","AKBK");
        ////console.log("HR ADDED");
        //newContainer.style.margin="20px";
        if (mode == "parent") {
            finalNode.appendChild(newDMS);
        } else {
            finalNode.insertBefore(newDMS, nextNode);
        }
        createDms("builder");
    }

    //    document.createElement();
    showData(document.getElementById("main-section"));
    document.getElementById('right-section').innerHTML = "";
    checkForMe('main-section', 1, "none");
    //console.log("I AM DONE");
    if (noClick != "Y") {
        document.getElementById('display' + ts).click();

    }
    if (sourceElement == "form") {
        bindObject(objs[0].schemaName, ts);

    }
}

drop1 = (event) => {
    ////console.log("Prevent");
    event.preventDefault();
}



showData = (node) => {
    //////console.log("Parent" + node);
    if (node.hasChildNodes) {
        node.childNodes.forEach((child) => {
            //////console.log("Child:-" + child.id + "#" + child.name + "#" + child.tagName);
            showData(child);
        });
    }
    if (node.id != '' && node.id != 'undefined') ////console.log(node.id + "#" + node.name + "#" + node.tagName);
        return node;
}




var cur = "";
var curBorder = "";

document.getElementById('right-section').addEventListener('click', (ev) => {
    var tesmp = ev.target.id;
    var expId = ev.target.id;

    tesmp = tesmp.replace("display", "")
    tesmp = tesmp.replace("exp", "")

    //console.log(tesmp);
    //console.log(document.getElementById(tesmp));
    if (cur.length > 0 && document.getElementById(cur) != undefined &&
        document.getElementById(cur).style != null) {
        // if (testArr[cur] != undefined && testArr[cur] != "undefined" && !(testArr[cur].includes(tesmp))) {
        //     for (var te = 0; te < testArr[cur].length; te++) {
        //         console.log("EXPANDED");
        //         var tempMargin = String(document.getElementById("display" + cur).style.margin).substr(0, String(document.getElementById("display" + cur).style.margin).indexOf("px"));

        //         document.getElementById("display" + testArr[cur][te]).style.display = "none";
        //         document.getElementById("display" + testArr[cur][te]).style.margin = tempMargin + 5 + "px";

        //     }
        //     document.getElementById("exp" + cur).innerText = "+";
        // }
        document.getElementById(cur).style.border = curBorder;
        if (document.getElementById("display" + cur) != null && document.getElementById("display" + cur).style != null) {
            document.getElementById("display" + cur).style.backgroundColor = "grey";

        }

    }
    cur = tesmp;
    //console.log(cur);
    //console.log(testArr);
    //console.log(document.getElementById(cur).innerText);
    console.log(cur);
    if ((String(expId).indexOf("exp") != -1)) {
        //console.log("@@@@");
        //console.log(testArr[cur]);

        if (testArr[cur] != undefined && testArr[cur] != "undefined") {
            for (var te = 0; te < testArr[cur].length; te++) {
                //console.log(document.getElementById(cur));
                var tempMargin = String(document.getElementById("display" + cur).style.margin).substr(0, String(document.getElementById("display" + cur).style.margin).indexOf("px"));
                document.getElementById("display" + testArr[cur][te]).style.margin = tempMargin + 15 + "px";
                document.getElementById("display" + testArr[cur][te]).style.display = "block";
                document.getElementById("display" + testArr[cur][te]).style.backgroundColor = "yellow";
            }

        }

    }
    ////console.log("ERR" + cur + "#" + document.getElementById(cur));
    curBorder = document.getElementById(cur).style.border;
    document.getElementById(tesmp).style.border = "10px solid green";
    if (document.getElementById("display" + cur) != null && document.getElementById("display" + cur).style != null) {
        document.getElementById("display" + cur).style.backgroundColor = "white";
    } document.getElementById('ctr-height').value = document.getElementById(cur).style.height;
    document.getElementById('ctr-width').value = document.getElementById(cur).style.width;
    document.getElementById('ctr-overflow').value = document.getElementById(cur).style.overflow;
    document.getElementById('ctr-class').value = document.getElementById(cur).classList;
    document.getElementById('ctr-bg-clr').value = document.getElementById(cur).style.backgroundColor;
    document.getElementById('ctr-padding').value = document.getElementById(cur).style.padding;
    document.getElementById('ctr-margin').value = document.getElementById(cur).style.margin;
    document.getElementById('ctr-holder').value = document.getElementById(cur).getAttribute('placeholder');
    document.getElementById('ctr-text').value = document.getElementById(cur).innerText;
    document.getElementById('ctr-display').value = document.getElementById(cur).style.display;
    document.getElementById('ctr-align').value = document.getElementById(cur).style.textAlign;
    document.getElementById('ctr-src').value = document.getElementById(cur).getAttribute('src');
    document.getElementById('ctr-bg').value = document.getElementById(cur).style.background;
    document.getElementById('ctr-op').value = document.getElementById(cur).style.opacity;
    document.getElementById('ctr-pos').value = document.getElementById(cur).style.position;
    document.getElementById('ctr-float').value = document.getElementById(cur).style.float;
    document.getElementById('ctr-border').value = document.getElementById(cur).style.border;
    if (keyValue[cur] != undefined) {
        document.getElementById('ctr-click').value = keyValue[cur];
    }
    else {
        document.getElementById('ctr-click').value = "";
    }

    document.getElementById('ctr-color').value = document.getElementById(cur).style.color;
    document.getElementById('ctr-bind').value = document.getElementById(cur).getAttribute('bind');
    document.getElementById('ctr-name').value = document.getElementById(cur).name;

});

document.getElementById('ctr-height').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.height = ev.target.value;
})

document.getElementById('ctr-width').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.width = ev.target.value;
})

document.getElementById('ctr-overflow').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.overflow = ev.target.value;
})


document.getElementById('ctr-class').addEventListener('focusout', (ev) => {
    document.getElementById(cur).classList = ev.target.value;
})

document.getElementById('ctr-bg-clr').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.backgroundColor = ev.target.value;
})


document.getElementById('ctr-padding').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.padding = ev.target.value;
})

document.getElementById('ctr-margin').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.margin = ev.target.value;
})

document.getElementById('ctr-holder').addEventListener('focusout', (ev) => {
    document.getElementById(cur).setAttribute('placeholder', ev.target.value);
})


document.getElementById('ctr-text').addEventListener('focusout', (ev) => {
    document.getElementById(cur).innerText = ev.target.value;
})

document.getElementById('ctr-name').addEventListener('focusout', (ev) => {
    document.getElementById(cur).name = ev.target.value;
})


document.getElementById('ctr-display').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.display = ev.target.value;
})

document.getElementById('ctr-align').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.textAlign = ev.target.value;
})


document.getElementById('ctr-src').addEventListener('focusout', (ev) => {
    document.getElementById(cur).setAttribute('src', ev.target.value);
})

document.getElementById('ctr-bg').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.background = ev.target.value;
})


document.getElementById('ctr-op').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.opacity = ev.target.value;
})


document.getElementById('ctr-pos').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.position = ev.target.value;
})

document.getElementById('ctr-color').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.color = ev.target.value;
})
document.getElementById('ctr-border').addEventListener('focusout', (ev) => {
    document.getElementById(cur).style.border = ev.target.value;
    curBorder = ev.target.value;
})

function click(ev) {
    ////console.log("listener added");
    ev.preventDefault();
    ////console.log("EVENTG" + keyValue[ev.target.id]);
    eval(keyValue[ev.target.id]);

}

document.getElementById('ctr-click').addEventListener('focusout', (ev) => {

    keyValue[cur] = ev.target.value;
    document.getElementById(cur).removeEventListener('click', click);
    document.getElementById(cur).addEventListener('click', click)
})

var schemaStructure;

document.getElementById('ctr-bind').addEventListener('focusout', (ev) => {
    bindObject(ev.target.value, cur)
})

var testArr = [];

bindObject = (bindObjName, currentEl) => {
    document.getElementById(currentEl).innerHTML = "";
    for (var i = 0; i < objs.length; i++) {
        if (bindObjName == objs[i].schemaName) {

            var ts = new Date().getTime();

            if (document.getElementById(currentEl).tagName == "FORM") {
                //console.log("OBJ NAME");
                //console.log(bindObjName);
                var doc = document.createElement("DIV");
                doc.id = ts;
                ////console.log(objs[i].schemaStructure)
                var schema = objs[i].schemaStructure;
                for (key in schema) {
                    if (schema[key].control == "text") {
                        var newEl = document.createElement("INPUT");
                        newEl.className = "form-control";
                        console.log(schema[key].type);
                        console.log("####");
                        console.log(schema[key].type == "String");
                        console.log("####");
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

                        if (typeof (schema[key].required) !== 'undefined'  && schema[key].required=="true") {
                            newEl.required = true;
                        }


                        newEl.setAttribute("placeholder", key);
                        console.log("NEWEL:-");
                        console.log(newEl);
                        //document.getElementById(cur).appendChild(newEl);
                        doc.appendChild(newEl);

                    }
                    else if (schema[key].control == "radio") {
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
                            newEl.value = k;

                            newDiv.appendChild(newEl);


                            newDiv.innerHTML += ts[k]
                            console.log("########################");
                            console.log(newDiv);
                            console.log("########################");
                            alpha.appendChild(newDiv);


                        }

                        doc.appendChild(alpha);


                    }

                    else if (schema[key].control == "select") {
                        var ts = schema[key].options
                        ////console.log(ts[0]);
                        var alpha = document.createElement("SELECT");
                        alpha.className = "form-control";


                        for (k in ts[0]) {
                            alpha.innerHTML += '<option value="' + k + '">' + ts[0][k] + '</option>'


                        }

                        doc.appendChild(alpha);


                    }
                }
                document.getElementById(currentEl).appendChild(doc);



            } else {
                var header = "";
                ////console.log(document.getElementById(currentEl).innerHTML);
                schemaStructure = objs[i].schemaStructure;
                for (key in objs[i].schemaStructure) {
                    ////console.log(key + "#" + objs[i].schemaStructure[key].type);
                    header += "<th>" + key + "</th>";


                }

                document.getElementById(currentEl).innerHTML = header + "<tbody id='tbody" + currentEl + "'></tbody>";
            }

        }
    }


    document.getElementById(currentEl).setAttribute('bind', bindObjName);
}


document.getElementById('right-section').addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    var tesmp = ev.target.id;

    tesmp = tesmp.replace("display", "")

    document.getElementById(tesmp).parentNode.removeChild(document.getElementById(tesmp));
    document.getElementById('right-section').innerHTML = "";
    checkForMe('main-section', 1, "none");
});

var tempArr = [];

var parentMain = ""
checkForMe = (mainNode, count, parent) => {
    //console.log("AVCD");

    if (hoverElement != "") {
        try {
            document.getElementById(hoverElement).removeChild(document.getElementById(divId));
        } catch (e) {

        }

    }

    if (mainNode != "megaCheck") {
        var parent_id = mainNode;
        var parent_name = "none"
        if (document.getElementById(parent) != undefined) {
            parent_name = document.getElementById(parent).name;
        }
        tempArr.push({
            id: document.getElementById(mainNode).id,
            name: document.getElementById(mainNode).name,
            tagName: document.getElementById(mainNode).tagName,
            parentId: parent,
            parentName: parent_name,
            class: document.getElementById(mainNode).className,
            height: document.getElementById(mainNode).style.height,
            width: document.getElementById(mainNode).style.width,
            display: document.getElementById(mainNode).style.display,
            overflow: document.getElementById(mainNode).style.overflow,
            bgc: document.getElementById(mainNode).style.backgroundColor,
            align: document.getElementById(mainNode).style.textAlign,
            padding: document.getElementById(mainNode).style.padding,
            margin: document.getElementById(mainNode).style.margin,
            holder: document.getElementById(mainNode).getAttribute('placeholder'),
            text: document.getElementById(mainNode).innerText,
            src: document.getElementById(mainNode).getAttribute('src'),
            background: document.getElementById(mainNode).style.background,
            opacity: document.getElementById(mainNode).style.opacity,
            position: document.getElementById(mainNode).style.position,
            float: document.getElementById(mainNode).style.float,
            color: document.getElementById(mainNode).style.color,
            binding: document.getElementById(mainNode).getAttribute('bind'),
            border: document.getElementById(mainNode).style.border
        });
        ////console.log(document.getElementById(mainNode).name + "#" + document.getElementById(mainNode).tagName + "#" + document.getElementById(mainNode).id + "--->" + "Parent->" + parent_name + "#" + parent + "STYLE->" + document.getElementById(mainNode).style);
        var temp = document.createElement("DIV");
        var h3 = document.createElement("H3")
        h3.id = "exp" + mainNode;
        h3.innerText = "+";
        temp.id = "display" + mainNode;
        temp.draggable = true;
        temp.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('dr', String(temp.id).replace('display', ''))
        })
        temp.ondragstart = "drag(event)";
        var par = "";
        for (var k = 1; k < count; k++) {
            par += "-"
        }

        ////console.log("*********************");
        ////console.log("Parent:-" + parent);
        ////console.log("Current" + mainNode)
        ////console.log("Current" + document.getElementById(mainNode).hasChildNodes())
        ////console.log("*********************");
        if (parent == "none") {
            testArr[parent] = [];
        } else if (testArr[parent] != undefined) {
            testArr[parent].push(mainNode);
        }
        else {
            testArr[parent] = [];
        }
        if (parent != "main-section" && parent != "none") {
            // temp.style.display = "none";
            console.log("**");
            console.log(parent);
            console.log(document.getElementById(mainNode).name);

            var tempMargin = String(document.getElementById("display" + parent).style.marginLeft).substr(0, String(document.getElementById("display" + parent).style.marginLeft).indexOf("px"));
            console.log(tempMargin);
            console.log("**");

            temp.style.marginLeft = (Number(tempMargin) + 15) + "px";
        }
        else {
            temp.style.marginLeft = "0px"
        }
        temp.innerHTML = "";
        //        temp.appendChild(h3);
        //        temp.innerHTML += '<p id="exp"'+mainNode+'><strong><i class="fas fa-plus"></i></strong> '+document.getElementById(mainNode).tagName + "->" + document.getElementById(mainNode).name+"</p> <br>" + par + mainNode + "<hr>";
        //temp.innerHTML += '<p id="exp' + mainNode + '"><div><strong id="exp"'+mainNode+'><i class="fas fa-plus"></i></strong> ' + document.getElementById(mainNode).tagName + "->" + document.getElementById(mainNode).name + "</p><hr></div>";
        //temp.innerHTML += '<strong id="exp' + mainNode + '"><i class="fas fa-plus"></i></strong> ' + document.getElementById(mainNode).tagName + "->" + document.getElementById(mainNode).name + "<hr>";
        temp.innerHTML += document.getElementById(mainNode).tagName + "->" + document.getElementById(mainNode).name + "<hr>";
        document.getElementById('right-section').appendChild(temp);
        // document.getElementById('exp' + mainNode).addEventListener('click', (ev) => {
        //     if (document.getElementById(ev.target.id).innerText == "+") {
        //         //console.log("PLUS EXISTS");
        //         document.getElementById(ev.target.id).innerText = "-"
        //     } else {
        //         document.getElementById(ev.target.id).innerText = "+"
        //         //console.log("MINUS EXISTS");

        //     }
        // })
        mainNode = document.getElementById(mainNode);
        var nodes = mainNode.childNodes;
        var i = 0;
        //  ////console.log(nodes)

        while (nodes != undefined && i < nodes.length) {
            if (nodes[i].id != undefined && nodes[i].id != '') {
                checkForMe(nodes[i].id, count + 1, parent_id);
            }
            i += 1;
        }
    }
    // ////console.log("*******************");
    console.log("***");
    console.log(testArr);
}



document.getElementById('preview').addEventListener('click', (ev) => {
    var previewWindow = window.open('', "Preview Window");
    previewWindow.document.write('<html><head><link rel="stylesheet" href="css/bootstrap-4.0.0-dist/css/bootstrap.min.css">    <link rel="stylesheet" href="css/formBuilder.css"> </head><body>' + document.getElementById('main-section').innerHTML + '<script type="application/javascript" src="js/main.js"></body > ');
})


document.getElementById('saveForm').addEventListener('click', (ev) => {
    if (cur.length > 0 && document.getElementById(cur) != undefined &&
        document.getElementById(cur).style != null) {
        document.getElementById(cur).style.border = curBorder;
    }
    if (hoverElement != "") {
        try {
            document.getElementById(hoverElement).removeChild(document.getElementById(divId));
        } catch (e) {

        }

    }


    document.getElementById('right-section').innerHTML = "";
    tempArr = [];
    checkForMe('main-section', 1, "none");

    ////console.log(tempArr);


    var jsonBody = '{"name":"' + document.getElementById('formName').value + '","structure":' + JSON.stringify(tempArr) + '}';
    ////console.log(jsonBody);

    //    body = '<html><head><link rel="stylesheet" href="css/bootstrap-4.0.0-dist/css/bootstrap.min.css">    <link rel="stylesheet" href="css/main.css"> </head><body>' + document.getElementById('main-section').innerHTML + '</body > '
    //
    //    var jsonBody = "{name:'sample',form:'" + body + "'}"
    //    
    //    ////console.log(jsonBody);
    //
    if (jsonBody.indexOf("Submit") == -1) {
        alert("Submit button will be added by the system since the user has not added! And if reject is applicable, the same will also be added by the system");
    }
    if (formId != undefined && formId.length > 0) {
        fetch('/forms/' + formId, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'

            },
            credentials: 'include',
            body: jsonBody
        }).then((prom) => {
            return prom.text();
        }).then((res) => {
            window.location.hash = "listForms"

            ////console.log(res);
        })
    } else {
        fetch('/forms', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'

            },
            credentials: 'include',
            body: jsonBody
        }).then((prom) => {
            return prom.text();
        }).then((res) => {
            window.location.hash = "listForms"
            ////console.log(res);
        })
    }


})

document.getElementById('clearForm').addEventListener('click', (ev) => {

    //    var alpha = document.createElement(tempArr[1].tagName);
    //    alpha.id = tempArr[1].id;
    //    alpha.name = tempArr[1].name;


    document.getElementById('main-section').innerHTML = "";



    //document.getElementById('main-section').appendChild(alpha);
    ////console.log(tempArr);
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
        ////console.log(tempArr[i]);

        document.getElementById(tempArr[i].parentId).appendChild(beta);

        if (tempArr[i].tagName == "FORM" || tempArr[i].tagName == "TABLE") {
            bindObject(beta.getAttribute('bind'), beta.id)
        }


    }
    document.getElementById('right-section').innerHTML = "";
    checkForMe('main-section', 1, "none");



    //    var previewWindow = window.open('', "Preview Window");
    //    previewWindow.document.write('<html><head><link rel="stylesheet" href="css/bootstrap-4.0.0-dist/css/bootstrap.min.css">    <link rel="stylesheet" href="css/main.css"> </head><body>' + document.getElementById('main-section').innerHTML + '<script type="application/javascript" src="js/main.js"></body > ');
    //
    //    ////console.log(tempArr);

});

document.getElementById('megaCheck').addEventListener('click', (ev) => {
    if (ev.target.id == "megaCheck")
        document.getElementById('megaCheck').style.display = "none";
});

document.getElementById('closeModal').addEventListener('click', (ev) => {
    document.getElementById('megaCheck').style.display = "none";
});

var hoverElement = "";;
var divId = new Date().getTime();
var buttonId = new Date().getTime();
document.getElementById('main-section').addEventListener('mouseover', (ev) => {
    if (document.getElementById(ev.target.id) != null && hoverElement != ev.target.id && ev.target.id != divId && ev.target.id != "1_" + buttonId && ev.target.id != "2_" + buttonId) {
        var new_div = document.createElement('DIV');
        new_div.id = divId;
        new_div.style.backgroundColor = "white";
        var new_button1 = document.createElement('BUTTON');
        new_button1.id = "1_" + buttonId;
        var new_button2 = document.createElement('BUTTON');
        new_button2.id = "2_" + buttonId;
        var new_text = document.createElement('P');
        //console.log(document.getElementById(ev.target.id));
        new_text.innerText = document.getElementById(ev.target.id).name;
        new_div.style.position = "absolute";
        new_div.style.float = "left";
        new_div.style.display = "flex";
        //        new_div.style.display = "flex";
        new_button1.innerText = "X";
        new_button2.innerText = "C";
        new_div.appendChild(new_button1);
        new_div.appendChild(new_button2);
        new_div.appendChild(new_text);
        ////console.log("********" + new Date().getTime());
        ////console.log(hoverElement);
        if (hoverElement != "") {
            try {
                document.getElementById(hoverElement).removeChild(document.getElementById(divId));
            } catch (e) {

            }

        }
        if (document.getElementById(ev.target.id) != null) {
            hoverElement = ev.target.id;
            document.getElementById(ev.target.id).appendChild(new_div);
            document.getElementById("1_" + buttonId).addEventListener('click', (ev) => {
                ev.preventDefault();
                document.getElementById(hoverElement).parentNode.removeChild(document.getElementById(hoverElement))
            })
            document.getElementById("2_" + buttonId).addEventListener('click', (ev) => {
                ev.preventDefault();
                //document.getElementById(hoverElement).parentNode.removeChild(document.getElementById(hoverElement))
                var copiedEl = document.getElementById(hoverElement);
                clonedEl = copiedEl.cloneNode(true);
                document.getElementById(hoverElement).parentNode.appendChild(clonedEl);
                ////console.log("XXXXXXXXXXXXX");
            })
        }


    }
})



// document.getElementById('addEvent').addEventListener('click', (ev) => {
//     var newDiv = document.createElement("DIV");
//     newDiv.className = "row";
//     var div1 = document.createElement("DIV");
//     var div2 = document.createElement("DIV");
//     var select = document.createElement("SELECT");
//     select.innerHTML += "<option></option><option value='click'>click</option>"
//     select.id = "sel1"
//     div1.className = "col-4";
//     div1.appendChild(select);
//     div2.className = "col-8";
//     var text = document.createElement('INPUT');
//     text.id = "scr1";
//     div2.appendChild(text);
//     newDiv.appendChild(div1);
//     newDiv.appendChild(div2);
//     document.getElementById('events').appendChild(newDiv);
//     document.getElementById(text.id).addEventListener('focusout', (ev) => {
//         document.getElementById(cur).addEventListener(document.getElementById('sel1').value, (ev) => {
//             ////console.log(document.getElementById('scr1').value);
//             eval(document.getElementById('scr1').value);
//         })
//     })
// })


// document.getElementById('toggle').addEventListener('click', (ev) => {
//     console.log(document.getElementsByClassName("left-section")[0].className);
//     if (document.getElementsByClassName("left-section")[0].className.indexOf("col-2") != -1) {
//         document.getElementsByClassName("left-section")[0].className = String(document.getElementsByClassName("left-section")[0].className).replace("col-2", "col-1");
//         document.getElementsByClassName("main-section")[0].className = String(document.getElementsByClassName("main-section")[0].className).replace("col-8", "col-9");
//         document.getElementsByClassName("right-section")[0].className = String(document.getElementsByClassName("right-section")[0].className).replace("col-2", "col-2");
//         document.getElementById('left-section').style.cursor = "pointer";
//         document.getElementById('left-hide-section').style.display = "none";
//     }

// })

document.getElementById('left-section').addEventListener('click', (ev) => {
    console.log(document.getElementsByClassName("left-section")[0].className.indexOf("col-1"));
    console.log(ev.target.id);
    if (document.getElementsByClassName("left-section")[0].className.indexOf("col-xs-1") != -1 && ev.target.id == "toggle") {
        console.log("IN 1");
        document.getElementsByClassName("left-section")[0].className = String(document.getElementsByClassName("left-section")[0].className).replace("col-xs-1", "col-2");
        document.getElementsByClassName("main-section")[0].className = String(document.getElementsByClassName("main-section")[0].className).replace("col-xs-9", "col-8");
        document.getElementsByClassName("right-section")[0].className = String(document.getElementsByClassName("right-section")[0].className).replace("col-xs-2", "col-2");
        document.getElementById('test-c').className = String(document.getElementById('test-c').className).replace("col-12", "col-2");
        document.getElementById('toggle').innerText = "<";
        document.getElementById('left-hide-section').style.display = "block";
        document.getElementById('left-section').style.cursor = "";

    }
    else if (document.getElementsByClassName("left-section")[0].className.indexOf("col-2") != -1 && ev.target.id == "toggle") {
        console.log("IN 2");
        document.getElementsByClassName("left-section")[0].className = String(document.getElementsByClassName("left-section")[0].className).replace("col-2", "col-xs-1");
        document.getElementsByClassName("main-section")[0].className = String(document.getElementsByClassName("main-section")[0].className).replace("col-8", "col-xs-9");
        document.getElementsByClassName("right-section")[0].className = String(document.getElementsByClassName("right-section")[0].className).replace("col-2", "col-xs-2");
        document.getElementById('test-c').className = String(document.getElementById('test-c').className).replace("col-2", "col-12");
        document.getElementById('toggle').innerText = ">";
        document.getElementById('left-section').style.cursor = "pointer";
        document.getElementById('left-hide-section').style.display = "none";


    }
})



onLoad();