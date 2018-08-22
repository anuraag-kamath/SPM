
var selectedUser = "";
var selectedUserAction = "";
loadUsers = () => {
    document.getElementById('users').innerHTML = "";
    fetch('/user', {
        credentials: 'include'
    }).then((prom) => prom.text()).then((res) => {
        if (JSON.parse(res).length > 0) {
            document.getElementById("noUsers").style.display = "none";
            document.getElementById("userTable").style.display = "block";
        } else {
            document.getElementById("noUsers").style.display = "block";
            document.getElementById("userTable").style.display = "none";
        }
        for (i in JSON.parse(res)) {
            var newRow = document.createElement("tr");
            var deactivate = false;
            var add = "";
            if (JSON.parse(res)[i].user.deactivated == true) {
                deactivate = true;
                add = "<td> <i  id='activate_" + JSON.parse(res)[i]._id + "' class='fas fa-toggle-off editUsers'></i>                </td>";

            } else {
                add = "<td> <i id='deactivate_" + JSON.parse(res)[i]._id + "' class='fas fa-toggle-on editUsers'></i>          </td>";

            }
            newRow.innerHTML = "<td>" + JSON.parse(res)[i].user.username + "</td><td  id=roles" + JSON.parse(res)[i]._id + " data-toggle='tooltip' title=" + JSON.parse(res)[i].user.roles + ">" + JSON.parse(res)[i].user.roles + "</td><td><i  id='edit_" + JSON.parse(res)[i]._id + "' class='fas fa-user-edit editUsers'></i></td>"
                + add
                + "<td><i id='delete_" + JSON.parse(res)[i]._id + "' class='fas fa-ban editUsers'></i>                </td>";
            document.getElementById('users').appendChild(newRow);

            document.getElementById("edit_" + JSON.parse(res)[i]._id).addEventListener('click', (ev) => {
                selectedUser = ev.target.id;

                var newDiv = document.createElement("DIV");
                document.getElementById('pop-up').style.display = "block"
                newDiv.style.height = "100px";
                newDiv.style.width = "100px";
                document.getElementById('pop-up').style.position = "absolute";
                newDiv.style.margin = "auto auto";
                newDiv.innerHTML = '<select id="roleSelector" class=selectpicker form-control multiple></select><div><button id="editRole" class="btn btn-primary"><i class="fas fa-edit"></i>                </button><button id="cancelRole" style="margin-left:30px" class="btn btn-primary"><i class="fas fa-times"></i>                </button></div>'
                document.getElementById('pop-up').innerHTML = "";
                document.getElementById('pop-up').appendChild(newDiv);
                document.getElementById('cancelRole').addEventListener('click', (ev) => {
                    popupClose();
                })
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
                    document.getElementById('app').style.opacity = "1";

                    document.getElementById('pop-up').style.display = "none";


                })
                document.getElementById('pop-up').style.position = "fixed";
                document.getElementById('pop-up').style.top = 0;
                document.getElementById('pop-up').style.left = 0;

                document.getElementById('app').style.opacity = "0.3";
                document.getElementById('pop-up').style.opacity = "1";



            })
            console.log(JSON.parse(res)[i].user.deactivated + "#" + deactivate);
            if (deactivate == true) {
                document.getElementById("activate_" + JSON.parse(res)[i]._id).addEventListener('click', (ev) => {
                    selectedUserAction = ev.target.id;

                    popUpConfirmBox("Activate User", "Cancel", "Are you sure you want to activate the user");
                    activateUser();

                    document.getElementById('rejectButton').addEventListener('click', (ev) => {
                        popupClose();
                    })

                })

            }
            else {
                document.getElementById("deactivate_" + JSON.parse(res)[i]._id).addEventListener('click', (ev) => {
                    selectedUserAction = ev.target.id;

                    popUpConfirmBox("Deactivate User", "Cancel", "Are you sure you want to deactivate the user");
                    deactivateUser();

                    document.getElementById('rejectButton').addEventListener('click', (ev) => {
                        popupClose();
                    })


                })

            }


            document.getElementById("delete_" + JSON.parse(res)[i]._id).addEventListener('click', (ev) => {

                selectedUserAction = ev.target.id;

                popUpConfirmBox("Delete User", "Cancel", "Are you sure you want to delete the user");
                deleteUser();

                document.getElementById('rejectButton').addEventListener('click', (ev) => {
                    popupClose();
                })


            })
        }
        removeLoadBar();
        //    document.getElementById('users')

    })
}
loadUsers();


deactivateUser = () => {
    document.getElementById('confirmButton').addEventListener('click', (ev1) => {
        fetch('/deactivateUser/' + String(selectedUserAction).replace("deactivate_", ""), {
            method: "POST",
            credentials: 'include'
        }).then((prom) => prom.text()).then((res) => {
            popupClose();

            loadUsers();
        })

    })
}

activateUser = () => {
    document.getElementById('confirmButton').addEventListener('click', (ev1) => {
        fetch('/activateUser/' + String(selectedUserAction).replace("activate_", ""), {
            method: "POST",
            credentials: 'include'
        }).then((prom) => prom.text()).then((res) => {
            popupClose();
            loadUsers();
        })

    })
}

deleteUser = () => {
    document.getElementById('confirmButton').addEventListener('click', (ev1) => {
        fetch('/deleteUser/' + String(selectedUserAction).replace("delete_", ""), {
            method: "DELETE",
            credentials: 'include'
        }).then((prom) => prom.text()).then((res) => {
            popupClose();

            loadUsers();
        })

    })
}

document.getElementById('addUser').addEventListener('click', (ev) => {


    var newDiv = document.createElement("DIV");
    document.getElementById('pop-up').style.display = "block"
    newDiv.style.height = "100px";
    newDiv.style.width = "400px";
    document.getElementById('pop-up').style.position = "absolute";
    newDiv.style.margin = "auto auto";






    newDiv.innerHTML = '<input class="form-control" type="text" id="new_email" type="email" placeholder="Email ID to invite"><button id="new_addUser" class="btn btn-primary">Add User</button><button id="cancel_addUser" style="float:right" class="btn btn-primary">Cancel</button><hr><div id="mess"></div>'


    document.getElementById('pop-up').innerHTML = "";
    document.getElementById('pop-up').appendChild(newDiv);
    document.getElementById('app').style.display = "none";



    document.getElementById('new_addUser').addEventListener('click', (ev) => {
        var jsonBody = '{"email":"' + document.getElementById('new_email').value + '"}'
        fetch('/register?channel=admin', {
            method: "POST",
            credentials: 'include',
            headers: {
                'content-type': 'application/json'

            },
            body: jsonBody
        }).then((prom) => prom.text()).then((res) => {
            var mess = JSON.parse(res).error;
            console.log(mess);
            if (mess.indexOf("OK")!=-1) {
                console.log("REC");
                document.getElementById('app').style.display = "block";
                document.getElementById('pop-up').style.display = "none";
                loadUsers();

            } else {
                document.getElementById('mess').innerText=mess;
            }
        })


    })

    document.getElementById('cancel_addUser').addEventListener('click', (ev) => {
        document.getElementById('app').style.display = "block";
        document.getElementById('pop-up').style.display = "none";

    });

})


