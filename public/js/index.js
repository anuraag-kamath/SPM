loggedInUser = "";


loadBar = () => {
    loadIt = true
    var elem = document.getElementById("loading");
    document.getElementById("loading").style.visibility = "visible"
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
        if (loadIt == false) {
            clearInterval(id);
        }
        if (width >= 100) {
            width = 1;
        } else {
            width++;

            elem.style.width = (width) + '%';
        }
    }
}

removeLoadBar = () => {
    loadIt = false;
    document.getElementById("loading").style.visibility = "hidden";
}


loadPage = (page, message, popUp) => {
    // if(page!="listObjects")
    loadBar();

    // render = (i) => {
    //     document.getElementById('loading').style.width = i + '%';

    // }

    // for (var i = 1; i <= 100; i++) {
    //     render(i);
    //     console.log(document.getElementById('loading').style.width);


    // }
    fetch('/' + page + '.html', {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        if (popUp == "Y") {

            document.getElementById('pop-up').innerHTML = "";
            var button = document.createElement("BUTTON");
            button.innerText = "CLOSE"
            button.className = "right"
            button.id = "closePop"

            document.getElementById('pop-up').appendChild(button);
            if (page == "process") {

                document.getElementById('pop-up').innerHTML += res;
                document.getElementById('left-menu-div').style.display = "none";
                document.getElementById('header').style.display = "none";
                document.getElementById('saveDiv').style.display = "none";
            }

            // if (document.getElementById('currentStyle') != undefined && document.getElementById('currentStyle') != "undefined") {
            //     document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentStyle"))
            //     document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentScript"))
            // }
            var link = document.createElement("link");
            if (page == "formViewer") {
                link.href = "css/formBuilder.css";

            }
            else {
                link.href = "css/" + page + ".css";

            }
            link.type = "text/css";
            link.rel = "stylesheet";
            link.id = "currentStylePopUp";

            document.getElementsByTagName("head")[0].appendChild(link);
            var script = document.createElement("script");
            script.src = "js/" + page + ".js";
            script.id = "currentScriptPopUp"
            document.getElementsByTagName("head")[0].appendChild(script);
            document.getElementById("pop-up").style.display = "block";
            document.getElementById("app").style.opacity = 0.4;
            document.getElementById("pop-up").style.position = "fixed";
            document.getElementById("pop-up").style.top = "50px";

            // document.getElementById("body_index").addEventListener('click', (ev) => {
            //     if (String(ev.target.className).indexOf("noclick") == -1) {
            //         document.getElementById("pop-up").style.display = "none";
            //         document.getElementById("app").style.opacity = 1;
            //         if (document.getElementById('currentStylePopUp') != undefined && document.getElementById('currentStylePopUp') != "undefined") {
            //             document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentStylePopUp"))
            //             document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentScriptPopUp"))
            //         }
            //     };
            // })

            document.getElementById("closePop").addEventListener('click', (ev) => {
                document.getElementById("pop-up").style.display = "none";
                document.getElementById("app").style.opacity = 1;
                if (document.getElementById('currentStylePopUp') != undefined && document.getElementById('currentStylePopUp') != "undefined") {
                    document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentStylePopUp"))
                    document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentScriptPopUp"))
                }

            })

        } else {

            document.getElementById('app').innerHTML = "";
            if(String(res).indexOf("not authorized")){
                removeLoadBar();
            }
            document.getElementById('app').innerHTML = res;
            document.getElementById('title').innerText = message;
            if (document.getElementById('currentStyle') != undefined && document.getElementById('currentStyle') != "undefined") {
                document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentStyle"))
                document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentScript"))
            }
            var link = document.createElement("link");
            if (page == "formViewer") {
                link.href = "css/formBuilder.css";

            }
            else {
                link.href = "css/" + page + ".css";

            }
            link.type = "text/css";
            link.rel = "stylesheet";
            link.id = "currentStyle";

            document.getElementsByTagName("head")[0].appendChild(link);

            // if (page == "listObjects" && document.getElementById('listObjectsScript') != undefined && document.getElementById('listObjectsScript') != "undefined") {

            // } else {
            //     if (document.getElementById('listObjectsScript') != undefined && document.getElementById('listObjectsScript') != "undefined") {
            //         document.getElementsByTagName("head")[0].removeChild(document.getElementById("listObjectsScript"))

            //     }
            var script = document.createElement("script");
            script.src = "js/" + page + ".js";
            script.id = "currentScript"
            console.log("#1");
            document.getElementsByTagName("head")[0].appendChild(script);
            console.log("#2");
            console.log("#3");


        }

    }).catch((err) => {
        console.log("ERRR");
    })
}

