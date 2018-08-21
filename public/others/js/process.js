var objects = [];


var sts = {};

fetch('/objects', {

    credentials: 'include'
}).then((prom) => prom.text()).then((res) => {
    //////console.log(res);
    objs = JSON.parse(res);
    document.getElementById('st-input').innerHTML = "";
    document.getElementById('st-output').innerHTML = "";
    document.getElementById('st-input').innerHTML += "<option value=''>INPUT</option>";
    document.getElementById('st-output').innerHTML += "<option value=''>OUTPUT</option>";
    for (var ob in JSON.parse(res)) {
        ////console.log(objs[ob].schemaName);
        document.getElementById('st-input').innerHTML += "<option value='" + objs[ob].schemaName + "'>" + objs[ob].schemaName + "</option>";
        document.getElementById('st-output').innerHTML += "<option value='" + objs[ob].schemaName + "'>" + objs[ob].schemaName + "</option>";
    }

})



// document.addEventListener('click', (event) => {
//     if (!(event.target.classList.contains("noclick"))) {
//         console.log("PROCEED");
//     }
// })

// if (typeof (calledFrom) === "undefined" || calledFrom != "workitem") {
//     document.getElementById('title').innerText = "";
//     var h4 = document.createElement("P");
//     var inputName = document.createElement("INPUT");
//     h4.id = "heading"; 
//     inputName.id = "heading-text";




//     document.getElementById("title").appendChild(h4);
//     document.getElementById("title").appendChild(inputName);
//     var trigSel = document.createElement("SELECT");
//     h4Trig.id = "h4Trig";
//     trigSel.id = "triggeringForm";

//     document.getElementById("heading").appendChild(trigSel);

//     // document.getElementById("title").appendChild(h4Trig);
//     // document.getElementById("title").appendChild(trigSel);

// }

var steps = [];

checkme = (processId) => {
    console.log(processId)

    if (processId != undefined) {

        document.getElementById('left-menu-div').style.display = "none";
        document.getElementById('header').style.display = "none";
        document.getElementById('saveDiv').style.display = "none";

        fetch('/process?process=' + processId, {
            method: "GET",
            credentials: 'include'
        }).then((prom) => {
            return prom.text();
        }).then((response) => {
            console.log(response);
            steps = JSON.parse(response)[0].steps;
            for (var i = 0; i < steps.length; i++) {
                step1 = steps[i].step1 || "";
                step2 = steps[i].step2 || "";
                lbl1 = steps[i].lbl1 || "";
                lbl2 = steps[i].lbl2 || "";
                frm1 = steps[i].frm1 || "";
                frm2 = steps[i].frm2 || "";
                part1 = steps[i].part1 || "";
                part2 = steps[i].part2 || "";
                console.log(steps[i]);
                days1 = steps[i].days1 || 0;
                days2 = steps[i].days2 || 0;
                minutes1 = steps[i].minutes1 || 0;
                minutes2 = steps[i].minutes2 || 0;
                hours1 = steps[i].hours1 || 0;
                hours2 = steps[i].hours2 || 0;
                url1 = steps[i].url1 || "";
                method1 = steps[i].method1 || "";
                headers1 = steps[i].headers1 || "[]";
                queryParams1 = steps[i].queryParams1 || "[]";
                input1 = steps[i].input1 || "";
                output1 = steps[i].output1 || "";
                url2 = steps[i].url2 || "";
                method2 = steps[i].method2 || "";
                headers2 = steps[i].headers2 || "[]";
                queryParams2 = steps[i].queryParams2 || "[]";
                input2 = steps[i].input2 || "";
                output2 = steps[i].output2 || "";
                addProcess(step1, step2, lbl1, lbl2, frm1, frm2, part1, part2, steps[i]._id, days1, hours1, minutes1, days2, hours2, minutes2, url1, method1, headers1, queryParams1, input1, output1, url2, method2, headers2, queryParams2, input2, output2)

            }
            recalcCount();

            document.getElementById('heading').innerText = JSON.parse(response)[0].processName;

            fetch('/forms?fields=name', {
                method: "GET",
                credentials: 'include'
            }).then((prom) => {
                return prom.text();
            }).then((response1) => {
                document.getElementById("triggeringForm").innerHTML = "";
                forms = JSON.parse(response1);
                for (res in forms) {
                    var selected = "";
                    if (forms[res]._id == JSON.parse(response)[0].formName) {
                        selected = "selected";
                    }

                    document.getElementById("triggeringForm").innerHTML += "<option value='" + forms[res]._id + "' " + selected + ">" + forms[res].name + "</option>";
                }



            });
            console.log(processId);


            if (typeof (calledFrom) !== 'undefined' && calledFrom == "workitem") {

                document.getElementById('mid-section-process').style.height = "100%";

                document.getElementById('left-menu-div').style.display = "none";
                document.getElementById('header').style.display = "none";
                document.getElementById('saveDiv').style.display = "none";

                console.log("AAA");

                var deletes = document.getElementsByName("delete1");
                console.log(deletes);
                for (var i = 0; i < deletes.length; i++) {
                    console.log(deletes[i]);
                    document.getElementById(deletes[i].id).style.display = "none";
                }
                document.getElementById('process-section').className = "col-12";

                console.log("@@@");
                console.log(steps);
                console.log("@@@");
                var sendSteps = '';
                for (var i = 0; i < steps.length; i++) {
                    sendSteps += '"' + steps[i]._id + '"';
                    if (i != steps.length - 1) {
                        sendSteps += ",";
                    }
                }

                fetch('/workitems?searchStep=' + sendSteps + '&instanceId=' + instanceId, {
                    credentials: 'include'
                }).then((prom) => prom.text()).then((res) => {
                    console.log(res);
                    var res = JSON.parse(res);
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].status == "scheduled") {
                            console.log(res[i]);
                            if (document.getElementById('lbl1_' + res[i].stepId) != undefined &&
                                document.getElementById('lbl1_' + res[i].stepId).innerText == res[i].stepName) {
                                document.getElementById('lbl1_' + res[i].stepId).style.backgroundColor = "orange";

                            } if (document.getElementById('lbl2_' + res[i].stepId) != undefined &&
                                document.getElementById('lbl2_' + res[i].stepId).innerText == res[i].stepName) {
                                document.getElementById('lbl2_' + res[i].stepId).style.backgroundColor = "orange";

                            }

                        }
                        if (res[i].status == "finished") {
                            if (document.getElementById('lbl1_' + res[i].stepId) != undefined &&
                                document.getElementById('lbl1_' + res[i].stepId).innerText == res[i].stepName) {
                                document.getElementById('lbl1_' + res[i].stepId).style.backgroundColor = "green";
                                document.getElementById('lbl1_' + res[i].stepId).style.color = "white";

                                console.log(res[i].user);
                                console.log(res[i]);
                                document.getElementById('lbl1_' + res[i].stepId).innerText += " -done by:" + res[i].user + " @ " + res[i].date;

                            } if (document.getElementById('lbl2_' + res[i].stepId) != undefined &&
                                document.getElementById('lbl2_' + res[i].stepId).innerText == res[i].stepName) {
                                document.getElementById('lbl2_' + res[i].stepId).style.backgroundColor = "green";
                                document.getElementById('lbl2_' + res[i].stepId).style.color = "white";

                                document.getElementById('lbl2_' + res[i].stepId).innerText += " -done by:" + res[i].user + " @ " + res[i].date;


                            }

                        }
                    }
                })



            }else{
                document.getElementById('left-menu-div').style.display = "block";
                document.getElementById('header').style.display = "block";
                document.getElementById('saveDiv').style.display = "block";
            }
            removeLoadBar();

        });

    }


    fetch('/objects?fields=schemaName', {
        method: "GET",
        credentials: 'include'
    }).then((prom) => {
        return prom.text();
    }).then((response) => {

        objs = JSON.parse(response);
        objects = objs;



    });




    fetch('/forms', {

        credentials: 'include'
    }).then((prom) => prom.text()).then((docs) => {
        document.getElementById("formName").innerHTML += "<option value=''></option>";
        for (doc in JSON.parse(docs)) {

            document.getElementById("formName").innerHTML += "<option value='" + JSON.parse(docs)[doc]._id + "'>" + JSON.parse(docs)[doc].name + "</option>";
            document.getElementById("triggeringForm").innerHTML += "<option value='" + JSON.parse(docs)[doc]._id + "' >" + JSON.parse(docs)[doc].name + "</option>";

        }
    })


    fetch('/roles?mode=participants', {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res1) => {
        var options = "";
        console.log("***");
        console.log(res1);
        console.log("***");
        for (var i in JSON.parse(res1)) {
            var newOption = document.createElement('option');
            newOption.value = JSON.parse(res1)[i].roles[0].roleName;
            newOption.innerText = JSON.parse(res1)[i].roles[0].roleName;
            document.getElementById('participant').appendChild(newOption);
        }
    });



}

