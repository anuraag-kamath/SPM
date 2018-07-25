document.getElementById('pop-up').style.display = "block";
document.getElementById('app').style.display = "none";
fetch('http://localhost:3000/workitems?search={"status":"scheduled"}', {
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
                row.innerHTML = "<td>" + (i + 1) + "</td><td>" + alpha[i]._id + "</td><td>" + alpha[i].instanceId + "</td><td id="+alpha[i].instanceId+"></td><td>" + alpha[i].stepName + "</td><td>" + alpha[i].status + "</td><td class='trigger' workitemId='" + alpha[i]._id + "'><a href='#" + alpha[i]._id + "'>Trigger</a></td>"
                document.getElementById('workitems-body').appendChild(row);
                
            }
        }
    })