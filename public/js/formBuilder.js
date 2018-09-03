
var objs = [];
var formId = "";

var keyValue = [];

onLoad = () => {
    fetch('/api/bpm/objects', {

        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        objs = JSON.parse(res);
        document.getElementById('ctr-bind').innerHTML += "<option value=''></option>";
        for (var ob in JSON.parse(res)) {
            document.getElementById('ctr-bind').innerHTML += "<option value='" + objs[ob].schemaName + "'>" + objs[ob].schemaName + "</option>";
        }

    }).then(() => {
        var alpha = window.location.href.substr(window.location.href.indexOf("?") + 1, window.location.href.length)

        formId = window.location.hash.substr(7);
        if (formId != undefined && formId != "undefined" && formId.length > 0) {

        }
        else {
            removeLoadBar();

        }
        if (formId != undefined && formId != "undefined" && formId.length > 0) {
            fetch('/api/bpm/forms/' + formId, {

                credentials: 'include'
            }).then((prom) => {
                return prom.text()
            }).then((res) => {
            
                var tempArr = (JSON.parse(res).structure)

                document.getElementById("formName").value = (JSON.parse(res).name);

               
                for (var i = 1; i < tempArr.length; i++) {
                    var beta = document.createElement(tempArr[i].tagName);
                    beta.id = tempArr[i].id;
                    beta.setAttribute("name",tempArr[i].name);
                    beta.className = tempArr[i].class;
                    if (tempArr[i].tagName != "DIV" && tempArr[i].tagName != "FORM" && tempArr[i].tagName != "TABLE") beta.innerText = tempArr[i].text;
                    beta.style.display = tempArr[i].display;
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
                        createDms();
                    }

                    if (String(beta.id).indexOf("bt") != -1) {

                        document.getElementById(beta.id).addEventListener('click', (ev) => {

                            cur = String(ev.target.id).replace("bt", "");

                            for (var i = 0; i < objs.length; i++) {

                                if (document.getElementById(String(ev.target.id).replace("bt", "")).getAttribute('bind') == objs[i].schemaName) {

                                    schemaStructure = objs[i].schemaStructure;
                                }
                            }



                           
                            document.getElementById('megaCheck').style.display = "block"
                            document.getElementById('contentModal1').innerHTML = "";
                          
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


                document.getElementById('right-section').innerHTML = "";
                checkForMe('main-section', 1, "none");
                removeLoadBar();

                

            })
        }
    });
}

mode = "";
finalNode = "";


drag = (event) => {
    event.dataTransfer.setData("dr", event.target.id);
}

currentHoverId = "";
currentElDrag = "";
nextNode = "";

onDragOver = (event) => {

    event.preventDefault();

 
    if (event.target.id != "" && event.target.id != "tempDiv1" &&
        document.getElementById(event.target.id).tagName != "FORM") {

        currentHoverId = event.target.id;

        if (hoverElement != "") {
            try {
                document.getElementById(hoverElement).removeChild(document.getElementById(divId));
            } catch (e) {

            }

        }

        var cren = document.getElementById(event.target.id).childNodes;
        distance = -1;
        distanceX = event.x;
        distanceY = event.y;
        var tempEl = "";
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
                   
                    distance = Math.min(distance1, distance2, distance3)
                    tempEl = cren[i].id;
                   
                } else {
                    distance1 = Math.sqrt(Math.pow((point1X - distanceX), 2) + Math.pow((distanceY - point1Y), 2));
                    distance2 = Math.sqrt(Math.pow((point2X - distanceX), 2) + Math.pow((distanceY - point2Y), 2));
                    distance3 = Math.sqrt(Math.pow((point3X - distanceX), 2) + Math.pow((distanceY - point3Y), 2));

                    tempDistance = Math.min(distance1, distance2, distance3);

                

                    if (tempDistance < distance) {
                     
                        tempEl = cren[i].id;
                        distance = tempDistance;

                    }

                }
            }
        }
      
        if ((tempEl != "" && tempEl != currentElDrag) || cren.length == 0) {
            if (document.getElementById('tempDiv1') != null) {
                document.getElementById('tempDiv1').parentNode.removeChild(document.getElementById('tempDiv1'))
            }

            currentElDrag = tempEl;
            if (tempEl != "") {

                nextNode = document.getElementById(tempEl).nextSibling;
            }
          

            if (cren.length == 0) {
                var div = document.createElement('DIV');
                div.id = "tempDiv1"
                
                div.style.backgroundColor = "blue";
                mode = "parent";
                finalNode = document.getElementById(event.target.id);
                document.getElementById(event.target.id).appendChild(div);
            }
            else if (nextNode == null) {
                var div = document.createElement('DIV');
                div.id = "tempDiv1"
               
                div.style.backgroundColor = "blue";
                div.className = "col-1";
                mode = "parent";
                div.style.border = "2px solid grey"
                
                finalNode = document.getElementById(tempEl).parentNode;
                document.getElementById(tempEl).parentNode.appendChild(div);

            } else {
                var div = document.createElement('DIV');
                div.style.height = "100%";
                div.id = "tempDiv1"
                div.style.widows = "100%";
                div.style.backgroundColor = "blue";
                div.className = "col-1";

                mode = "next";
                finalNode = document.getElementById(tempEl).parentNode;

                document.getElementById(tempEl).parentNode.insertBefore(div, nextNode);
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



    });


}

drop = (event) => {

    if (document.getElementById('tempDiv1') != null) {
        document.getElementById('tempDiv1').parentNode.removeChild(document.getElementById('tempDiv1'))
    }
    ts = new Date().getTime();
    sourceElement = (event.dataTransfer.getData("dr"));
    id = new Date().getTime();

    var noClick = "N";

    if (sourceElement == "container") {
        ;
        var newContainer = document.createElement("DIV");
        newContainer.setAttribute("name","");
        newContainer.id = id;
        newContainer.style.backgroundColor = "red";
        newContainer.style.height = "100%";
        
        if (mode == "parent") {
            finalNode.appendChild(newContainer);
        } else {
            finalNode.insertBefore(newContainer, nextNode);
        }
     
    } else if (sourceElement == "table") {
        var newTable = document.createElement("TABLE");
        newTable.setAttribute("name","");
 
        newTable.id = "table_" + ts;
        newTable.innerHTML = "<th>Name</th><th>Age</th><tr><td>Anuraag</td><td>27</td></tr>"
        newTable.id = id;
        newTable.setAttribute("bind", objs[0].schemaName)

        newTable.style.cursor = "pointer";
        newTable.className = "table";
        newTable.style.background = "yellow";
       
        if (mode == "parent") {
            finalNode.appendChild(newTable);
        } else {
            finalNode.insertBefore(newTable, nextNode);
        }
        var newButton = document.createElement("BUTTON");
        newButton.id = "bt" + id;
        newButton.innerText = "+"
        if (mode == "parent") {
            finalNode.appendChild(newButton);
        } else {
            finalNode.insertBefore(newButton, nextNode);
        }
        document.getElementById('bt' + id).addEventListener('click', (ev) => {
        
            document.getElementById('megaCheck').style.display = "block"
            document.getElementById('contentModal1').innerHTML = "";
            
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
                    tempRow += "<td>" + document.getElementById(temp).value + "</td>"
                }

                tempRow += "</tr>"
                document.getElementById('megaCheck').style.display = "none";



                document.getElementById("tbody" + cur).innerHTML += (tempRow);
            })



        });
        newTable.addEventListener('click', (event) => {
            

        })
        bindObject(objs[0].schemaName, ts);
    } else if (sourceElement == "button") {
        var newButton = document.createElement("BUTTON");
        newButton.setAttribute("name","");

        newButton.ondrop = "drop1(event)"
        newButton.innerText = "Submit";
        newButton.id = id;
        newButton.className = "btn btn-primary";
        if (mode == "parent") {
            finalNode.appendChild(newButton);
        } else {
            finalNode.insertBefore(newButton, nextNode);
        }
    } else if (sourceElement == "form") {
        var newForm = document.createElement("FORM");
        newForm.setAttribute("name","");

        newForm.id = id;
        newForm.className = "form-group";
        newForm.style.width = "100%";
        newForm.setAttribute("bind", objs[0].schemaName)
        if (mode == "parent") {
            finalNode.appendChild(newForm);
        } else {
            finalNode.insertBefore(newForm, nextNode);
        }
        
    } else if (sourceElement == "para") {
        var newPara = document.createElement("P");
        newPara.setAttribute("name","");

        newPara.id = id;
        newPara.innerText = "This is the sample para. Change it using the text property below!"
        if (mode == "parent") {
            finalNode.appendChild(newPara);
        } else {
            finalNode.insertBefore(newPara, nextNode);
        }
    } else if (sourceElement == "hr") {
        var newHr = document.createElement("HR");
        newHr.setAttribute("name","");

        newHr.id = id;
        newHr.style.border = "1px solid black";
        
        if (mode == "parent") {
            finalNode.appendChild(newHr);
        } else {
            finalNode.insertBefore(newHr, nextNode);
        }
    } else if (sourceElement == "image") {
        var newImage = document.createElement("IMG");
        newImage.setAttribute("name","");

        newImage.src = "sample.png";
        newImage.style.border = "1px solid black"
        newImage.id = id;
        if (mode == "parent") {
            finalNode.appendChild(newImage);
        } else {
            finalNode.insertBefore(newImage, nextNode);
        }
    } else if (sourceElement == "text") {
        match = false;
        var test = event.target;
        while (test.id != 'main-section' && match == false) {
            if (test.tagName == "FORM") {
                match = true;
            } else {
                test = test.parentNode;
            }
        }
        if (match == true) {
            var newText = document.createElement("INPUT");
            newText.setAttribute("name","");

            newText.id = id;
            newText.className = "form-control";
            event.target.appendChild(newText);
        } else {
            noClick = "Y";
            alert("Input text can be applied only to a form");
        }
    } else if (sourceElement == "dms") {
        var newDMS = document.createElement("mydms");
        newDMS.id = id;
        newDMS.setAttribute("uniqueIdentifier", new Date().getTime());
        newDMS.setAttribute("name","");

        
        if (mode == "parent") {
            finalNode.appendChild(newDMS);
        } else {
            finalNode.insertBefore(newDMS, nextNode);
        }
        createDms("builder");
    }

    showData(document.getElementById("main-section"));
    document.getElementById('right-section').innerHTML = "";
    checkForMe('main-section', 1, "none");
    if (noClick != "Y") {
        document.getElementById('display' + ts).click();

    }
    if (sourceElement == "form") {
        bindObject(objs[0].schemaName, ts);

    }
}