// selectRejection = (count) => {
//     // document.getElementById("rejectionDropDown").innerHTML = "";
//     // document.getElementById("rejectionDropDown").innerHTML += '<option></option>';

//     nodes = document.getElementById("process-section").childNodes;
//     for (var i = 1; i < count; i++) {
//         id = nodes[i].id.replace("div_", "");
//         lbl1 = document.getElementById('lbl1_' + id).innerText;
//         // document.getElementById("rejectionDropDown").innerHTML += '<option>' + lbl1 + '</option>';
//         lbl2 = "";
//         if (document.getElementById('step2_' + id) != null) {
//             lbl2 = document.getElementById('lbl2_' + id).innerText;
//             // document.getElementById("rejectionDropDown").innerHTML += '<option>' + lbl2 + '</option>';
//         }

//     }


// }

document.getElementById('formName').addEventListener('focusout', (event) => {
    document.getElementById(currentElement).setAttribute('formName', event.target.value);


});

document.getElementById('participant').addEventListener('focusout', (event) => {
    console.log(currentElement);
    console.log(event.target.value)
    document.getElementById(currentElement).setAttribute('participant', event.target.value);


});

document.getElementById('escalation-days').addEventListener('focusout', (event) => {
    console.log(currentElement);
    console.log(event.target.value)
    var esc = document.getElementById('escalation-days').value + "#" + document.getElementById('escalation-hours').value + "#" + document.getElementById('escalation-minutes').value
    document.getElementById(currentElement).setAttribute('esc', esc);


});
document.getElementById('escalation-minutes').addEventListener('focusout', (event) => {
    console.log(currentElement);
    console.log(event.target.value)
    var esc = document.getElementById('escalation-days').value + "#" + document.getElementById('escalation-hours').value + "#" + document.getElementById('escalation-minutes').value
    document.getElementById(currentElement).setAttribute('esc', esc);


});
document.getElementById('escalation-hours').addEventListener('focusout', (event) => {
    console.log(currentElement);
    console.log(event.target.value)
    var esc = document.getElementById('escalation-days').value + "#" + document.getElementById('escalation-hours').value + "#" + document.getElementById('escalation-minutes').value
    document.getElementById(currentElement).setAttribute('esc', esc);


});


