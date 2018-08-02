fetch('/objects?mode=show', {
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
        if (JSON.parse(res).length > 0) {
            document.getElementById('noObjects').style.display = "none";
            document.getElementById('objects').style.display = "table";
            alpha = JSON.parse(res);
            for (var i = 0; i < alpha.length; i++) {
                var row = document.createElement("tr");

                row.innerHTML = "<td>" + (i + 1) + "</td><td>" + alpha[i].schemaName + "</td><td>" + "N/A" + "</td><td id=show_" + alpha[i]._id + ">Show</td><td class='edit' id=edit_" + alpha[i]._id + ">Edit</td><td class='delete' id=delete_" + alpha[i]._id + ">Delete</td>"
                document.getElementById('objects-body').appendChild(row);
                document.getElementById("show_" + alpha[i]._id).addEventListener('click', (event) => {
                    window.location.hash = "#obj" + String(event.target.id).replace("show_", "");
                });
                document.getElementById("edit_" + alpha[i]._id).addEventListener('click', (event) => {
                    window.location.hash = "objbdr" + String(event.target.id).replace("edit_", "")
                });
                document.getElementById("delete_" + alpha[i]._id).addEventListener('click', (event) => {
                    fetch('/objects/' + event.target.id.replace('delete_', ''), {
                        method: "DELETE",
                        credentials: 'include'
                    });
                    window.location.reload();
                });
            }
        }
    })