drop1 = (event) => {
    event.preventDefault();
}



showData = (node) => {
    if (node.hasChildNodes) {
        node.childNodes.forEach((child) => {
            showData(child);
        });
    }
    if (node.id != '' && node.id != 'undefined') 
        return node;
}




var cur = "";
var curBorder = "";

document.getElementById('right-section').addEventListener('click', (ev) => {
    document.getElementById('prop-div').style.visibility = "visible";
    document.getElementById('prop-div-pane').style.visibility = "hidden";
    document.getElementById('prop-div-pane').style.display = "none";
    var tesmp = ev.target.id;
    var expId = ev.target.id;

    tesmp = tesmp.replace("display", "")
    tesmp = tesmp.replace("exp", "")

    
    if (cur.length > 0 && document.getElementById(cur) != undefined &&
        document.getElementById(cur).style != null) {
        
        document.getElementById(cur).style.border = curBorder;
        if (document.getElementById("display" + cur) != null && document.getElementById("display" + cur).style != null) {
            document.getElementById("display" + cur).style.backgroundColor = "grey";

        }

    }
    cur = tesmp;
    
    if ((String(expId).indexOf("exp") != -1)) {
      
        if (testArr[cur] != undefined && testArr[cur] != "undefined") {
            for (var te = 0; te < testArr[cur].length; te++) {
                var tempMargin = String(document.getElementById("display" + cur).style.margin).substr(0, String(document.getElementById("display" + cur).style.margin).indexOf("px"));
                document.getElementById("display" + testArr[cur][te]).style.margin = tempMargin + 15 + "px";
                document.getElementById("display" + testArr[cur][te]).style.display = "block";
                document.getElementById("display" + testArr[cur][te]).style.backgroundColor = "yellow";
            }

        }

    }
    curBorder = document.getElementById(cur).style.border;
    document.getElementById(tesmp).style.border = "10px solid green";
    if (document.getElementById("display" + cur) != null && document.getElementById("display" + cur).style != null) {
        document.getElementById("display" + cur).style.backgroundColor = "white";
    } document.getElementById('ctr-height').value = document.getElementById(cur).style.height;
    document.getElementById('ctr-width').value = document.getElementById(cur).style.width;
    document.getElementById('ctr-overflow').value = document.getElementById(cur).style.overflow;
    document.getElementById('ctr-class').value = document.getElementById(cur).classList;
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
    document.getElementById('ctr-name').value = document.getElementById(cur).getAttribute("name");
    if (document.getElementById(cur).tagName == "FORM") {
        document.getElementById('prop-name').style.visibility = "visible";
        document.getElementById('prop-height').style.visibility = "visible";
        document.getElementById('prop-width').style.visibility = "visible";
        document.getElementById('prop-display').style.visibility = "hidden";
        document.getElementById('prop-overflow').style.visibility = "hidden";
        document.getElementById('prop-class').style.visibility = "visible";
        document.getElementById('prop-align').style.visibility = "hidden";
        document.getElementById('prop-padding').style.visibility = "visible";
        document.getElementById('prop-margin').style.visibility = "visible";
        document.getElementById('prop-holder').style.visibility = "hidden";
        document.getElementById('prop-text').style.visibility = "hidden";
        document.getElementById('prop-src').style.visibility = "hidden";
        document.getElementById('prop-background').style.visibility = "visible";
        document.getElementById('prop-opacity').style.visibility = "hidden";
        document.getElementById('prop-position').style.visibility = "hidden";
        document.getElementById('prop-float').style.visibility = "hidden";
        document.getElementById('prop-binding').style.visibility = "visible";
        document.getElementById('prop-color').style.visibility = "visible";
        document.getElementById('prop-border').style.visibility = "visible";
    } else if (document.getElementById(cur).tagName == "TABLE") {
        document.getElementById('prop-name').style.visibility = "visible";
        document.getElementById('prop-height').style.visibility = "visible";
        document.getElementById('prop-width').style.visibility = "visible";
        document.getElementById('prop-display').style.visibility = "hidden";
        document.getElementById('prop-overflow').style.visibility = "hidden";
        document.getElementById('prop-class').style.visibility = "visible";
        document.getElementById('prop-align').style.visibility = "hidden";
        document.getElementById('prop-padding').style.visibility = "visible";
        document.getElementById('prop-margin').style.visibility = "visible";
        document.getElementById('prop-holder').style.visibility = "hidden";
        document.getElementById('prop-text').style.visibility = "hidden";
        document.getElementById('prop-src').style.visibility = "hidden";
        document.getElementById('prop-background').style.visibility = "visible";
        document.getElementById('prop-opacity').style.visibility = "hidden";
        document.getElementById('prop-position').style.visibility = "hidden";
        document.getElementById('prop-float').style.visibility = "hidden";
        document.getElementById('prop-binding').style.visibility = "visible";
        document.getElementById('prop-color').style.visibility = "visible";
        document.getElementById('prop-border').style.visibility = "visible";
    } else if (document.getElementById(cur).tagName == "P") {
        document.getElementById('prop-name').style.visibility = "visible";
        document.getElementById('prop-height').style.visibility = "visible";
        document.getElementById('prop-width').style.visibility = "visible";
        document.getElementById('prop-display').style.visibility = "hidden";
        document.getElementById('prop-overflow').style.visibility = "hidden";
        document.getElementById('prop-class').style.visibility = "visible";
        document.getElementById('prop-align').style.visibility = "hidden";
        document.getElementById('prop-padding').style.visibility = "visible";
        document.getElementById('prop-margin').style.visibility = "visible";
        document.getElementById('prop-holder').style.visibility = "hidden";
        document.getElementById('prop-text').style.visibility = "visible";
        document.getElementById('prop-src').style.visibility = "hidden";
        document.getElementById('prop-background').style.visibility = "visible";
        document.getElementById('prop-opacity').style.visibility = "hidden";
        document.getElementById('prop-position').style.visibility = "hidden";
        document.getElementById('prop-float').style.visibility = "hidden";
        document.getElementById('prop-binding').style.visibility = "hidden";
        document.getElementById('prop-color').style.visibility = "visible";
        document.getElementById('prop-border').style.visibility = "visible";
    } else if (document.getElementById(cur).tagName == "HR") {
        document.getElementById('prop-name').style.visibility = "visible";
        document.getElementById('prop-height').style.visibility = "visible";
        document.getElementById('prop-width').style.visibility = "visible";
        document.getElementById('prop-display').style.visibility = "hidden";
        document.getElementById('prop-overflow').style.visibility = "hidden";
        document.getElementById('prop-class').style.visibility = "hidden";
        document.getElementById('prop-align').style.visibility = "hidden";
        document.getElementById('prop-padding').style.visibility = "visible";
        document.getElementById('prop-margin').style.visibility = "visible";
        document.getElementById('prop-holder').style.visibility = "hidden";
        document.getElementById('prop-text').style.visibility = "hidden";
        document.getElementById('prop-src').style.visibility = "hidden";
        document.getElementById('prop-background').style.visibility = "hidden";
        document.getElementById('prop-opacity').style.visibility = "hidden";
        document.getElementById('prop-position').style.visibility = "hidden";
        document.getElementById('prop-float').style.visibility = "hidden";
        document.getElementById('prop-binding').style.visibility = "hidden";
        document.getElementById('prop-color').style.visibility = "visible";
        document.getElementById('prop-border').style.visibility = "visible";
    } else if (document.getElementById(cur).tagName == "IMG") {
        document.getElementById('prop-name').style.visibility = "visible";
        document.getElementById('prop-height').style.visibility = "visible";
        document.getElementById('prop-width').style.visibility = "visible";
        document.getElementById('prop-display').style.visibility = "hidden";
        document.getElementById('prop-overflow').style.visibility = "hidden";
        document.getElementById('prop-class').style.visibility = "hidden";
        document.getElementById('prop-align').style.visibility = "hidden";
        document.getElementById('prop-padding').style.visibility = "visible";
        document.getElementById('prop-margin').style.visibility = "visible";
        document.getElementById('prop-holder').style.visibility = "hidden";
        document.getElementById('prop-text').style.visibility = "hidden";
        document.getElementById('prop-src').style.visibility = "hidden";
        document.getElementById('prop-background').style.visibility = "hidden";
        document.getElementById('prop-opacity').style.visibility = "hidden";
        document.getElementById('prop-position').style.visibility = "hidden";
        document.getElementById('prop-float').style.visibility = "hidden";
        document.getElementById('prop-binding').style.visibility = "hidden";
        document.getElementById('prop-color').style.visibility = "hidden";
        document.getElementById('prop-border').style.visibility = "visible";
    } else if (document.getElementById(cur).tagName == "MYDMS") {
        document.getElementById('prop-name').style.visibility = "visible";
        document.getElementById('prop-height').style.visibility = "hidden";
        document.getElementById('prop-width').style.visibility = "hidden";
        document.getElementById('prop-display').style.visibility = "hidden";
        document.getElementById('prop-overflow').style.visibility = "hidden";
        document.getElementById('prop-class').style.visibility = "hidden";
        document.getElementById('prop-align').style.visibility = "hidden";
        document.getElementById('prop-padding').style.visibility = "visible";
        document.getElementById('prop-margin').style.visibility = "visible";
        document.getElementById('prop-holder').style.visibility = "hidden";
        document.getElementById('prop-text').style.visibility = "hidden";
        document.getElementById('prop-src').style.visibility = "hidden";
        document.getElementById('prop-background').style.visibility = "hidden";
        document.getElementById('prop-opacity').style.visibility = "hidden";
        document.getElementById('prop-position').style.visibility = "hidden";
        document.getElementById('prop-float').style.visibility = "hidden";
        document.getElementById('prop-binding').style.visibility = "hidden";
        document.getElementById('prop-color').style.visibility = "hidden";
        document.getElementById('prop-border').style.visibility = "visible";
    } else if (document.getElementById(cur).tagName == "DIV") {
        document.getElementById('prop-name').style.visibility = "visible";
        document.getElementById('prop-height').style.visibility = "visible";
        document.getElementById('prop-width').style.visibility = "visible";
        document.getElementById('prop-display').style.visibility = "visible";
        document.getElementById('prop-overflow').style.visibility = "hidden";
        document.getElementById('prop-class').style.visibility = "visible";
        document.getElementById('prop-align').style.visibility = "hidden";
        document.getElementById('prop-padding').style.visibility = "visible";
        document.getElementById('prop-margin').style.visibility = "visible";
        document.getElementById('prop-holder').style.visibility = "hidden";
        document.getElementById('prop-text').style.visibility = "hidden";
        document.getElementById('prop-src').style.visibility = "hidden";
        document.getElementById('prop-background').style.visibility = "visible";
        document.getElementById('prop-opacity').style.visibility = "hidden";
        document.getElementById('prop-position').style.visibility = "hidden";
        document.getElementById('prop-float').style.visibility = "hidden";
        document.getElementById('prop-binding').style.visibility = "hidden";
        document.getElementById('prop-color').style.visibility = "visible";
        document.getElementById('prop-border').style.visibility = "visible";
    }

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
    document.getElementById(cur).setAttribute("name",ev.target.value);
    document.getElementById('right-section').innerHTML = "";
    checkForMe('main-section', 1, "none");

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
    ev.preventDefault();
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
               
                var doc = document.createElement("DIV");
                doc.id = ts;
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

                        if (typeof (schema[key].required) !== 'undefined' && schema[key].required == "true") {
                            newEl.required = true;
                        }


                        newEl.setAttribute("placeholder", key);
                        
                        doc.appendChild(newEl);

                    }
                    else if (schema[key].control == "radio") {
                        var ts = schema[key].options.split(",")
                        var alpha = document.createElement("DIV");

                        for (k in ts) {
                            var newDiv = document.createElement("LABEL");
                            newDiv.className = "radio-inline";
                            var newEl = document.createElement("INPUT");
                            newEl.type = "radio";
                            newEl.name = key;
                            newEl.value = k;

                            newDiv.appendChild(newEl);


                            newDiv.innerHTML += ts[k]
                           
                            alpha.appendChild(newDiv);


                        }

                        doc.appendChild(alpha);


                    }

                    else if (schema[key].control == "select") {
                        var ts = schema[key].options
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
                schemaStructure = objs[i].schemaStructure;
                for (key in objs[i].schemaStructure) {
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
    if (ev.target.id != "right-section" && ev.target.id != "displaymain-section" && String(ev.target.id).length != 0) {


        var txt;
        var r = confirm("Confirm deletion of the element?");
        if (r == true) {
            var tesmp = ev.target.id;

            tesmp = tesmp.replace("display", "")

            document.getElementById(tesmp).parentNode.removeChild(document.getElementById(tesmp));
            document.getElementById('right-section').innerHTML = "";
            checkForMe('main-section', 1, "none");
        } else {
        }
    }
});

var tempArr = [];

var parentMain = ""
checkForMe = (mainNode, count, parent) => {
    if (document.getElementById("right-section").innerHTML.length == 0) {
        var s3 = document.createElement("STRONG");
        s3.innerText = "Right click to delete an element"
        document.getElementById("right-section").appendChild(s3);

    }
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
            parent_name = document.getElementById(parent).getAttribute("name");
        }
        
        if (document.getElementById(parent) == undefined || (document.getElementById(parent) != undefined && document.getElementById(parent).tagName != "FORM" && document.getElementById(parent).tagName != "TABLE" && mainNode.indexOf("bt")==-1)) {
            tempArr.push({
                id: document.getElementById(mainNode).id,
                name: document.getElementById(mainNode).getAttribute("name"),
                tagName: document.getElementById(mainNode).tagName,
                parentId: parent,
                parentName: parent_name,
                class: document.getElementById(mainNode).className,
                height: document.getElementById(mainNode).style.height,
                width: document.getElementById(mainNode).style.width,
                display: document.getElementById(mainNode).style.display,
                overflow: document.getElementById(mainNode).style.overflow,
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

        
            if (parent == "none") {
                testArr[parent] = [];
            } else if (testArr[parent] != undefined) {
                testArr[parent].push(mainNode);
            }
            else {
                testArr[parent] = [];
            }
            if (parent != "main-section" && parent != "none") {
              
                var tempMargin = String(document.getElementById("display" + parent).style.marginLeft).substr(0, String(document.getElementById("display" + parent).style.marginLeft).indexOf("px"));
               

                temp.style.marginLeft = (Number(tempMargin) + 15) + "px";
            }
            else {
                temp.style.marginLeft = "0px"
            }
            temp.innerHTML = "";
            temp.innerHTML += document.getElementById(mainNode).tagName + "->" + document.getElementById(mainNode).getAttribute("name") + "<hr>";
            document.getElementById('right-section').appendChild(temp);
            
            mainNode = document.getElementById(mainNode);
            var nodes = mainNode.childNodes;
            var i = 0;

            while (nodes != undefined && i < nodes.length) {
                if (nodes[i].id != undefined && nodes[i].id != '') {
                    checkForMe(nodes[i].id, count + 1, parent_id);
                }
                i += 1;
            }
        }
      
    }
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

    if (document.getElementById('formName').value.length > 0) {


        document.getElementById('right-section').innerHTML = "";
        tempArr = [];
        checkForMe('main-section', 1, "none");



        var jsonBody = '{"name":"' + document.getElementById('formName').value + '","structure":' + JSON.stringify(tempArr) + '}';
        var objs23 = [];
        var duplicateObject = "";
        for (var fin = 0; fin < JSON.parse(jsonBody).structure.length; fin++) {
            

            if (JSON.parse(jsonBody).structure[fin].binding != null && JSON.parse(jsonBody).structure[fin].binding != "null") {
                for (var fin1 = 0; fin1 < objs23.length; fin1++) {
                    if (JSON.parse(jsonBody).structure[fin].binding.indexOf(objs23[fin1]) != -1) {
                        duplicateObject = JSON.parse(jsonBody).structure[fin].binding;
                        alert("same object cannot be bound with more than 1 element in the same form!");
                        break;
                    }
                }
                if (duplicateObject.length == 0) {
                    objs23.push(JSON.parse(jsonBody).structure[fin].binding)

                }
            }
            if (duplicateObject.length > 0) {
                break;
            }
        }

        if (duplicateObject.length > 0) {

        } else {

           
            if (jsonBody.indexOf("Submit") == -1 && 1 == 2) {
                alert("Submit button will be added by the system since the user has not added! And if reject is applicable, the same will also be added by the system");
            }
            if (formId != undefined && formId.length > 0) {
                fetch('/api/bpm/forms/' + formId, {
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

                })
            } else {
                fetch('/api/bpm/forms', {
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
                })
            }
        }


    } else {
        alert("Form Name is mandatory");
    }


})