document.getElementById('heading').addEventListener('click', (event) => {
    if (event.target.tagName != "FORM") {
        document.getElementById('heading-text').value = document.getElementById('heading').innerText;
        document.getElementById('heading-text').style.display = "block"
        document.getElementById('heading').style.display = "none"
        document.getElementById('heading-text').focus();
        document.getElementById('heading-text').style.margin = "auto"
    }


});

document.getElementById('heading-text').addEventListener('focusout', (event) => {
    document.getElementById('heading').style.display = "block"
    document.getElementById('heading').innerText = document.getElementById('heading-text').value
    document.getElementById('heading-text').style.display = "none"
});


document.getElementById('myForm').addEventListener('submit', (event) => {
    event.preventDefault();
    step1 = document.getElementById('step-name1').value;
    t1 = document.getElementById('type-task1').value;
    t2 = ""
    step2 = ""
    if ((document.getElementById("step-name2") != null)) {
        step2 = document.getElementById('step-name2').value;
        t2 = document.getElementById('type-task2').value;

    }
    console.log(t1 + "#" + t2 + "#" + step1 + "#" + step2);
    // if (String(t1).indexOf("Service") != -1 && String(t2).indexOf("Service") != -1) {
    //     alert("Kindly delete System task, it is currently under progress!!:)");
    // } else {
    //     addProcess(t1, t2, step1, step2, '', '', '', '', '', 0, 0, 0, 0, 0, 0);


    // }
    addProcess(t1, t2, step1, step2, '', '', '', '', '', 0, 0, 0, 0, 0, 0, "", "", "[]", "[]", "", "", "", "", "[]", "[]", "", "");


    recalcCount();

});

drag = (event) => {
    event.preventDefault();
}

drop = (event) => {
    event.preventDefault();
    var data = event.dataTransfer.getData("mov");
    event.target.appendChild(document.getElementById(data));
}

dragStart = (event) => {
    event.preventDefault();
    event.dataTransfer.setData("mov", event.target.id);
}
dragover = (event) => {
    event.preventDefault();
}