document.getElementById('logout').addEventListener('click', (ev) => {
    fetch('/api/uam/logout', {
        credentials: 'include',
        method: "POST"
    }).then((prom) => prom.text()).then((res) => {
        document.cookie
        document.location.href = '/login';
    })
})


hashCheck = () => {
    document.getElementById('app').style.display = "block";
    document.getElementById('pop-up').style.display = "none";

    document.getElementById("smallScreenOptions").style.display = "none";

    if (location.hash == "#listWorkitems" || location.hash == "#workitems") {
        loadPage("workitems", "List of Workitems", "N")
    }//else if(location.hash.indexOf("frm")!=-1){
    //     formLoad(location.hash.substr(4));
    // }
    else if (location.hash == "#listProcess") {
        loadPage("listProcess", "List of Processes", "N");

    } else if (location.hash.indexOf("newpro") != -1) {
        calledFrom = null
        processId = "";
        loadPage("process", "Process Definition", "N")
    } else if (location.hash.indexOf("frmbdr") != -1) {
        loadPage("formBuilder", "Form Builder", "N");
    } else if (location.hash.indexOf("listForms") != -1) {
        loadPage("listForms", "List of Forms", "N")
    } else if (location.hash.indexOf("listUsers") != -1) {
        loadPage("admin", "List of Users", "N")
    } else if (location.hash.indexOf("objbdr") != -1) {
        loadPage("object-builder", "Object Builder", "N");
    } else if (location.hash.indexOf("obj") != -1) {
        loadPage("objectViewer", "Object Viewer", "N")
    } else if (location.hash.indexOf("listObjects") != -1) {
        loadPage("listObjects", "List of Objects", "N")
    } else if (location.hash.indexOf("pro") != -1) {
        calledFrom = null
        processId = "";

        loadPage("process", "Process Definition", "N")
    } else if (location.hash.indexOf("listInstances") != -1) {
        loadPage("listInstances", "List of Instances", "N")
    }
    else {
        if (location.hash.indexOf("frm") == -1) {
            var wi_id = location.hash.substr(1);

            fetch('/api/bpm/workitems/' + wi_id + '?checkOpen=Y', {
                credentials: "include"
            }).then((prom) => prom.text()).then((res) => {

                if (JSON.parse(res).status != "OK") {
                    fetch('/api/uam/user/' + JSON.parse(res).user, {
                        credentials: "include"
                    }).then((prom) => prom.text()).then((user) => {
                        alert("Work item is already opened by " + JSON.parse(user).user);

                    })
                } else {
                    calledFrom = null;

                    loadPage("formViewer", "Form Viewer", "N");

                }
            })

        } else {
            calledFrom = null;
            loadPage("formViewer", "Form Viewer", "N");

        }

    }
}

// formPreview = (formId) => {
//     calledFrom = "formPreview"
//     formId = formId
//     console.log(formId+"##");
//     loadPage("formViewer", "Form Viewer", "Y");

// }

var onLoadLocationHash = window.location.hash;

if (onLoadLocationHash.length > 0) {
    hashCheck();
}
else {
    loadPage("workitems", "List of Workitems");
}

window.addEventListener("hashchange", (ev) => {
    document.getElementById('pop-up').innerHTML = "";
    hashCheck();

})

fetch('/api/uam/whoami', { credentials: 'include' }).then((prom) => prom.text()).then((res) => {
    document.getElementById('loggedinUser').innerText = JSON.parse(res).user;
    loggedInUser = JSON.parse(res).userId;
})



popUpConfirmBox = (confirmText, rejectText, paraText) => {
    document.getElementById('pop-up').innerHTML = "";
    document.getElementById('app').style.opacity = 0.3;
    document.getElementById('pop-up').style.display = "block";
    document.getElementById('pop-up').style.top = 0;
    document.getElementById('pop-up').style.left = 0;

    var popDiv = document.createElement("DIV");
    popDiv.style.height = "400px";
    popDiv.style.backgroundColor = "pink";

    popDiv.style.position = "fixed";
    popDiv.style.top = "20%";
    popDiv.style.margin = "auto";
    popDiv.style.left = "20%";
    /* left: 20%; */
    /* top: 20%; */
    popDiv.style.width = "50%";

    var button1 = document.createElement("BUTTON");
    var button2 = document.createElement("BUTTON");
    var para = document.createElement("P");
    button1.innerText = confirmText;
    button1.id = "confirmButton";
    button2.innerText = rejectText;
    button2.id = "rejectButton";
    button1.className = "btn btn-primary";
    button2.className = "btn btn-primary";
    para.innerText = paraText;
    button1.style.margin = "5px";
    button2.style.margin = "5px";
    popDiv.appendChild(para);
    popDiv.appendChild(button1);
    popDiv.appendChild(button2);
    popDiv.style.textAlign = "center";



    document.getElementById('pop-up').appendChild(popDiv);


}

