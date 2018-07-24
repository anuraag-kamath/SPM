
loadPage = (page, message) => {
    fetch('/' + page + '.html', {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
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
    if (location.hash == "#listWorkitems") {
        loadPage("workitems", "List of Workitems")
    }//else if(location.hash.indexOf("frm")!=-1){
    //     formLoad(location.hash.substr(4));
    // }
    else if (location.hash == "#listProcess") {
        loadPage("listProcess", "List of Processes");

    } else if (location.hash.indexOf("newpro") != -1) {
        loadPage("process", "Process Definition")
    } else if (location.hash.indexOf("frmbdr") != -1) {
        loadPage("formBuilder", "Form Builder");
    } else if (location.hash.indexOf("listForms") != -1) {
        loadPage("listForms", "List of Forms")
    } else if (location.hash.indexOf("listUsers") != -1) {
        loadPage("admin", "List of Users")
    } else if (location.hash.indexOf("objbdr") != -1) {
        loadPage("object-builder", "Object Builder");
    } else if (location.hash.indexOf("obj") != -1) {
        loadPage("objectViewer", "Object Viewer")
    } else if (location.hash.indexOf("listObjects") != -1) {
        loadPage("listObjects", "List of Objects")
    } else if (location.hash.indexOf("pro") != -1) {
        loadPage("process", "Process Definition")
    } else {

        loadPage("formViewer", "Form Viewer");
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