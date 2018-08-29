listObjects = () => {
    fetch('/api/bpm/objects?mode=show', {
        method: 'GET',
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

                    row.innerHTML = "<td class='smallScreen'>" + (i + 1) + "</td><td>" + alpha[i].schemaName + "</td><td class='smallScreen'>" + "N/A" + "</td><td><i  id=show_" + alpha[i]._id + " class='far fa-eye'></i></td><td class='smallScreen'><i id=edit_" + alpha[i]._id + " class='edit fas fa-edit'></i></td><td style='display:none' class='delete smallScreen'><i id=delete_" + alpha[i]._id + " class='fas fa-ban editUsers'></td>"
                    document.getElementById('objects-body').appendChild(row);
                    document.getElementById("show_" + alpha[i]._id).addEventListener('click', (event) => {
                        window.location.hash = "#obj" + String(event.target.id).replace("show_", "");
                    });
                    document.getElementById("edit_" + alpha[i]._id).addEventListener('click', (event) => {
                        window.location.hash = "objbdr" + String(event.target.id).replace("edit_", "")
                    });
                    document.getElementById("delete_" + alpha[i]._id).addEventListener('click', (event) => {
                        fetch('/api/bpm/objects/' + event.target.id.replace('delete_', ''), {
                            method: "DELETE",
                            credentials: 'include'
                        });
                        window.location.reload();
                    });
                }
            }
            else {
                document.getElementById('noObjects').style.display = "block";
                document.getElementById('objects').style.display = "none";

            }
            removeLoadBar();
        })

}

listObjects();