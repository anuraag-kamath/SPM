document.getElementById('pop-up').style.display = "block";
document.getElementById('app').style.display = "none";
fetch('/api/bpm/workitems?search={"status":"scheduled"}', {
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
                if (alpha[i].escalationStatus == "done") {
                    row.style.backgroundColor = "red"
                    row.style.color = "white";
                }

                row.title = "Escalated on " + alpha[i].escalationDate
                var wi_status = alpha[i].status;

                if (alpha[i].currentStatus != undefined && alpha[i].currentStatus !== 'undefined' && alpha[i].currentStatus == "open") {
                    wi_status = alpha[i].currentStatus;
                    if (alpha[i].currentUser == loggedInUser) {
                        wi_status += " by you"
                    } else { 
                        wi_status += " by some other user"
                    }
                }
                row.innerHTML = "<td class='smallScreen'>" + (i + 1) + "</td><td><u  class='editUsers' id=" + alpha[i]._id + " instanceId=" + alpha[i].instanceId + "  title='Click me to get all the objects associated with the selected workitem and instance!'>" + alpha[i]._id + "</u><div class='bigScreen'><hr>"+alpha[i].processName+"-"+alpha[i].stepName+"-"+wi_status+"</div></td><td class='smallScreen'><u  class='editUsers'  id='" + alpha[i].instanceId + "' title='Click me to get to know the current status of the instance!'>" + alpha[i].instanceId + "</u></td><td class='smallScreen'>" + alpha[i].processName + "</td><td class='smallScreen'>" + alpha[i].stepName + "</td><td class='smallScreen'>" + wi_status + "</td><td class='smallScreen'>" + alpha[i].date + "</td><td class='trigger' workitemId='" + alpha[i]._id + "'><a href='#" + alpha[i]._id + "'><h3><i class='far fa-play-circle' style='margin-top:50%'></i></h3></a></td>"

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

                    fetch('/api/bpm/searchObjects/' + document.getElementById(ev.target.id).getAttribute('instanceId'), { credentials: "include" }).then((prom) => prom.text()).then((res) => {
                        document.getElementById("objectWorkitemDiv").innerHTML = "";
                        var closeObjectWorkitemDiv = document.createElement("BUTTON");
                        closeObjectWorkitemDiv.id = "closeObjectWorkitemDiv";
                        closeObjectWorkitemDiv.innerText = "X";
                        closeObjectWorkitemDiv.className = "right btn"
                        document.getElementById("objectWorkitemDiv").appendChild(closeObjectWorkitemDiv)


                        res = JSON.parse(res);
                        if (res.length > 0) {
                            for (var i = 0; i < res.length; i++) {
                                document.getElementById("objectWorkitemDiv").innerHTML += "<h3>" + res[i].name + "</h3><table class='table' id='obj_" + i + "'></table>";
                            }
                            for (var i = 0; i < res.length; i++) {
                                addTable(res[i].name, res[i].id, i);
                            }
                        }
                        else {
                            document.getElementById("objectWorkitemDiv").innerHTML = "<h3>No Objects associated with this instance</h3>";

                        }
                        document.getElementById("closeObjectWorkitemDiv").addEventListener('click', (ev) => {
                            document.getElementById('workitemsDiv').style.height = "100%";
                            document.getElementById('objectWorkitemDiv').style.height = "0%";

                        });
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
    fetch("/api/bpm/" + name + "/" + id, {
        credentials: "include"
    }).then((prom) => prom.text()).then((res3) => {
        res3 = JSON.parse(res3);
        var headers = Object.keys((res3[0][name][0]));
        for (var k = 1; k < headers.length; k++) {
            var th = document.createElement("TH");
            th.innerText = headers[k];
            document.getElementById("obj_" + tid).appendChild(th)
        }
        for (var m = 0; m < res3[0][name].length; m++) {
            var tr = document.createElement("TR");
            for (var n = 1; n < headers.length; n++) {
                var td = document.createElement("TD");
                td.innerText = res3[0][name][m][headers[n]];
                tr.appendChild(td)

            }
            document.getElementById("obj_" + tid).appendChild(tr);
            document.getElementById("obj_" + tid).className = "table"
        }
    })
}