var addProcess = (step1, step2, t1, t2, frm1, frm2, part1, part2, stepId, days1, hours1, minutes1, days2, hours2, minutes2, url1, method1, headers1, queryParams1, input1, output1, url2, method2, headers2, queryParams2, input2, output2) => {
    console.log("@@@@@@");
    console.log(days1);
    console.log(hours1);
    console.log(minutes1);
    console.log(days2);
    console.log(hours2);
    console.log(minutes2);
    console.log(headers1);
    console.log(headers2);
    console.log("@@@@@@");
    var ts = "";
    if (stepId.length > 0) {
        ts = stepId;
    } else {
        ts = Math.ceil(new Date().getTime() * Math.random());
    }
    if (step1.length > 0 && step2.length > 0) {
        var newDiv = document.createElement("DIV");
        //newDiv.draggable = true;
        // newDiv.ondragstart = "dragStart(event)";
        // newDiv.drag = "drag(event)";
        newDiv.id = "div_" + ts;
        if (step1.indexOf("Service") != -1) {
            if (headers1.length == 0) {
                headers1 = "[]"
            } else {
                headers1 = JSON.stringify(headers1)
            }
            if (queryParams1.length == 0) {
                queryParams1 = "[]"
            } else {
                queryParams1 = JSON.stringify(queryParams1)
            }
            sts["lbl1_" + ts] = '{"url": "' + url1 + '","method": "' + method1 + '","headers": ' + headers1 + ',"queryParams": ' + queryParams1 + ',"input": "' + input1 + '","output":"' + output1 + '" }'
        }
        if (step2.indexOf("Service") != -1) {
            if (headers2 != undefined && headers2.length == 0) {
                headers2 = "[]"
            } else {
                headers2 = JSON.stringify(headers2)
            }
            if (queryParams2 != undefined && queryParams2.length == 0) {
                queryParams2 = "[]"
            } else {
                queryParams2 = JSON.stringify(queryParams2)
            }
            sts["lbl2_" + ts] = '{"url": "' + url2 + '","method": "' + method2 + '","headers": ' + headers2 + ',"queryParams": ' + queryParams2 + ',"input": "' + input2 + '","output":"' + output2 + '" }'

        }
        newDiv.className = "row";
        var countDiv = document.createElement("DIV");
        countDiv.id = "count_" + ts;
        countDiv.className = "col-1 ctr"
        //countDiv.innerHTML = "<h3 id='count'>2</h3>"
        var leftDiv = document.createElement("DIV");
        leftDiv.className = "col-5"
        console.log(days1 + "#" + hours1 + "#" + minutes1);
        console.log(days2 + "#" + hours2 + "#" + minutes2);
        var esc1 = days1 + "#" + hours1 + "#" + minutes1;
        leftDiv.innerHTML = "<h6 id='step1_" + ts + "' >" + step1 + "</h6><label formName='" + frm1 + "' participant='" + part1 + "' esc=" + esc1 + " id='lbl1_" + ts + "' class='lbl noclick'>" + t1 + "</label>"
        var rightDiv = document.createElement("DIV");
        rightDiv.className = "col-5";
        var esc2 = days2 + "#" + hours2 + "#" + minutes2;
        rightDiv.innerHTML = "<h6 id='step2_" + ts + "' >" + step2 + "</h6><label formName='" + frm2 + "' participant='" + part2 + "' esc=" + esc2 + " id='lbl2_" + ts + "' class='lbl noclick'>" + t2 + "</label>"
        var cancelDiv = document.createElement("DIV");
        cancelDiv.className = "col-1 ctr"
        cancelDiv.innerHTML = '<h4 class="noclick" id="delete1_' + ts + '" name="delete1">X</h4>';
        newDiv.appendChild(countDiv);
        newDiv.appendChild(leftDiv);
        newDiv.appendChild(rightDiv);
        newDiv.appendChild(cancelDiv);
        document.getElementById('process-section').appendChild(newDiv);
        if (typeof (calledFrom) !== 'undefined' && calledFrom == "workitem") { } else {

            document.getElementById(('lbl2_' + ts)).addEventListener('click', (event) => {

                console.log('APPLIED EVENT FOR lbl2_' + ts);
                //selectRejection(document.getElementById(String(event.target.id).replace("lbl2_", "count_")).innerText);

                // document.getElementById('formName').value = document.getElementById(event.target.id).getAttribute('formName');
                // document.getElementById('participant').value = document.getElementById(event.target.id).getAttribute('participant');
                // var esc = document.getElementById(event.target.id).getAttribute('esc').split("#");
                // document.getElementById('escalation-days').value = esc[0];
                // document.getElementById('escalation-hours').value = esc[1];
                // document.getElementById('escalation-minutes').value = esc[2];

                // if (currentElement != "") {
                //     document.getElementById(currentElement).style.border = "2px solid black";
                //     document.getElementById(event.target.id).style.border = "2px solid red";
                //     document.getElementById('name').value = event.target.innerText;
                //     currentElement = event.target.id;
                //     document.getElementsByTagName('footer')[0].style.display = "block";
                //     document.getElementsByClassName('mid-section')[0].style.height = "60vh";

                // }

                var tempText = document.getElementById(String(event.target.id).replace("lbl2_", "step2_")).innerText;
                if (document.getElementById(currentElement) != undefined && currentElement != "") {
                    document.getElementById(currentElement).style.border = "2px solid black";

                }

                document.getElementById(event.target.id).style.border = "2px solid red";
                document.getElementById('name').value = event.target.innerText;
                currentElement = event.target.id;
                document.getElementsByTagName('footer')[0].style.display = "block";
                document.getElementsByClassName('mid-section')[0].style.height = "50vh";
                if (String(tempText).indexOf("Human Task") != -1) {
                    document.getElementById('formName').value = document.getElementById(event.target.id).getAttribute('formName');
                    document.getElementById('participant').value = document.getElementById(event.target.id).getAttribute('participant');
                    var esc = document.getElementById(event.target.id).getAttribute('esc').split("#");
                    document.getElementById('escalation-days').value = esc[0];
                    document.getElementById('escalation-hours').value = esc[1];
                    document.getElementById('escalation-minutes').value = esc[2];

                    document.getElementById('participant_div').style.display = "flex";
                    document.getElementById('escalation_div').style.display = "flex";
                    document.getElementById('st-sample').style.display = "block";
                    document.getElementById('form_div').style.display = "flex";
                    document.getElementById('st_act').style.display = "none";

                } else {
                    document.getElementById("st-headers").innerHTML = "";
                    document.getElementById("st-queryParams").innerHTML = "";
                    document.getElementById("st-url").value = "";

                    document.getElementById("st-method").value = "";
                    document.getElementById("st-input").value = "";
                    document.getElementById("st-output").value = "";


                    document.getElementById('participant_div').style.display = "none";
                    document.getElementById('escalation_div').style.display = "none";
                    document.getElementById('st-sample').style.display = "none";

                    document.getElementById('form_div').style.display = "none";
                    document.getElementById('st_act').style.display = "block";

                    console.log("##");
                    console.log(sts[currentElement]);

                    if (sts[currentElement] != undefined) {
                        console.log(sts[currentElement]);
                        var cur = JSON.parse(sts[currentElement])

                        document.getElementById('st-url').value = cur.url;
                        document.getElementById('st-method').value = cur.method;
                        var headers = [];
                        var queryParams = [];
                        document.getElementById('st-input').value = cur.input;
                        document.getElementById('st-output').value = cur.output;
                        console.log(currentElement);
                        for (var i = 0; i < cur.headers.length; i++) {
                            console.log("##");
                            console.log(cur.headers[i].split("#"));
                            console.log("#");
                            addHeader(cur.headers[i].split("#")[0], cur.headers[i].split("#")[1])
                        }
                        for (var i = 0; i < cur.queryParams.length; i++) {
                            console.log("##");
                            console.log(cur.queryParams[i].split("#"));
                            console.log("#");
                            addQueryParams(cur.queryParams[i].split("#")[0], cur.queryParams[i].split("#")[1])
                        }

                    }


                }


            });
        }


    } else {
        var newDiv = document.createElement("DIV");
        //newDiv.draggable = true;
        // newDiv.ondragstart = "dragStart(event)";
        // newDiv.drag = "drag(event)";
        console.log("@");
        if (step1.indexOf("Service") != -1) {
            if (headers1.length == 0) {
                headers1 = "[]"
            } else {
                headers1 = JSON.stringify(headers1)
            }
            if (queryParams1.length == 0) {
                queryParams1 = "[]"
            } else {
                queryParams1 = JSON.stringify(queryParams1)
            }
            sts["lbl1_" + ts] = '{"url": "' + url1 + '","method": "' + method1 + '","headers": ' + headers1 + ',"queryParams": ' + queryParams1 + ',"input": "' + input1 + '","output":"' + output1 + '" }'
        }
        console.log("@");

        newDiv.id = "div_" + ts;
        newDiv.className = "row";
        var countDiv = document.createElement("DIV");
        countDiv.id = "count_" + ts;
        countDiv.className = "col-1 ctr"
        countDiv.innerHTML = "<h3 id='count'>2</h3>"
        var leftDiv = document.createElement("DIV");
        leftDiv.className = "col-2"
        var rightDiv = document.createElement("DIV");
        rightDiv.className = "col-2"
        var midDiv = document.createElement("DIV");
        midDiv.className = "col-6";
        var esc1 = days1 + "#" + hours1 + "#" + minutes1;
        midDiv.innerHTML = "<h6 id='step1_" + ts + "' >" + step1 + "</h6><label formName='" + frm1 + "'  participant='" + part1 + "' esc=" + esc1 + " id='lbl1_" + ts + "' class='lbl noclick'>" + t1 + "</label>"
        var cancelDiv = document.createElement("DIV");
        cancelDiv.className = "col-1 ctr"
        cancelDiv.innerHTML = '<h4 class="noclick" id="delete1_' + ts + '" name="delete1">X</h4>';
        newDiv.appendChild(countDiv);
        newDiv.appendChild(leftDiv);
        newDiv.appendChild(midDiv);
        newDiv.appendChild(rightDiv);
        newDiv.appendChild(cancelDiv);
        document.getElementById('process-section').appendChild(newDiv);

    }

    if (typeof (calledFrom) !== 'undefined' && calledFrom == "workitem") { } else {
        document.getElementById(('lbl1_' + ts)).addEventListener('click', (event) => {
            console.log('APPLIED EVENT FOR lbl1_' + ts);

            //selectRejection(document.getElementById(String(event.target.id).replace("lbl1_", "count_")).innerText);
            tempText = document.getElementById(String(event.target.id).replace("lbl1_", "step1_")).innerText;
            if (document.getElementById(currentElement) != undefined && currentElement != "") {
                document.getElementById(currentElement).style.border = "2px solid black";

            }
            document.getElementById(event.target.id).style.border = "2px solid red";
            document.getElementById('name').value = event.target.innerText;
            currentElement = event.target.id;
            document.getElementsByTagName('footer')[0].style.display = "block";
            document.getElementsByClassName('mid-section')[0].style.height = "50vh";

            if (String(tempText).indexOf("Human Task") != -1) {
                document.getElementById('formName').value = document.getElementById(event.target.id).getAttribute('formName');
                document.getElementById('participant').value = document.getElementById(event.target.id).getAttribute('participant');
                var esc = document.getElementById(event.target.id).getAttribute('esc').split("#");
                document.getElementById('escalation-days').value = esc[0];
                document.getElementById('escalation-hours').value = esc[1];
                document.getElementById('escalation-minutes').value = esc[2];

                document.getElementById('participant_div').style.display = "flex";
                document.getElementById('escalation_div').style.display = "flex";
                document.getElementById('form_div').style.display = "flex";
                document.getElementById('st_act').style.display = "none";

            } else {
                document.getElementById("st-headers").innerHTML = "";
                document.getElementById("st-queryParams").innerHTML = "";
                document.getElementById("st-url").value = "";
                document.getElementById("st-method").value = "";
                document.getElementById("st-input").value = "";
                document.getElementById("st-output").value = "";


                document.getElementById('participant_div').style.display = "none";
                document.getElementById('escalation_div').style.display = "none";
                document.getElementById('form_div').style.display = "none";
                document.getElementById('st_act').style.display = "block";

                console.log("##");
                console.log(sts[currentElement]);

                if (sts[currentElement] != undefined) {
                    console.log(currentElement);
                    var cur = JSON.parse(sts[currentElement])

                    document.getElementById('st-url').value = cur.url;
                    document.getElementById('st-method').value = cur.method;
                    var headers = [];
                    var queryParams = [];
                    document.getElementById('st-input').value = cur.input;
                    document.getElementById('st-output').value = cur.output;
                    console.log(currentElement);
                    for (var i = 0; i < cur.headers.length; i++) {
                        console.log("##");
                        console.log(cur.headers[i].split("#"));
                        console.log("#");
                        addHeader(cur.headers[i].split("#")[0], cur.headers[i].split("#")[1])
                    }
                    for (var i = 0; i < cur.queryParams.length; i++) {
                        console.log("##");
                        console.log(cur.queryParams[i].split("#"));
                        console.log("#");
                        addQueryParams(cur.queryParams[i].split("#")[0], cur.queryParams[i].split("#")[1])
                    }

                }


            }



        });
    }




    document.getElementById("delete1_" + ts).addEventListener('click', (event) => {
        console.log(document.getElementById(String(event.target.id).replace("delete1", "count")).innerText);
        // if (document.getElementById(String(event.target.id).replace("delete1", "count")).innerText != 1) {
        var child = event.target.parentElement.parentElement;
        var parent = event.target.parentElement.parentElement.parentElement;
        parent.removeChild(child);
        recalcCount();

        // }else{
        //     alert("cannot delete the first step!");
        // }

    });

}


