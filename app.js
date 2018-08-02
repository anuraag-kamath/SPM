const express = require('express');
const path = require('path')

var { ObjectID } = require('mongodb');

var { process1 } = require('./schemas/process')
var { processMaster } = require('./schemas/processMaster')

var { mongoose } = require('./db/database')

var { ObjectId } = require('mongodb')

var { obj } = require('./schemas/objects');

var { form1 } = require('./schemas/form');

var { instance } = require('./schemas/instance');

var { workitem } = require('./schemas/workitem');

var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var cookieParser = require('cookie-parser');



var Promise = require('promise')

const bodyparser = require('body-parser');

const fs = require('fs');

var app = express()




var url = "";
const port = process.env.PORT || 9099;

var cors = require('cors')

//newImports
var { sample123_v0 } = require('./schemas/sample123_v0')
var { employee_v0 } = require('./schemas/employee_v0')

var { user } = require('./schemas/user.js')
var { roles } = require('./schemas/roles')

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(express.static(__dirname + "/public/login"));

app.use((req, res, next) => {
    console.log(req.path);
    console.log(req.method);
    next();
})

app.get('/login', (req, res) => {
    console.log("**/login entered**");
    res.sendFile(__dirname + '/public/login/login.html')
    console.log("**/login exited**");
})

app.post('/login', (req, res) => {
    console.log("**/login entered**");

    user.find({ "user.username": req.body.username }).then((res1) => {
        if (res1.length > 0) {
            bcrypt.compare(req.body.password, res1[0].user.password).then((res2) => {
                if (res1[0].user.deactivated == true) {
                    res.send({
                        deactivated: true,
                        url: '/login.html'
                    })
                } else if (res2 == true) {
                    token = jsonwebtoken.sign({ userId: res1[0]._id }, "alphabetagamma", {
                        expiresIn: '1H'
                    })
                    var sendBackUrl = '/index.html';
                    if (url.length > 0) {
                        sendBackUrl = url;
                    }
                    res.cookie('token', token, { httpOnly: true }).send({
                        url: sendBackUrl,
                        token: token
                    })

                }
                else {
                    res.send({
                        url: '/login.html'
                    })
                }
            })
        } else {
            res.send({
                url: '/login.html'
            })
        }
    })


    console.log("**/login exited**");



})

app.post('/logout', (req, res) => {
    console.log("**/logout entered**");


    res.cookie('token', '', { httpOnly: true }).send({
        url: ''
    })
    console.log("**/logout exited**");

});


app.post('/deactivateUser/:id', (req, res) => {



    var deactivateId = req.params.id;
    user.findById(deactivateId, (err, res2) => {
        res2.user.deactivated = true;
        console.log("####");
        console.log(res2);
        console.log(deactivateId);

        console.log("####");
        user.findByIdAndUpdate(deactivateId, res2).then((res1) => {
            res.send(res1);
        })
    })




})

app.post('/activateUser/:id', (req, res) => {
    var activateId = req.params.id;
    user.findById(activateId, (err, res2) => {
        console.log(activateId)
        res2.user.deactivated = false;
        user.findByIdAndUpdate(activateId, res2).then((res1) => {
            res.send(res1);
        })
    })
})

app.delete('/deleteUser/:id', (req, res) => {
    var deleteUser = req.params.id;

    user.findByIdAndRemove(deleteUser, (err, res1) => {
        res.send("OK");
    })
})


app.post('/register', (req, res) => {
    console.log("**/register entered**");
    var username = req.body.username;
    var password = req.body.password;

    user.find({ "user.username": username }).then((doc) => {
        if (doc.length > 0) {
            res.send({ error: "Username already exists" });
        }
        else {

            bcrypt.hash(password, 10).then((res2) => {
                var usr = new user({
                    user: {
                        username: username,
                        password: res2,
                        roles: ["index", "admin"],
                        deactivated: false
                    }
                })
                usr.save().then((res8) => {
                    token = jsonwebtoken.sign({ userId: res8._id }, "alphabetagamma", {
                        expiresIn: '1M'
                    })
                    res.cookie('token', token).send({
                        url: '/index.html',
                        token: token
                    })
                });
            })
        }
    })


    console.log("**/register exited**");



})


