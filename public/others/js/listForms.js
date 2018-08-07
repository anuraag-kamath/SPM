
fetch('/forms', {
    method: 'GET',
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    credentials:'include'
    
}).then(
    function (response) {
        return (response.text());
    }
).then(
    function (res) {
        ts = new Date().getTime();
        if (JSON.parse(res).length > 0) {
            document.getElementById("noForms").style.display="none";
            document.getElementById("forms").style.display="table";
            alpha = JSON.parse(res);
            for (var i = 0; i < alpha.length; i++) {
                var row = document.createElement("tr");

                row.innerHTML = "<td>" + (i + 1) + "</td><td>" + alpha[i].name + "</td><td><i id=edit_" + alpha[i]._id + " class='edit fas fa-edit'></i></td>"
                document.getElementById('form-body').appendChild(row);
                document.getElementById("edit_" + alpha[i]._id).addEventListener('click', (event) => {
                    window.location.hash="#frmbdr"+String(event.target.id).replace("edit_","");
                });
             
                
            }
        }
        else{
            document.getElementById("noForms").style.display="block";
            document.getElementById("forms").style.display="none";

        }
        removeLoadBar();

    })