var currentElement = "";


recalcCount = () => {
    var nodes = document.getElementById("process-section").childNodes;

    for (var i = 1; i < nodes.length; i++) {
        var count_div = nodes[i].id;
        count_div = String(count_div).replace("div_", "count_");
        console.log("COUNTING" + count_div);

        document.getElementById(count_div).innerHTML = "<h3>" + (i) + "</h3>";
    }
}

check = () => {
    return "true";
}


document.getElementById('newStep').addEventListener('click', (event) => {

    var row = document.createElement('DIV');
    row.className = "row";
    var col1 = document.createElement('DIV');
    col1.className = "col-6";
    col1.innerHTML = '<input type="text" id="step-name2" class="form-control" placeholder="step-name" required>'
    row.appendChild(col1);
    var col2 = document.createElement('DIV');
    col2.className = "col-5";
    col2.innerHTML = '<select name="type-task2" id="type-task2" class="form-control"><option value="Human Task" selected="selected">Human Task</option><option value="Service Task">Service Task</option></select>';
    row.appendChild(col2);
    var col3 = document.createElement('DIV');
    col3.className = "col-1";
    col3.innerHTML = '<h4 id="delete" class="noclick">X</h4>';
    row.appendChild(col3);

    document.getElementById("left-menu").appendChild(row);
    document.getElementById("left-menu").appendChild(document.getElementById("addStep-row"));
    document.getElementById('delete').addEventListener('click', (event) => {
        var child = event.target.parentElement.parentElement;
        var parent = event.target.parentElement.parentElement.parentElement;
        parent.removeChild(child);
        document.getElementById("newStep").style.visibility = "visible";

    })

    if (document.getElementById("left-menu").childElementCount > 2) {
        document.getElementById("newStep").style.visibility = "hidden";
    }
})