app.use((req, res, next) => {
    console.log("**/Checking Auth entered**");
    url = req.url;
    console.log(req.cookies);
    if (req.cookies.token == undefined) {
        res.sendFile(__dirname + '/public/login/login.html')

    }
    else {

        try {
            jsonwebtoken.verify(req.cookies.token, "alphabetagamma")

            var wola = {
                workitems: ["/css/workitems.css", "/js/workitems.js", "/workitems.html"],
                process: ["/css/process.css", "/js/process.js", "/process.html"],
                listProcess: ["/css/listProcess.css", "/js/listProcess.js", "/listProcess.html"],
                listObjects: ["/css/listObjects.css", "/js/listObjects.js", "/listObjects.html"],
                objectViewer: ["/css/objectViewer.css", "/js/objectViewer.js", "/objectViewer.html"],
                objectBuilder: ["/css/object-builder.css", "/js/object-builder.js", "/object-builder.html"],
                listForms: ["/css/listForms.css", "/js/listForms.js", "/listForms.html"],
                index: ["/css/index.css", "/js/index.js", "/index.html", '/'],
                header: ["/css/header.css", "/js/header.js", "/header.html"],
                formBuilder: ["/css/main.css", "/js/main.js", "/formBuilder.html"],
                admin: ["/css/admin.css", "/js/admin.js", "/admin.html"],
                test: ["/tests/test.css", "/tests/test.js", "/tests/test.html"]

            }

            var vali = true;

            user.findById(jsonwebtoken.verify(req.cookies.token, "alphabetagamma").userId, (err, doc) => {
                if (doc.user != undefined) {
                    var roles = doc.user.roles;
                    var keys = Object.keys(wola);
                    var notApplicable = [];
                    for (var i = 0; i < keys.length; i++) {
                        found = false;
                        for (var j = 0; j < roles.length; j++) {
                            if (roles[j] == keys[i]) {
                                found = true;
                                break;
                            }
                        }
                        if (found == false) {
                            notApplicable.push(wola[keys[i]]);
                        }
                    }
                    var redirect = false;
                    for (var k = 0; k < notApplicable.length; k++) {
                        if (String(notApplicable[k]).indexOf(req.path) != -1) {
                            redirect = true;
                            console.log("REDIRECTED TO NOT AUTHORIZED");
                            res.redirect('/notAuthorized.html');
                            break;
                        }
                    }
                    if (redirect == false) {
                        console.log("MOVE ON");
                        next();

                    }
                }
                else {
                    console.log("REDIRECTED TO INDEX");

                    res.redirect("/index.html")

                }

            })


        }
        catch (err) {
            console.log("REDIRECTED TO ERROR BACK TO LOGIN");

            res.sendFile(__dirname + '/public/login/login.html')
        }
    }
    console.log("**/Checking Auth exited**");

})

app.use(express.static(__dirname + '/public/others'))


app.get('/whoami', (req, res) => {
    console.log("**/whoami entered**");


    user.findById(jsonwebtoken.verify(req.cookies.token, "alphabetagamma").userId, (err, res1) => {
        res.send('{"user":"' + res1.user.username + '"}')

    })

    console.log("**/whoami exited**");

})

app.post('/process', (req, res) => {
    console.log("**/process entered**");
    var process2 = new process1(req.body);
    process2.save().then((doc) => {
        var master = new processMaster({ processName: req.body.processName, latestVersionId: doc._id, pastversions: [] });
        master.save().then((doc1) => {

            res.send(`${doc1}`);

        })
    })
    console.log("**/process exited**");

})

app.post('/objects', (req, res) => {
    console.log("**/objects entered**");

    req.body.schemaName = req.body.schemaName + "_v0"

    fs.appendFile('./schemas/' + req.body.schemaName + '.js', "var mongoose=require('mongoose');\nvar " + req.body.schemaName + '=mongoose.model("' + req.body.schemaName + '",{"' + req.body.schemaName + '":[' + JSON.stringify(req.body.schemaStructure) + '],"instanceId":{"type":"String"}});\nmodule.exports={' + req.body.schemaName + "}", (err) => {
    })

    var obj1 = new obj((req.body));
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })

    fs.readFile('./app.js', (err, data) => {



        data = String(data).replace("//newImports", "//newImports\nvar {" + req.body.schemaName + "}=require('./schemas/" + req.body.schemaName + "')");

        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.post('/" + req.body.schemaName + "', (req, res) => {\n\tconsole.log(req.body);\n\tvar obj1 = new " + req.body.schemaName + "(req.body);\n\tconsole.log(obj1)\n\obj1.save().then((doc) => {\n\t\tres.send(`${doc}`);\n\t})\n})")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "', (req, res) => {\n\t" + req.body.schemaName + ".find({}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
        data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "/:id', (req, res) => {\n\t" + req.body.schemaName + ".find({_id:ObjectId(req.params.id)}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
        fs.writeFile('./app.js', data, (err) => {

        })
    })
    console.log("**/objects exited**");


})


