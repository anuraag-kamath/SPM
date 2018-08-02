loadPage = (page, message, popUp) => {
    fetch('/' + page + '.html', {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        if (popUp == "Y") {

            document.getElementById('pop-up').innerHTML = "";
            document.getElementById('pop-up').innerHTML = res;
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

            document.addEventListener('click', (ev) => {
                if (String(ev.target.className).indexOf("noclick") == -1) {
                    document.getElementById("pop-up").style.display = "none";
                    document.getElementById("app").style.opacity = 1;
                    if (document.getElementById('currentStylePopUp') != undefined && document.getElementById('currentStylePopUp') != "undefined") {
                        document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentStylePopUp"))
                        document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentScriptPopUp"))
                    }
                };
            })

        } else {
            document.getElementById('app').innerHTML = "";
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
            var script = document.createElement("script");
            script.src = "js/" + page + ".js";
            script.id = "currentScript"
            document.getElementsByTagName("head")[0].appendChild(script);

        }
    })
}

document.getElementById('logout').addEventListener('click', (ev) => {
    fetch('/logout', {
        credentials: 'include',
        method: "POST"
    }).then((prom) => prom.text()).then((res) => {
        document.cookie
        document.location.href = '/login';
    })
})


hashCheck = () => {
    if (location.hash == "#listWorkitems" || location.hash == "#workitems") {
        loadPage("workitems", "List of Workitems", "N")
    }//else if(location.hash.indexOf("frm")!=-1){
    //     formLoad(location.hash.substr(4));
    // }
    else if (location.hash == "#listProcess") {
        loadPage("listProcess", "List of Processes", "N");

    } else if (location.hash.indexOf("newpro") != -1) {
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
        loadPage("process", "Process Definition", "N")
    } else {

        loadPage("formViewer", "Form Viewer", "N");
    }
}

var onLoadLocationHash = window.location.hash;

if (onLoadLocationHash.length > 0) {
    hashCheck();
}
else {
    loadPage("workitems", "List of Workitems");
}

window.addEventListener("hashchange", (ev) => {
    hashCheck();

})

fetch('/whoami', { credentials: 'include' }).then((prom) => prom.text()).then((res) => {
    document.getElementById('loggedinUser').innerText = JSON.parse(res).user;
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