document.getElementById("save-process").addEventListener('click', (event) => {
    nodes = document.getElementById("process-section").childNodes;
    var json = '{"formName":"' + document.getElementById('triggeringForm').value + '","processName":"' + document.getElementById('heading').innerText + '","steps":';
    json += "[";
    var err = "";
    var errEl = "";
    for (var i = 1; i < nodes.length; i++) {
        id = String(nodes[i].id).replace('div_', '');
        step1 = document.getElementById('step1_' + id).innerText;
        lbl1 = document.getElementById('lbl1_' + id).innerText;
        frm1 = document.getElementById('lbl1_' + id).getAttribute('formName');
        part1 = document.getElementById('lbl1_' + id).getAttribute('participant');
        days1 = document.getElementById('lbl1_' + id).getAttribute('esc').split("#")[0];
        hours1 = document.getElementById('lbl1_' + id).getAttribute('esc').split("#")[1];
        minutes1 = document.getElementById('lbl1_' + id).getAttribute('esc').split("#")[2];

        url1 = '""';
        method1 = '""';
        headers1 = "[]";
        queryParams1 = "[]";
        input1 = '""';
        output1 = '""';


        if (step1.indexOf("Service") != -1) {
            url1 = '"' + JSON.parse(sts['lbl1_' + id]).url + '"';
            method1 = '"' + JSON.parse(sts['lbl1_' + id]).method + '"';
            headers1 = JSON.parse(sts['lbl1_' + id]).headers;
            if (headers1.length == 0) {
                headers1 = "[]";
            } else {
                headers1 = "[" + headers1 + "]"
            }
            queryParams1 = JSON.parse(sts['lbl1_' + id]).queryParams;
            if (queryParams1.length == 0) {
                queryParams1 = "[]";
            } else {
                queryParams1 = "[" + queryParams1 + "]"
            }
            input1 = '"' + JSON.parse(sts['lbl1_' + id]).input + '"';
            if (input1.length == 0) {
                input1 = '""';
            }
            output1 = '"' + JSON.parse(sts['lbl1_' + id]).output + '"';
            if (output1.length == 0) {
                output1 = '""';
            }
        }


        step2 = "";
        json += '{"step1":"' + step1 + '","lbl1":"' + lbl1 + '","frm1":"' + frm1 + '","part1":"' + part1 + '"' + ',"days1":' + days1 + ',"hours1":' + hours1 + ',"minutes1":' + minutes1 + ',"method1":' + method1 + ',"url1":' + url1 + ',"headers1":' + headers1 + ',"queryParams1":' + queryParams1 + ',"input1":' + input1 + ',"output1":' + output1;
        if (step1.indexOf("Service") == -1 && (step1.length == 0 ||
            lbl1.length == 0 ||
            frm1.length == 0 ||
            part1.length == 0)) {
            console.log(step1);
            console.log(step1.indexOf("System") == -1);
            err = "problem found, focussing on the problem!";
            errEl = "lbl1_" + id;
            break;
        } else if (step1.indexOf("Service") != -1 && (step1.length == 0 ||
            url1.length == 0 ||
            method1.length == 0)) {
            console.log(url1.length);
            console.log(method1.length);

            err = "problem found, focussing on the problem!";
            errEl = "lbl1_" + id;
            break;
        }
        if (document.getElementById('step2_' + id) != null) {
            step2 = document.getElementById('step2_' + id).innerText;
            lbl2 = document.getElementById('lbl2_' + id).innerText;
            frm2 = document.getElementById('lbl2_' + id).getAttribute('formName');
            part2 = document.getElementById('lbl2_' + id).getAttribute('participant');
            days2 = document.getElementById('lbl2_' + id).getAttribute('esc').split("#")[0];
            hours2 = document.getElementById('lbl2_' + id).getAttribute('esc').split("#")[1];
            minutes2 = document.getElementById('lbl2_' + id).getAttribute('esc').split("#")[2];

            url2 = '""';
            method2 = '""';
            headers2 = "[]";
            queryParams2 = "[]";
            input2 = '""';
            output2 = '""';




            if (step2.indexOf("Service") != -1) {
                console.log(JSON.parse(sts['lbl2_' + id]));
                url2 = '"' + JSON.parse(sts['lbl2_' + id]).url + '"';
                method2 = '"' + JSON.parse(sts['lbl2_' + id]).method + '"';
                headers2 = JSON.parse(sts['lbl2_' + id]).headers;
                if (headers2.length == 0) {
                    headers2 = "[]";
                } else {
                    headers2 = "[" + headers2 + "]"
                }
                queryParams2 = JSON.parse(sts['lbl2_' + id]).queryParams;
                if (queryParams2.length == 0) {
                    queryParams2 = "[]";
                } else {
                    queryParams2 = "[" + queryParams2 + "]"
                }
                input2 = '"' + JSON.parse(sts['lbl2_' + id]).input + '"';
                if (input2.length == 0) {
                    input2 = '""';
                }
                output2 = '"' + JSON.parse(sts['lbl2_' + id]).output + '"';
                if (output2.length == 0) {
                    output2 = '""';
                }



            }

            json += ',"step2":"' + step2 + '","lbl2":"' + lbl2 + '","frm2":"' + frm2 + '","part2":"' + part2 + '"' + ',"days2":' + days2 + ',"hours2":' + hours2 + ',"minutes2":' + minutes2 + ',"method2":' + method2 + ',"url2":' + url2 + ',"headers2":' + headers2 + ',"queryParams2":' + queryParams2 + ',"input2":' + input2 + ',"output2":' + output2;
            if (step2.indexOf("Service") == -1 && (step2.length == 0 ||
                lbl2.length == 0 ||
                frm2.length == 0 ||
                part2.length == 0)) {
                err = "problem found, focussing on the problem!";
                errEl = "lbl2_" + id;
                break;
            } else if (step2.indexOf("Service") != -1 && (step2.length == 0 ||
                url2.length == 0 ||
                method2.length == 0)) {
                err = "problem found, focussing on the problem!";
                errEl = "lbl2_" + id;
                break;
            }

        }
        if (i == nodes.length - 1) {
            json += "}"
        } else {

            json += "},"
        }
    }
    console.log(err + "##" + err.length);
    if (err.length > 0) {
        console.log("GOT IN");
        document.getElementById("pop-up").innerHTML = "";


        var newDiv = document.createElement("DIV");
        newDiv.style.height = "200px";
        newDiv.style.width = "500px";
        document.getElementById('pop-up').style.position = "fixed";
        document.getElementById('pop-up').style.top = 0;
        document.getElementById('pop-up').style.left = 0;
        newDiv.style.margin = "auto auto";

        newDiv.style.marginTop = "10%";
        newDiv.style.backgroundColor = "aqua";
        var text = document.createElement('H1');
        text.innerText = err;
        newDiv.appendChild(text)
        //    document.getElementById("app").style.display = "none";
        document.getElementById("app").style.opacity = 0.3;
        document.getElementById("pop-up").style.display = "block";
        document.getElementById("pop-up").appendChild(newDiv);
        setTimeout(() => {
            document.getElementById("app").style.opacity = 1;
            document.getElementById("pop-up").style.display = "none";

        }, 2000)
        document.getElementById(errEl).click();

    } else {
        var tempArr = []
        json += ']}'
        console.log(json);
        if (typeof (processId) !== 'undefined' && processId != undefined && processId.length > 0) {
            fetch('/process/' + processId, {
                method: "PUT",
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
                body: json
            }).then((prom) => {
                return prom.text();
            }).then((res) => {
                window.location.hash = "listProcess"
            })
        } else {
            fetch('/process', {
                method: "POST",
                headers: {
                    'content-type': 'application/json'
                },
                credentials: 'include',
                body: json
            }).then((prom) => {
                return prom.text();
            }).then((res) => {
                window.location.hash = "listProcess"


            })
        }


    }


});