app.put('/objects/:id', (req, res) => {
    console.log("**/objects entered**");
    obj.findByIdAndUpdate(req.params.id, {
        obsolete: "yes"
    }, (err, doc3) => {
        var version = "_v" + (Number((String(doc3.schemaName).substr(String(doc3.schemaName).length - 1))) + 1);
        req.body.schemaName = req.body.schemaName + version
        var obj1 = new obj((req.body));
        obj1.save().then((doc) => {
            fs.appendFile('./schemas/' + req.body.schemaName + '.js', "var mongoose=require('mongoose');\nvar " + req.body.schemaName + '=mongoose.model("' + req.body.schemaName + '",{"' + req.body.schemaName + '":[' + JSON.stringify(req.body.schemaStructure) + '],"instanceId":{"type":"String"}});\nmodule.exports={' + req.body.schemaName + "}", (err) => {
            })


            fs.readFile('./app.js', (err, data) => {



                data = String(data).replace("//newImports", "//newImports\nvar {" + req.body.schemaName + "}=require('./schemas/" + req.body.schemaName + "')");

                data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.post('/" + req.body.schemaName + "', (req, res) => {\n\tconsole.log(req.body);\n\tvar obj1 = new " + req.body.schemaName + "(req.body);\n\tconsole.log(obj1)\n\obj1.save().then((doc) => {\n\t\tres.send(`${doc}`);\n\t})\n})")
                data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "', (req, res) => {\n\t" + req.body.schemaName + ".find({}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
                data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "/:id', (req, res) => {\n\t" + req.body.schemaName + ".find({_id:ObjectId(req.params.id)}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
                fs.writeFile('./app.js', data, (err) => {

                    res.send();
                })

            })
        })



    });
    console.log("**/objects exited**");



})


app.get('/objects', (req, res) => {
    console.log("**/objects entered**");

    obj.find({}).then((docs) => {
        res.send(docs);
    });
    console.log("**/objects exited**");

});

app.get('/objects/:id', (req, res) => {
    console.log("**/objects entered**");

    obj.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        res.send(docs);
    })
    console.log("**/objects exited**");

});

app.get('/objects/:id/:name', (req, res) => {
    console.log("**/objects entered**");

    var id = req.params.id;
    var name = req.params.name;
    var mode = req.query.mode;
    if (mode != "undefined" && mode != undefined && mode == "showAll") {
        eval(name + '.find().then((docs)=>{res.send(docs)})');

    }
    else {
        eval(name + '.findById("' + id + '",(err,docs)=>{console.log("**************");console.log(docs);console.log("**************");res.send(docs)})');

    }
    console.log("**/objects exited**");


});





app.get('/process', (req, res) => {
    console.log("**/process entered**");

    var alpha = req.query.process;
    searchQuery = "";
    if (alpha != undefined) {
        searchQuery = "'_id':'" + ObjectID(alpha) + "'"
        process1.find({ "_id": ObjectId(alpha) }).select().then((docs) => {
            res.send(docs);
        })
    }
    else {
        process1.find({ $and: [{ obsolete: { $ne: 'yes' } }] }, (err, res1) => {
            res.send(res1);
        });


    }
    console.log("**/process exited**");


})
app.delete('/objects/:id', (req, res) => {
    console.log("**/objects entered**");

    _id = req.params.id;
    obj.deleteOne({ "_id": ObjectId(_id) }).then((doc) => {
        res.send(doc)
    })
    console.log("**/objects exited**");

})

app.post('/forms', (req, res) => {
    console.log("**/forms entered**");

    var frm = new form1(req.body);
    frm.save().then((doc) => {
        res.send(doc);
    })
    console.log("**/forms entered**");

})

app.put('/forms/:id', (req, res) => {
    console.log("**/forms entered**");

    id = req.params.id;
    var frm = new form1(req.body);
    form1.findByIdAndUpdate(id, req.body, (err, res1) => {
        res.send(res1);
    })
    console.log("**/forms exited**");

})

