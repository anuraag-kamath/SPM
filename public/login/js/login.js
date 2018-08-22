document.getElementById('login').addEventListener('click', (ev) => {
    loadBar();
    ev.preventDefault();
    loginRegister("login");

})


document.getElementById('register').addEventListener('click', (ev) => {
    loadBar();

    ev.preventDefault();
    if (document.getElementById('1531198206993').value.length > 0 && document.getElementById('1531198206993').value.length > 0 && document.getElementById('reg_email').value.length > 0) {
        loginRegister("register");

    }
    else {
        document.getElementById('mess').innerText = "Username and Password are mandatory fields";
        document.getElementById('mess').style.visibility = "visible"
        removeLoadBar();

    }
})

document.getElementById('sendActivationLink').addEventListener('click', (ev) => {
    loadBar();

    ev.preventDefault();
    var bodyJSON = '{"email":"' + document.getElementById('reg_email').value + '"}'

    if (document.getElementById('reg_email').value.length > 0) {
        fetch('/resendActivationLink', {
            credentials: "include",
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body:bodyJSON
        }).then((prom) => prom.text()).then((res) => {
                res = JSON.parse(res);
                document.getElementById('mess').innerText = res.message;
                document.getElementById('mess').style.visibility = "visible"
                removeLoadBar();
            })

    }
    else {
        document.getElementById('mess').innerText = "Registered Email address is mandatory for re-sending activation link";
        document.getElementById('mess').style.visibility = "visible"
        removeLoadBar();

    }
})


loginRegister = (type) => {
    console.log("###");
    jsonBody = {
        username: document.getElementById('1531198206993').value,
        password: document.getElementById('1531198220280').value,
        email: document.getElementById('reg_email').value
    }
    console.log(JSON.stringify(jsonBody));
    fetch('/' + type, {
        method: 'POST',
        headers: {

            'content-type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(jsonBody)
    }).then((prom) => {
        console.log(prom);
        return prom.text();
    }).then((res) => {
        console.log("********");
        console.log(res);
        console.log("********");
        if (res.error != undefined && res.error != "undefined" && res.error.length > 0) {
            document.getElementById('mess').innerText = res.error;
            document.getElementById('mess').style.visibility = "visible"

        }
        else if (res.token != undefined) {
            localStorage.setItem('spm_token', res.token);
            console.log(document.cookie.token);
            if (window.location.href.indexOf('login') == -1) {
                console.log("REFRESHING");
                window.location.reload();

            } else {
                window.location.href = res.url;
            }

        } else if (res.deactivated == true) {
            document.getElementById('mess').innerText = "User deactivated";
            document.getElementById('mess').style.visibility = "visible"

        } else if (res.notactivated == true) {
            document.getElementById('mess').innerText = "User not yet activated!";
            document.getElementById('mess').style.visibility = "visible"

        } else if (res.registeredButNotActivated == true) {
            document.getElementById('mess').innerText = "Check your inbox for the activation link!";
            document.getElementById('mess').style.visibility = "visible"
        } else {
            document.getElementById('mess').innerText = "Invalid username/password";
            document.getElementById('mess').style.visibility = "visible"

        }
        removeLoadBar();
    })
}

// document.getElementById("login").addEventListener('mouseover', (ev) => {
//     var div = document.createElement("DIV");
//     div.style.height = "100px";
//     div.style.width = (document.getElementById(ev.target.id).getBoundingClientRect().width * 2) + "px";
//     div.id = "test"
//     var temp = document.getElementById(ev.target.id).getBoundingClientRect();
//     console.log(temp);
//     div.style.left = (temp.x - ((document.getElementById(ev.target.id).getBoundingClientRect().width / 2))) + "px";
//     div.style.position = "absolute";
//     div.style.top = (temp.y + temp.height+30) + "px";
//     div.style.backgroundColor = "blue"
//     var h2=document.createElement("H6");
//     h2.style.color="white"
//     h2.innerText="If a user is not yet created, then add a new username and password and click register!";
//     div.appendChild(h2);
//     console.log("**" + (temp.x - 50) + "##" + (temp.y + temp.height));
//     document.getElementById(ev.target.id).parentNode.appendChild(div)
//     console.log(document.getElementById('test').getBoundingClientRect());
// });

// document.getElementById("register").addEventListener('mouseover', (ev) => {
//     var div = document.createElement("DIV");
//     div.style.height = "100px";
//     div.style.width = (document.getElementById(ev.target.id).getBoundingClientRect().width * 2) + "px";
//     div.id = "test"
//     var temp = document.getElementById(ev.target.id).getBoundingClientRect();
//     console.log(temp);
//     div.style.left = (temp.x - ((document.getElementById(ev.target.id).getBoundingClientRect().width / 2))) + "px";
//     div.style.position = "absolute";
//     div.style.top = (temp.y + temp.height+30) + "px";
//     div.style.backgroundColor = "blue";
//     var h2=document.createElement("H6");
//     h2.style.color="white"
//     h2.innerText="If a user is not yet created, then add a new username and password and click register!";
//     div.appendChild(h2);
//     console.log("**" + (temp.x - 50) + "##" + (temp.y + temp.height));
//     document.getElementById(ev.target.id).parentNode.appendChild(div)
//     console.log(document.getElementById('test').getBoundingClientRect());
// });

document.getElementById("login").addEventListener('mouseout', (ev) => {
    try {
        document.getElementById('test').parentNode.removeChild(document.getElementById('test'))
    }
    catch (e) {

    }
});

document.getElementById("register").addEventListener('mouseout', (ev) => {
    try {
        document.getElementById('test').parentNode.removeChild(document.getElementById('test'))
    }
    catch (e) {

    }
});



loadBar = () => {
    loadIt = true
    var elem = document.getElementById("loading");
    document.getElementById("loading").style.visibility = "visible"
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
        if (loadIt == false) {
            clearInterval(id);
        }
        if (width >= 100) {
            width = 1;
        } else {
            width++;

            elem.style.width = (width) + '%';
        }
    }
}

removeLoadBar = () => {
    loadIt = false;
    document.getElementById("loading").style.visibility = "hidden";
}