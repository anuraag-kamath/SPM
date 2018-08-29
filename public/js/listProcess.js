

listProcess = () => {
    document.getElementById('processes-body').innerHTML="";
    fetch('/api/bpm/process', {
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
            ts = Math.ceil(new Date().getTime() * Math.random());
            if (JSON.parse(res).length > 0) {
                console.log(res);
                document.getElementById('noProcesses').style.display = "none";
                document.getElementById('processes').style.display = "table";
                alpha = JSON.parse(res);
                for (var i = 0; i < alpha.length; i++) {
                    var row = document.createElement("tr");
                    row.innerHTML = "<td class='smallScreen'>" + (i + 1) + "</td><td>" + alpha[i].processName + "</td><td class='smallScreen'>" + alpha[i].steps.length + "</td><td class='smallScreen' id=live_" + alpha[i]._id + ">0</td><td class='smallScreen' id=finished_" + alpha[i]._id + ">0</td><td class='edit smallScreen' id=" + alpha[i]._id + "><a href=#pro" + alpha[i]._id + "><h3><i class='edit fas fa-edit'></i></h3></a></td><td class='trigger'><a href=#frm" + alpha[i]._id + "$" + alpha[i].formName + "><h3><i class='far fa-play-circle'></i></h3></a></td><td class='trigger smallScreen'><h3><i  id=delete_" + alpha[i]._id + " class='fas fa-ban editUsers'></i></h3></td>"
                    getCount(alpha[i]._id);

                    document.getElementById('processes-body').appendChild(row);

                    document.getElementById("delete_" + alpha[i]._id).addEventListener("click", (ev) => {
                        console.log(ev.target.id);
                        fetch('/api/bpm/instance?searchProcess=' + String(ev.target.id).replace("delete_", "")).then((prom) => prom.text()).then((res) => {
                            console.log(res);
                            if (JSON.parse(res).length > 0) {
                                alert("The form cannot be deleted as it is being used in "+JSON.parse(res).length+" live instaces");
                            }
                            else {
                                popUpConfirmBox("Delete", "Cancel", "Sure you want to delete the process?");

                                processId = String(ev.target.id).replace("delete_", "")

                                document.getElementById('confirmButton').addEventListener('click', (ev) => {

                                    fetch('/api/bpm/process/' + processId, {
                                        method: "DELETE",
                                        credentials: "include"
                                    }).then((prom) => prom.text()).then((res) => {
                                        listProcess();
                                        popupClose();

                                    })
                                });
                                document.getElementById('rejectButton').addEventListener('click', (ev) => {

                                    popupClose();
                                });

                            }
                        });
                    });
                }
            } else {
                document.getElementById('noProcesses').style.display = "block";
                document.getElementById('processes').style.display = "none";

            }

            removeLoadBar();
        })

}
getCount = (id) => {
    fetch('/api/bpm/instance?processId=' + id + '&status=initiated', { credentials: 'include' }).then((prom) => prom.text()).then((res) => {
        console.log(res);
        document.getElementById("live_" + id).innerText = JSON.parse(res).count;
    })
    fetch('/api/bpm/instance?processId=' + id + '&status=finished', { credentials: 'include' }).then((prom) => prom.text()).then((res) => {
        document.getElementById("finished_" + id).innerText = JSON.parse(res).count;
    })
}


listProcess();