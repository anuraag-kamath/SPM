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
                row.innerHTML = "<td>" + (i + 1) + "</td><td class='editUsers' id=" + alpha[i]._id + " instanceId=" + alpha[i].instanceId + ">" + alpha[i]._id + "</td><td  class='editUsers'  id='" + alpha[i].instanceId + "'>" + alpha[i].instanceId + "</td><td>" + alpha[i].processName + "</td><td>" + alpha[i].stepName + "</td><td>" + alpha[i].status + "</td><td class='trigger' workitemId='" + alpha[i]._id + "'><a href='#" + alpha[i]._id + "'><h3><i class='far fa-play-circle'></i></h3></a></td>"

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
                //instanceIdLoader((i + 1) + "_" + alpha[i].processId);
                instanceIdLoader(alpha[i].instanceId, "workitem");
                document.getElementById(alpha[i]._id).addEventListener('click', (ev) => {
                    document.getElementById('workitemsDiv').style.height = "70%";
                    document.getElementById('workitemsDiv').style.overflow = "scroll";

                    document.getElementById('objectWorkitemDiv').style.height = "30%";
                    document.getElementById('objectWorkitemDiv').style.backgroundColor = "yellow";
                    document.getElementById('objectWorkitemDiv').style.overflow = "scroll";

                    fetch('/searchObjects/' + document.getElementById(ev.target.id).getAttribute('instanceId'), { credentials: "include" }).then((prom) => prom.text()).then((res) => {
                        document.getElementById("objectWorkitemDiv").innerHTML = "";
                        res = JSON.parse(res);
                        console.log(res);
                        if (res.length > 0) {
                            for (var i = 0; i < res.length; i++) {
                                document.getElementById("objectWorkitemDiv").innerHTML += "<h3>" + res[i].name + "</h3><table class='table' id='obj_" + i + "'></table>";
                            }
                            for (var i = 0; i < res.length; i++) {
                                addTable(res[i].name, res[i].id, i);
                            }
                        }
                        else {
                            document.getElementById("objectWorkitemDiv").innerHTML ="<h3>No Objects associated with this instance</h3>";

                        }
                    })
                });
            }
            removeLoadBar();
        } else {
            document.getElementById('noWorkitems').style.display = "block";
            document.getElementById('workitems').style.display = "none";
            removeLoadBar();

        }
    })


addTable = (name, id, tid) => {
    console.log("/" + name + "/" + id);
    fetch("/" + name + "/" + id, {
        credentials: "include"
    }).then((prom) => prom.text()).then((res3) => {
        res3 = JSON.parse(res3);
        console.log("#####");
        console.log(name);
        console.log(res3);
        var headers = Object.keys((res3[0][name][0]));
        console.log(headers)
        for (var k = 0; k < headers.length; k++) {
            var th = document.createElement("TH");
            th.innerText = headers[k];
            console.log(th);
            document.getElementById("obj_" + tid).appendChild(th)
        }
        console.log(res3[0][name].length);
        for (var m = 0; m < res3[0][name].length; m++) {
            var tr = document.createElement("TR");
            for (var n = 0; n < headers.length; n++) {
                var td = document.createElement("TD");
                td.innerText = res3[0][name][m][headers[n]];
                tr.appendChild(td)

            }
            document.getElementById("obj_" + tid).appendChild(tr);
        }
        console.log("#####");
    })
}