document.getElementById('clearForm').addEventListener('click', (ev) => {



    document.getElementById('main-section').innerHTML = "";


    for (var i = 1; i < tempArr.length; i++) {
        var beta = document.createElement(tempArr[i].tagName);
        beta.id = tempArr[i].id;
        beta.setAttribute("name",tempArr[i].name);
        beta.className = tempArr[i].class;
        if (tempArr[i].tagName != "DIV" && tempArr[i].tagName != "FORM" && tempArr[i].tagName != "TABLE") beta.innerText = tempArr[i].text;
        beta.style.display = tempArr[i].display;
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

        if (tempArr[i].tagName == "FORM" || tempArr[i].tagName == "TABLE") {
            bindObject(beta.getAttribute('bind'), beta.id)
        }


    }
    document.getElementById('right-section').innerHTML = "";
    checkForMe('main-section', 1, "none");



 

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
        new_text.innerText = document.getElementById(ev.target.id).getAttribute("name");
        new_div.style.position = "absolute";
        new_div.style.float = "left";
        new_div.style.display = "flex";
        new_button1.innerText = "X";
        new_button2.innerText = "C";
        new_div.appendChild(new_button1);
        new_div.appendChild(new_button2);
        new_div.appendChild(new_text);
       
        if (hoverElement != "") {
            try {
                document.getElementById(hoverElement).removeChild(document.getElementById(divId));
            } catch (e) {

            }

        }
        if (document.getElementById(ev.target.id) != null) {
            hoverElement = ev.target.id;
            if (String(ev.target.id) != "main-section" && 1 == 2) {
                document.getElementById(ev.target.id).appendChild(new_div);
                document.getElementById("1_" + buttonId).addEventListener('click', (ev) => {
                    ev.preventDefault();
                    document.getElementById(hoverElement).parentNode.removeChild(document.getElementById(hoverElement))
                })
                document.getElementById("2_" + buttonId).addEventListener('click', (ev) => {
                    ev.preventDefault();
                    var copiedEl = document.getElementById(hoverElement);
                    clonedEl = copiedEl.cloneNode(true);
                    document.getElementById(hoverElement).parentNode.appendChild(clonedEl);
                })
            }
        }



    }
})





document.getElementById('left-section').addEventListener('click', (ev) => {
    
    if (document.getElementsByClassName("left-section")[0].className.indexOf("col-xs-1") != -1 && ev.target.id == "toggle") {
        document.getElementsByClassName("left-section")[0].className = String(document.getElementsByClassName("left-section")[0].className).replace("col-xs-1", "col-2");
        document.getElementsByClassName("main-section")[0].className = String(document.getElementsByClassName("main-section")[0].className).replace("col-xs-9", "col-8");
        document.getElementsByClassName("right-section")[0].className = String(document.getElementsByClassName("right-section")[0].className).replace("col-xs-2", "col-2");
        document.getElementById('test-c').className = String(document.getElementById('test-c').className).replace("col-12", "col-2");
        document.getElementById('toggle').innerText = "<";
        document.getElementById('left-hide-section').style.display = "block";
        document.getElementById('left-section').style.cursor = "";

    }
    else if (document.getElementsByClassName("left-section")[0].className.indexOf("col-2") != -1 && ev.target.id == "toggle") {
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