popupClose = () => {
    document.getElementById('app').style.opacity = 1;
    document.getElementById('pop-up').style.display = "none";

}


document.getElementById('loggedinUser').addEventListener('click', (ev) => {
    var div = document.createElement("DIV");
    console.log(document.getElementById(ev.target.id).getBoundingClientRect());
    div.style.height = "30px";
    div.style.width = document.getElementById(ev.target.id).getBoundingClientRect().width * 4;
    div.style.backgroundColor = "pink";
    div.style.position = "fixed";

    div.id = "userOverlay";

    var input1 = document.createElement("INPUT");
    input1.type = "password";
    input1.id = "pwd1";
    input1.setAttribute("placeholder", "New Password")
    var input2 = document.createElement("INPUT");
    input2.type = "password";
    input2.id = "pwd2";
    input2.setAttribute("placeholder", "Confirm Password")

    var buttonChange = document.createElement("BUTTON");
    buttonChange.id = "changePwd";
    buttonChange.innerText = "Change Password"
    buttonChange.className = "btn btn-primary"


    div.style.top = document.getElementById(ev.target.id).getBoundingClientRect().y + document.getElementById(ev.target.id).getBoundingClientRect().height;

    div.style.left = document.getElementById(ev.target.id).getBoundingClientRect().x - document.getElementById(ev.target.id).getBoundingClientRect().width / 2;
    div.appendChild(input1);
    div.appendChild(input2);
    div.appendChild(buttonChange);
    document.getElementsByTagName("body")[0].appendChild(div);
    document.getElementById('changePwd').addEventListener('click', (ev) => {
        if (document.getElementById('pwd1').value.length > 0 && document.getElementById('pwd2').value.length > 0 && document.getElementById('pwd1').value == document.getElementById('pwd2').value) {
            var bodyJson = '{"newPassword": "' + document.getElementById('pwd1').value + '"}'
            console.log(bodyJson);
            fetch('/api/uam/user', {
                method: "PUT",
                credentials: "include",
                headers: {
                    "content-type": "application/json"
                },
                body: bodyJson
            }).then((prom) => prom.text()).then((res) => {
                alert("Next time login with the new password");
                document.getElementById('pwd1').value = "";
                document.getElementById('pwd2').value = "";
                document.getElementById("userOverlay").parentNode.removeChild(document.getElementById("userOverlay"));

            })
        } else {
            alert("Passwords should be greater than 0 characters!:) and should be same");
        }
    });
});

document.addEventListener('click', (ev) => {
    if (document.getElementById("userOverlay") != undefined && document.getElementById("userOverlay") !== 'undefined' && ev.target.id != "userOverlay" && ev.target.id != "loggedinUser"
        && ev.target.id != "pwd1" && ev.target.id != "pwd2" && ev.target.id != "changePwd") {

        document.getElementById("userOverlay").parentNode.removeChild(document.getElementById("userOverlay"));
    }
});



instanceIdLoader = (bindingId, calledFrom1) => {
    console.log("EVENT REGISTERED" + bindingId);
    console.log(document.getElementById(bindingId));
    document.getElementById(bindingId).addEventListener('click', (ev) => {
        console.log("CLICK");
        instanceId = ev.target.id;
        if (String(ev.target.id).indexOf("_") != -1) {
            instanceId = String(ev.target.id).substr(String(ev.target.id).indexOf("_") + 1)
        }
        console.log("I set" + instanceId);
        fetch('/api/bpm/instance/' + instanceId, {
            credentials: "include"
        }).then((prom) => prom.text()).then((proc) => {
            console.log(JSON.parse(proc).processId + "#" + calledFrom1);
            processId = JSON.parse(proc).processId;
            console.log("%%%" + processId);

            calledFrom = calledFrom1;
            console.log("****");
            console.log(calledFrom);
            console.log("****");
            loadPage("process", "Process Definition", "Y")

        })
    })
}


document.getElementById('smallScreenBurger').addEventListener('click', (ev) => {
    if (document.getElementById("smallScreenOptions").style.display == "none") {
        document.getElementById("smallScreenOptions").style.display = "block";

    } else {
        document.getElementById("smallScreenOptions").style.display = "none";

    }
});