app.get('/forms/:id', (req, res) => {
    console.log("**/forms entered**");
    id = req.params.id;
    form1.findById(id, (err, res2) => {
        res.send(res2);
    })
    console.log("**/forms exited**");

})

app.get('/forms', (req, res) => {
    console.log("**/forms entered**");

    fields = req.query.fields;
    form1.find({}).select(fields).then((docs) => {

        res.send(docs);
    })
    console.log("**/forms exited**");

})



app.put('/process/:id', (req, res) => {
    console.log("**/process entered**");

    var alpha = req.params.id;

    var process2 = new process1(req.body);
    process2.save().then((doc) => {

        process1.findByIdAndUpdate(alpha, {
            obsolete: "yes"
        }).then((doc1) => {
            var searchParameters = '{ "latestVersionId": "' + alpha + '" }'
            processMaster.find(JSON.parse(searchParameters)).then((doc4) => {

                searchId = doc4[0]._id;
                processMaster.findByIdAndUpdate(searchId, {
                    latestVersionId: doc._id,
                    $push: {
                        pastVersions: alpha
                    }
                }, (err, doc3) => {
                    res.send(doc)
                })
            })

        })


    })
    // process.findByIdAndUpdate(alpha, req.body).then((doc) => {
    //     console.log("RESPONSE")
    //     console.log(doc)
    //     console.log("RESPONSE")
    //     res.send(doc);
    // })
    console.log("**/process exited**");

})


app.post('/process', (req, res) => {
    console.log("**/process entered**");
    var process2 = new process1(req.body);
    process2.save().then((doc) => {
        var master = new processMaster({ processName: req.body.processName, latestVersionId: doc._id, pastversions: [] });
        master.save().then((doc1) => {
            res.send(`${doc1}`);

        })
    })
    console.log("**/process exited**");
})

app.delete('/deleteAll', (req, res) => {
    console.log("**/deleteAll entered**");

    process.deleteMany({}).then((doc) => {
        res.send(doc)
    })
    console.log("**/deleteAll exited**");

})

app.get('/process/:id', (req, res) => {
    console.log("**/process entered**");

    id = req.params.id;
    process1.findById(id, (err, res1) => {
        res.send(res1);
    }).select('processName formName');

    console.log("**/process exited**");

})

app.post('/instance', (req, res) => {
    console.log("**/instance entered**");
    processId = req.body.processId;
    user.findById(jsonwebtoken.verify(req.cookies.token, "alphabetagamma").userId, (err, res123) => {
        var ins = new instance({
            processId, user: res123.user.username
            , date: new Date()
        })
        ins.save().then((doc) => {
            res.send(doc);
        })
        console.log("**/instance exited**");
    })

})

app.post('/instance/:id', (req, res) => {
    console.log("**/instance entered**");
    instanceId = req.params.id;
    objects = JSON.parse(req.body.objects);
    oldObjects = [];
    addObjects(objects);
    instance.findById(instanceId, (err, data) => {
        process1.findById(data.processId, (err, data2) => {
            var wi = new workitem({
                processName: data2.processName,
                processId: data.processId,
                instanceId: instanceId,
                status: "scheduled",
                stepName: (data2).steps[0].lbl1,
                stepType: (data2).steps[0].step1,
                stepId: (data2).steps[0]._id,
                formId: (data2).steps[0].frm1,
                participant: (data2).steps[0].part1,
            })




            wi.save().then((doc) => {
                res.send(doc);
            })

        });
    })

    console.log("**/instance exited**");


})

