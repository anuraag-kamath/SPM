
listInstances = (searchParams) => {
    fetch('/api/bpm/instance?mode=listAll&' + searchParams, {
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
            res = JSON.parse(res);
            document.getElementById('instances-body').innerHTML = "";
            if (res.length > 0) {
                document.getElementById('noInstances').style.display = "none";
                document.getElementById('instances').style.display = "table";
            } else {
                document.getElementById('noInstances').style.display = "block";
                document.getElementById('instances').style.display = "none";

            }
            for (var i = 0; i < res.length; i++) {
                var alpha = "<tr>"
                alpha += '<td class="smallScreen">' + (i + 1) + '</td><td><u class="editUsers" id=' + res[i]._id+ ' style="cursor:pointer"  title="Click me to get to know the current status of the instance!">' + res[i]._id + '</u>'+"<div class='bigScreen'><hr>"+res[i].status+"</div>"+'</td><td class="smallScreen">' + res[i].processId + '</td><td  id=' + i + "_" + res[i].processId + '></td><td class="smallScreen">' + res[i].status + '</td><td class="smallScreen">' + res[i].user + '</td><td></td>'
                alpha += "</tr>"

                document.getElementById('instances-body').innerHTML += alpha;

                addProcessName(i + "_" + res[i].processId);

            }
            for (var i = 0; i < res.length; i++) {
                instanceIdLoader(res[i]._id, "workitem");

            }

            removeLoadBar();

        })

}

addProcessName = (id) => {
    console.log("***" + String(id).substr(2));
    fetch('/api/bpm/process?process=' + String(id).substr(String(id).indexOf("_") + 1), {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        console.log(res);
        document.getElementById(id).innerText = JSON.parse(res)[0].processName;
    })
}

listInstances("");

document.getElementById("searchParams").addEventListener("focusout",(ev)=>{
    console.log(ev.target.value);
    listInstances(ev.target.value)
});