document.getElementById('name').addEventListener(('focusout'), (event) => {

    document.getElementById(currentElement).innerText = event.target.value;
});

// document.getElementById('toggle-down').addEventListener(('click'), (event) => {
//     document.getElementsByTagName('footer')[0].style.display = "none";
//     document.getElementsByClassName('mid-section')[0].style.height = "80vh";
// });




if (location.hash != undefined && location.hash.length > 0 && location.hash != "#newpro") {
    //processId = location.hash.substr(4);
    if (typeof (processId) !== 'undefined' && processId != null && processId.length > 0) {

        checkme(processId);
    } else {
        processId = location.hash.substr(4);
        checkme(processId);


    }
} else {

    if (typeof (processId) !== 'undefined' && processId != null && processId.length > 0) {
        checkme(processId);
    } else {

        checkme();
    }
    removeLoadBar();

}


document.getElementById('addHeader').addEventListener('click', (ev) => {
    addHeader("", "");

});

addHeader = (left, right) => {
    console.log("####" + left + "###" + right);
    ts = Math.ceil(new Date().getTime() * Math.random());

    var div = document.createElement("DIV");
    div.id = "div_" + ts;
    var inpLeft = document.createElement("INPUT");
    inpLeft.id = "inpLeft_" + ts;
    inpLeft.style.width = "40%";
    inpLeft.value = left;
    var inpRight = document.createElement("INPUT");
    inpRight.id = "inpRight_" + ts;
    inpRight.style.width = "40%";
    inpRight.value = right;
    var button = document.createElement("BUTTON");
    button.id = "btn_" + ts;
    button.innerText = "X";
    div.appendChild(inpLeft);
    div.appendChild(inpRight);
    div.appendChild(button);
    document.getElementById("st-headers").appendChild(div);
    document.getElementById(inpLeft.id).focus();


    document.getElementById('btn_' + ts).addEventListener('click', (ev) => {
        document.getElementById(String(ev.target.id).replace('btn', 'div')).parentNode.removeChild(document.getElementById(String(ev.target.id).replace('btn', 'div')));
    })

}