var oldObjects = [];
app.post('/instance/:id/:wid', (req, res) => {
    console.log("**/instance entered**");

    instanceId = req.params.id;
    workitemId = req.params.wid;
    objects = JSON.parse(req.body.objects);
    instance.findById(instanceId, (err, doc21) => {
        oldObjects = doc21.objects;
        instance.findByIdAndUpdate(instanceId, {
            objects: []
        }, (err, res10) => {
            addObjects(objects);
        })
    })
    user.findById(jsonwebtoken.verify(req.cookies.token, "alphabetagamma").userId, (err, res123) => {
        workitem.findByIdAndUpdate(workitemId, {
            status: "finished",
            user: res123.user.username,
            date: new Date()
        }).then(
            (doc) => {
                workitem.find({ "instanceId": doc.instanceId, "status": "scheduled" }).then((docs) => {
                    if (docs.length == 0) {
                        process1.findById(doc.processId, (err, doc1) => {

                            for (var i = 0; i < doc1.steps.length; i++) {
                                if (doc1.steps[i]._id == doc.stepId) {
                                    var status = "";
                                    i = i + 1;
                                    if (i == doc1.steps.length) {
                                        status = "finished";
                                    }
                                    else {
                                        status = doc1.steps[i]._id;
                                        var wi1 = new workitem({
                                            processName: doc1.processName,
                                            processId: doc.processId,
                                            instanceId: instanceId,
                                            status: "scheduled",
                                            stepName: doc1.steps[i].lbl1,
                                            stepType: (doc1).steps[i].step1,
                                            stepId: (doc1).steps[i]._id,
                                            formId: (doc1).steps[i].frm1,
                                            participant: (doc1).steps[i].part1
                                        })
                                        wi1.save().then((doc) => {
                                        })
                                        if (doc1.steps[i].lbl2 != undefined && doc1.steps[i].lbl2.length > 0) {
                                            var wi2 = new workitem({
                                                processName: doc1.processName,
                                                processId: doc.processId,
                                                instanceId: instanceId,
                                                status: "scheduled",
                                                stepName: doc1.steps[i].lbl2,
                                                stepType: (doc1).steps[i].step2,
                                                stepId: (doc1).steps[i]._id,
                                                formId: (doc1).steps[i].frm2,
                                                participant: (doc1).steps[i].part2
                                            })
                                            wi2.save().then((doc) => {


                                            })

                                        }

                                        process1.findByIdAndUpdate(doc.processId, {
                                            status
                                        }, (err, doc2) => {

                                        })
                                    }
                                    break;
                                }
                            }
                            res.send("OK");
                        })
                    } else {
                        res.send("OK");
                    }
                })


            }
        )

    });



    console.log("**/instance exited**");

})

function addObjects(objects) {
    var l = 0;
    var length = 0;
    var carryForward = [];
    for (var i = 0; i < oldObjects.length; i++) {
        var found = false;
        for (key in objects) {
            if (key == oldObjects[i].name) {
                found = true;
                break;
            }
        }
        if (found == false) {
            carryForward.push({
                id: oldObjects[i].id,
                name: oldObjects[i].name
            });
        }
    }
    for (key in objects) {
        length++;
    }
    for (key in objects) {

        l++
        //console.log( objects[key]);

        //console.log('{"' + key + '":' + JSON.stringify(objects[key]) + ',"instanceId":"'+instanceId+'"}');
        var body = ('{"' + key + '":' + JSON.stringify(objects[key]) + ',"instanceId":"' + instanceId + '"}');
        var obj2 = eval("new " + key + '(JSON.parse(body))')
        obj2.save().then((doc) => {
            var tempObj = JSON.stringify(doc);
            instance.findByIdAndUpdate(instanceId, {
                $push: {
                    objects: {
                        id: doc._id,
                        name: Object.keys(JSON.parse(tempObj))[1]
                    }
                }
            }, (err, resinst) => {
            })





        })



    }

    for (var j = 0; j < carryForward.length; j++) {
        instance.findByIdAndUpdate(instanceId, {
            $push: {
                objects: {
                    id: carryForward[j].id,
                    name: carryForward[j].name
                }
            }
        }, (err, resinst) => {
        })
    }




}

app.get('/instance/:id', (req, res) => {
    console.log("**/instance entered**");

    instanceId = req.params.id;
    instance.findById(instanceId, (err, doc) => {
        var res1;
        res.send(doc);

        // process.findById(doc.processId, (err, res1) => {
        //     console.log(res1.objects)
        //     res.send(res1.objects)
        // })
    }).select('objects processId')
    console.log("**/instance exited**");

})




