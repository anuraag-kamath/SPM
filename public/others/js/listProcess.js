fetch('/process', {
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
                row.innerHTML = "<td>" + (i + 1) + "</td><td>" + alpha[i].processName + "</td><td>" + alpha[i].steps.length + "</td><td id=live_" + alpha[i]._id + ">0</td><td id=finished_" + alpha[i]._id + ">0</td><td class='edit' id=" + alpha[i]._id + "><a href=#pro" + alpha[i]._id + "><h3><i class='edit fas fa-edit'></i></h3></a></td><td class='trigger'><a href=#frm" + alpha[i]._id + "$" + alpha[i].formName + "><h3><i class='far fa-play-circle'></i></h3></a></td>"
                getCount(alpha[i]._id);

                document.getElementById('processes-body').appendChild(row);
            }

        }else{
            document.getElementById('noProcesses').style.display = "block";
            document.getElementById('processes').style.display = "none";
            
        }

        removeLoadBar();
    })


getCount = (id) => {
    fetch('/instance?processId=' + id + '&status=initiated', { credentials: 'include' }).then((prom) => prom.text()).then((res) => {
        console.log(res);
        document.getElementById("live_" + id).innerText = JSON.parse(res).count;
    })
    fetch('/instance?processId=' + id + '&status=finished', { credentials: 'include' }).then((prom) => prom.text()).then((res) => {
        document.getElementById("finished_" + id).innerText = JSON.parse(res).count;
    })
}