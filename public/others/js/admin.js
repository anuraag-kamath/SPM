
var selectedUser = "";

loadUsers = () => {
    document.getElementById('users').innerHTML = "";
    fetch('/user', {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        if (JSON.parse(res).length > 0) {
            document.getElementById("noUsers").style.display = "none";
        } else {
            document.getElementById("userTable").style.display = "none";
        }
        for (i in JSON.parse(res)) {
            var newRow = document.createElement("tr");
            newRow.innerHTML = "<td>" + JSON.parse(res)[i].user.username + "</td><td  id=roles" + JSON.parse(res)[i]._id + ">" + JSON.parse(res)[i].user.roles + "</td><td class='editUsers' id='edit_" + JSON.parse(res)[i]._id + "'>Edit</td>";
            document.getElementById('users').appendChild(newRow);
            document.getElementById("edit_" + JSON.parse(res)[i]._id).addEventListener('click', (ev) => {
                selectedUser = ev.target.id;

                var newDiv = document.createElement("DIV");
                document.getElementById('pop-up').style.display = "block"
                newDiv.style.height = "100px";
                newDiv.style.width = "100px";
                document.getElementById('pop-up').style.position = "absolute";
                newDiv.style.margin = "auto auto";
                newDiv.innerHTML = '<select id="roleSelector" class=selectpicker form-control multiple></select><button id="editRole" class="btn btn-primary">Edit Roles</button>'
                document.getElementById('pop-up').innerHTML = "";
                document.getElementById('pop-up').appendChild(newDiv);
                fetch('/roles', {
                    credentials: 'include'
                }).then((prom) => prom.text()).then((res1) => {
                    var options = "";
                    var wola = [
                        "workitems", "process", "listProcess",
                        "listObjects", "objectViewer", "objectBuilder"
                        , "listForms", "index", "header",
                        "formBuilder", "admin", "test"];

                    for (var i in JSON.parse(res1)) {
                        var newOption = document.createElement('option');
                        newOption.value = JSON.parse(res1)[i].roles[0].roleName
                        newOption.innerText = JSON.parse(res1)[i].roles[0].roleName;
                        if (document.getElementById(String(selectedUser).replace("edit_", "roles")).innerText.indexOf(newOption.innerText) != -1) {
                            newOption.selected = true;
                        }
                        document.getElementById('roleSelector').appendChild(newOption);
                    }
                });

                document.getElementById('editRole').addEventListener('click', (ev) => {
                    var roles = [];

                    for (var si = 0; si < document.getElementById("roleSelector").options.length; si++) {
                        if (document.getElementById("roleSelector").options[si].selected == true) {

                            roles.push('"' + document.getElementById("roleSelector").options[si].value + '"');
                        }
                    }
                    var jsonBody = '{"user":{"roles":[' + roles + '] }}'
                    fetch('/user/' + String(selectedUser).replace('edit_', ''), {
                        method: "PUT",
                        credentials: 'include',
                        headers: {
                            'content-type': 'application/json'

                        },
                        body: jsonBody
                    }).then((prom) => prom.text()).then((res) => {
                        loadUsers();
                    })
                    document.getElementById('app').style.display = "block";
                    document.getElementById('pop-up').style.display = "none";


                })
                document.getElementById('app').style.display = "none";


            })
        }
        //    document.getElementById('users')

    })
}
loadUsers();

document.getElementById('addUser').addEventListener('click', (ev) => {


    var newDiv = document.createElement("DIV");
    document.getElementById('pop-up').style.display = "block"
    newDiv.style.height = "100px";
    newDiv.style.width = "100px";
    document.getElementById('pop-up').style.position = "absolute";
    newDiv.style.margin = "auto auto";






    newDiv.innerHTML = '<input class="form-control" type="text" id="new_username"><input type="password" class="form-control" id="new_password"><button id="new_addUser" class="btn btn-primary">Add User</button>'


    document.getElementById('pop-up').innerHTML = "";
    document.getElementById('pop-up').appendChild(newDiv);
    document.getElementById('app').style.display = "none";



    document.getElementById('new_addUser').addEventListener('click', (ev) => {
        var jsonBody = '{"username":"' + document.getElementById('new_username').value + '","password":"' + document.getElementById('new_password').value + '"}'
        fetch('/register', {
            method: "POST",
            credentials: 'include',
            headers: {
                'content-type': 'application/json'

            },
            body: jsonBody
        }).then((prom) => prom.text()).then((res) => {
            loadUsers();
        })
        document.getElementById('app').style.display = "block";
        document.getElementById('pop-up').style.display = "none";


    })


})


