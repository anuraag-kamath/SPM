
listForms = () => {

    document.getElementById('form-body').innerHTML = "";

    fetch('/forms', {
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
                document.getElementById("noForms").style.display = "none";
                document.getElementById("forms").style.display = "table";
                alpha = JSON.parse(res);
                for (var i = 0; i < alpha.length; i++) {
                    var row = document.createElement("tr");

                    row.innerHTML = "<td>" + (i + 1) + "</td><td>" + alpha[i].name + "</td><td><i id=edit_" + alpha[i]._id + " class='edit fas fa-edit'></i></td><td><i id=delete_" + alpha[i]._id + " class='edit fas fa-ban editUsers'></i></td>"
                    document.getElementById('form-body').appendChild(row);
                    document.getElementById("delete_" + alpha[i]._id).addEventListener("click", (ev) => {
                        fetch('/process?searchForm=' + String(ev.target.id).replace("delete_", "")).then((prom) => prom.text()).then((res) => {
                            console.log(res);
                            if (JSON.parse(res).length > 0) {
                                alert("The form cannot be deleted as it is being used in following processes:-" + res);
                            }
                            else {
                                popUpConfirmBox("Delete", "Cancel", "Sure you want to delete the form?");

                                formId=String(ev.target.id).replace("delete_", "")

                                document.getElementById('confirmButton').addEventListener('click', (ev) => {

                                    fetch('/forms/' + formId, {
                                        method: "DELETE",
                                        credentials: "include"
                                    }).then((prom) => prom.text()).then((res) => {
                                        listForms();
                                        popupClose();

                                    })
                                });
                                document.getElementById('rejectButton').addEventListener('click', (ev) => {

                                    popupClose();
                                });

                            }
                            // if(JSON.parse(res).used=="Y"){
                            //     alert("Form currently in use by some live instance! Cannot delete the same");
                            // }
                        })
                    });
                    document.getElementById("edit_" + alpha[i]._id).addEventListener('click', (event) => {
                        window.location.hash = "#frmbdr" + String(event.target.id).replace("edit_", "");
                    });


                }
            }
            else {
                document.getElementById("noForms").style.display = "block";
                document.getElementById("forms").style.display = "none";

            }
            removeLoadBar();

        })
}

listForms();