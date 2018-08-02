document.getElementById('pop-up').style.display = "block";
document.getElementById('app').style.display = "none";
fetch('/workitems?search={"status":"scheduled"}', {
    method: 'GET',
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    credentials: 'include'
}).then(
    function (response) {
        return (response.text());
    }
).then(
    function (res) {
        ts = new Date().getTime();
        document.getElementById('pop-up').style.display = "none";
        document.getElementById('app').style.display = "block";

        if (JSON.parse(res).length > 0) {
            document.getElementById('noWorkitems').style.display = "none";
            document.getElementById('workitems').style.display = "table";
            alpha = JSON.parse(res);
            for (var i = 0; i < alpha.length; i++) {
                var row = document.createElement("tr");
                row.innerHTML = "<td>" + (i + 1) + "</td><td class='editUsers' id="+(i+1)+"_" + alpha[i].processId + " instanceId="+alpha[i].instanceId+">" + alpha[i]._id + "</td><td>" + alpha[i].instanceId + "</td><td>"+alpha[i].processName+"</td><td>" + alpha[i].stepName + "</td><td>" + alpha[i].status + "</td><td class='trigger' workitemId='" + alpha[i]._id + "'><a href='#" + alpha[i]._id + "'>Trigger</a></td>"

                // {


                //     loadPage = (page, message) => {
                //         fetch('/' + page + '.html', {
                //             credentials: 'include'
                //         }).then((prom) => prom.text()).then((res) => {
                //             document.getElementById('app').innerHTML = "";
                //             document.getElementById('app').innerHTML = res;
                //             document.getElementById('title').innerText = message;
                //             if (document.getElementById('currentStyle') != undefined && document.getElementById('currentStyle') != "undefined") {
                //                 document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentStyle"))
                //                 document.getElementsByTagName("head")[0].removeChild(document.getElementById("currentScript"))
                //             }
                //             var link = document.createElement("link");
                //             if (page == "formViewer") {
                //                 link.href = "css/formBuilder.css";

                //             }
                //             else {
                //                 link.href = "css/" + page + ".css";

                //             }
                //             link.type = "text/css";
                //             link.rel = "stylesheet";
                //             link.id = "currentStyle";

                //             document.getElementsByTagName("head")[0].appendChild(link);
                //             var script = document.createElement("script");
                //             script.src = "js/" + page + ".js";
                //             script.id = "currentScript"
                //             document.getElementsByTagName("head")[0].appendChild(script);
                //         })
                //     }
                //}
                document.getElementById('workitems-body').appendChild(row);
                document.getElementById((i+1)+"_"+alpha[i].processId).addEventListener('click', (ev) => {
                    instanceId=document.getElementById(ev.target.id).getAttribute("instanceId");
                    processId=String(ev.target.id).substr(String(ev.target.id).indexOf("_")+1);
                    
                    calledFrom="workitem";
                   loadPage("process", "Process Definition", "Y")
                })

            }
        }
    })