document.getElementById('addQueryParam').addEventListener('click', (ev) => {
    addQueryParams("", "")

});

addQueryParams = (left, right) => {
    ts = Math.ceil(new Date().getTime() * Math.random());

    var div = document.createElement("DIV");
    div.id = "div_" + ts;
    var inpLeft = document.createElement("INPUT");
    inpLeft.id = "inpLeft_" + ts;
    inpLeft.style.width = "40%";
    inpLeft.value = left;
    var inpRight = document.createElement("INPUT");
    inpRight.id = "inpRight_" + ts;
    inpRight.style.width = "40%";
    inpRight.value = right;
    var button = document.createElement("BUTTON");
    button.id = "btn_" + ts;
    button.innerText = "X";
    div.appendChild(inpLeft);
    div.appendChild(inpRight);
    div.appendChild(button);
    document.getElementById("st-queryParams").appendChild(div);
    document.getElementById(inpLeft.id).focus();

    document.getElementById('btn_' + ts).addEventListener('click', (ev) => {
        document.getElementById(String(ev.target.id).replace('btn', 'div')).parentNode.removeChild(document.getElementById(String(ev.target.id).replace('btn', 'div')));
    })

}

document.getElementById('st-save').addEventListener('click', (ev) => {
    saveSt(currentElement);
});


document.getElementById('st-method').addEventListener('change', (ev) => {
    if (ev.target.value == "GET" || ev.target.value == "DELETE") {

        document.getElementById('st-input').value = "";
        //        document.getElementById('st-input').disabled=true;
    } else {
        //        document.getElementById('st-input').disabled=false;
    }
});

saveSt = (currentElement) => {
    var url = document.getElementById('st-url');
    var method = document.getElementById('st-method');
    var headers = [];
    var queryParams = [];
    var input = document.getElementById('st-input').value;
    var output = document.getElementById('st-output').value;

    var st_headers = document.getElementById('st-headers').childNodes;
    var st_queryParams = document.getElementById('st-queryParams').childNodes;

    for (var i = 0; i < st_headers.length; i++) {
        console.log(st_headers[i]);
        if (st_headers[i].id != undefined) {
            var leftInp = st_headers[i].id.replace("div", "inpLeft")
            var rightInp = st_headers[i].id.replace("div", "inpRight")
            leftInp = document.getElementById(leftInp).value;
            rightInp = document.getElementById(rightInp).value;
            headers.push('\"' + leftInp + "#" + rightInp + '\"');
        }
        console.log(leftInp);
        console.log(rightInp);

    }
    for (var i = 0; i < st_queryParams.length; i++) {
        console.log(st_queryParams[i]);
        if (st_queryParams[i].id != undefined) {
            var leftInp = st_queryParams[i].id.replace("div", "inpLeft")
            var rightInp = st_queryParams[i].id.replace("div", "inpRight")
            leftInp = document.getElementById(leftInp).value;
            rightInp = document.getElementById(rightInp).value;
            queryParams.push('"' + leftInp + "#" + rightInp + '"');
        }
        console.log(leftInp);
        console.log(rightInp);
    }
    if (headers.length == 0) {
        headers = "[]"
    } else {
        headers = JSON.stringify(headers)
        //headers = '[' + headers + ']'
    }
    if (queryParams.length == 0) {
        queryParams = "[]"
    } else {
        queryParams = JSON.stringify(queryParams)
        //queryParams = '[' + queryParams + ']'
    }
    var jsonBuildup = '{"' + currentElement + '": {"url": "' + document.getElementById('st-url').value + '","method": "' + document.getElementById('st-method').value + '","headers": ' + headers + ',"queryParams": ' + queryParams + ',"input": "' + document.getElementById('st-input').value + '","output":"' + document.getElementById('st-output').value + '" }}'

    console.log(jsonBuildup);
    sts[currentElement] = '{"url": "' + document.getElementById('st-url').value + '","method": "' + document.getElementById('st-method').value + '","headers": ' + headers + ',"queryParams": ' + queryParams + ',"input": "' + document.getElementById('st-input').value + '","output":"' + document.getElementById('st-output').value + '" }'

    console.log(jsonBuildup);

}


document.getElementById("tryOut").addEventListener('click', (ev) => {
    st(sts[currentElement]);
});


st = (cur) => {
    cur = JSON.parse(cur);
    var sampleInput = document.getElementById("sampleInput").value;
    console.log(cur.method);
    fetch(cur.url, {
        method: cur.method,
        headers: {

            "content-type": "application/json"
        }
    }).then((prom) => prom.json()).then((res) => {
        document.getElementById("sampleOutput").value = JSON.stringify(res)
    })

}