app.get('/workitems', (req, res) => {
    console.log("**/workitems entered**");

    var search = '';

    console.log("SEARCH");
    console.log(req.query.search);
    var searchStep = req.query.searchStep;
    console.log("SEARCH");
    var userId = jsonwebtoken.verify(req.cookies.token, "alphabetagamma").userId


    user.findById(userId, (err, res2) => {
        search = '{"$and":[ {"$or":['
        var roles = [];
        for (var t = 0; t < res2.user.roles.length; t++) {
            roles.push('{"participant":"' + res2.user.roles[t] + '"}');
        }
        console.log("STEPID LENGTH" + searchStep);
        if (searchStep != undefined && searchStep.length > 0) {
            search += roles + ']},{"instanceId":"' + req.query.instanceId + '"},{"stepId": { "$in": [' + searchStep + '] } }]}'

        } else {
            search += roles + ']},{"status":"scheduled"}]}'

        }
        console.log(search);
        workitem.find(JSON.parse(search)).then((data) => {
            res.send(data)
        });

    })


    console.log("**/workitems exited**");

})

app.get('/workitems/:id', (req, res) => {
    console.log("**/workitems entered**");


    var id = req.params.id;
    workitem.findById(id).then((data) => {
        res.send(data)
    });
    console.log("**/workitems exited**");

})




//newSettersGetters

app.get('/sample123_v0/:id', (req, res) => {
    sample123_v0.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.get('/sample123_v0', (req, res) => {
    sample123_v0.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/sample123_v0', (req, res) => {
    console.log(req.body);
    var obj1 = new sample123_v0(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})

app.get('/employee_v0/:id', (req, res) => {
    employee_v0.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.get('/employee_v0', (req, res) => {
    employee_v0.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/employee_v0', (req, res) => {
    console.log(req.body);
    var obj1 = new employee_v0(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})


app.get('/particular/:id', (req, res) => {
    particular.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.get('/particular', (req, res) => {
    particular.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/particular', (req, res) => {
    console.log(req.body);
    var obj1 = new particular(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})

app.get('/roles/:id', (req, res) => {
    roles.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.get('/roles', (req, res) => {
    var ids = req.query.ids;
    if (ids != undefined && ids != "undefined" && ids.length > 0) {
        var search = '{"$or": [';
        oneAdded = false;
        var noNeed = [];
        for (var e = 0; e < String(ids).split(',').length; e++) {
            try {
                ObjectId(String(ids).split(",")[e]);
                if (e != 0 && oneAdded == true) {
                    search += ",";
                }
                search += '{"_id":"' + String(ids).split(",")[e] + '"}'
                oneAdded = true;

            }
            catch (e1) {
                noNeed.push(String(ids).split(",")[e]);
            }
        }
        search += "]}"

        console.log("IDS");
        console.log(ids);
        console.log("IDS");
        console.log(search);
        roles.find(JSON.parse(search)).then((docs) => {
            var roleName = "";
            for (var e1 = 0; e1 < docs.length; e1++) {
                roleName += docs[e1].roles[0].roleName + " ";
            }
            roleName += noNeed.join(" ");
            console.log("#$#$#$$#$");
            console.log(roleName);
            console.log(noNeed);
            console.log("#$#$#$$#$");
            res.send(roleName);
        })
    } else {
        roles.find({}).then((docs) => {
            console.log(docs);
            res.send(docs);
        })
    }
});

app.post('/roles', (req, res) => {
    console.log(req.body);
    var obj1 = new roles(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})

app.get('/alpha/:id', (req, res) => {
    alpha.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.get('/alpha', (req, res) => {
    alpha.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/alpha', (req, res) => {
    console.log(req.body);
    var obj1 = new alpha(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})

app.get('/leaves', (req, res) => {
    leaves.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/leaves', (req, res) => {
    console.log(req.body);
    var obj1 = new leaves(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})

app.get('/employee', (req, res) => {
    employee.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/employee', (req, res) => {
    console.log(req.body);
    var obj1 = new employee(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})

app.get('/user', (req, res) => {
    user.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/user', (req, res) => {
    console.log(req.body);
    var obj1 = new user(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})

app.put('/user/:id', (req, res) => {
    console.log(req.body);
    id = req.params.id;
    user.findById(id, (err, res2) => {
        res2.user.roles = req.body.user.roles;
        user.findByIdAndUpdate(id, res2).then((res1) => {
            res.send(res1);
        })
    })

});

app.get('/beta', (req, res) => {
    beta.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/beta', (req, res) => {
    console.log(req.body);
    var obj1 = new beta(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})

app.get('/test', (req, res) => {
    test.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/test', (req, res) => {
    console.log(req.body);
    var obj1 = new test(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})



app.use((req, res, next) => {
    res.redirect("/index.html")
})


app.listen(port, () => {
    console.log("Server started on:", port);
})


