const express = require('express');
const path = require('path')

var fetch = require('node-fetch')

var { ObjectID } = require('mongodb');


var { process1 } = require('./schemas/process')
var { processMaster } = require('./schemas/processMaster')

var { mongoose } = require('./db/database')

var { ObjectId } = require('mongodb')

var { obj } = require('./schemas/objects');

var { form1 } = require('./schemas/form');

var { instance } = require('./schemas/instance');

var { workitem } = require('./schemas/workitem');
var { userActivity } = require('./schemas/userActivity');

var { comments } = require('./schemas/comments');

var { user } = require('./schemas/user');
var { roles } = require('./schemas/roles');

var bcrypt = require('bcrypt');
var jsonwebtoken = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var nodemailer = require('nodemailer');

var Promise = require('promise')

const bodyparser = require('body-parser');

const fs = require('fs');

var app = express()




var url = "";

const port = process.env.SPM_PORT || 9099;
const jwt_key = process.env.JWT_KEY || "alphabetagamma"
const email_id = process.env.EMAIL_ID || ""
const email_password = process.env.EMAIL_PASSWORD || ""
const email_provider = process.env.EMAIL_PROVIDER || "";

var cors = require('cors')

//newImports
var { test_v0 } = require('./userSchemas/test_v0')
var { employee_v1 } = require('./userSchemas/employee_v1')
var { employee_v0 } = require('./userSchemas/employee_v0')

app.use(bodyparser.json());

logger = (activity, subActivity, subsubActivity, activityId, status, userId, ipAddress, method) => {
    if (userId.length > 0) {
        user.findById(userId, (err, res1) => {
            if (res1 != undefined && res1 !== 'undefined' && res1.user != undefined && res1.user !== 'undefined') {
                act = new userActivity({
                    activity, subActivity, subsubActivity, activityId, status, userId, user: res1.user.username, ipAddress, method, logDate: new Date()
                });
                act.save();

            }


        })

    } else {
        act = new userActivity({
            activity, subActivity, subsubActivity, activityId, status, userId, user: "", ipAddress, method, logDate: new Date()
        });
        act.save();

    }
}


app.use(bodyparser.urlencoded({
    extended: true
}))
app.use(cookieParser())
app.use(express.static(__dirname + "/public/login"));

app.use((req, res, next) => {


    next();
})













app.use(express.static(__dirname + '/public'))


app.get('/comments/:instanceId', (req, res) => {
    logger("API", "comments", "", req.params.instanceId, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");
    comments.find({ instanceId: req.params.instanceId }).then((docs) => {
        res.send(docs);
    })
})

app.post('/comments/:instanceId', (req, res) => {
    logger("API", "comments", "", req.params.instanceId, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");
    console.log("COMMENT SAVED for" + req.params.instanceId);
    var com = new comments({
        comment: req.body.comment,
        user: jsonwebtoken.verify(req.cookies.token, jwt_key).userId,
        commentDate: new Date(),
        instanceId: req.params.instanceId,
        deleted: false

    })
    com.save().then(
        (res1) => {
            console.log("COMMENT SAVED" + res1);
            res.send(res1);
        }
    );
})

app.delete('/comments/:id', (req, res) => {
    comments.findByIdAndUpdate(req.params.id, {
        deleted: true
    })
})

app.post('/logout', (req, res) => {
    logger("API", "logout", "", "", "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");

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
            logger("API", "deactivateUser", "", req.params.id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");

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
            logger("API", "activateUser", "", req.params.id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");

            res.send(res1);
        })
    })
})

app.delete('/deleteUser/:id', (req, res) => {
    var deleteUser = req.params.id;

    user.findByIdAndRemove(deleteUser, (err, res1) => {
        logger("API", "deleteUser", "", req.params.id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");

        res.send("OK");
    })
})




sendMail = (senderMailId, subject, html) => {
    var transporter = nodemailer.createTransport({
        // host: 'smtp.gmail.email',
        // port: 587,
        service: email_provider,
        secure: false,
        auth: {
            user: email_id,
            pass: email_password
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    var mailOptions = {
        from: email_id,
        to: senderMailId,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Could not send email!");
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



app.get('/whoami', (req, res) => {

    logger("API", "whoami", "", "", "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");
    console.log("**/whoami entered**");


    user.findById(jsonwebtoken.verify(req.cookies.token, jwt_key).userId, (err, res1) => {
        res.send('{"user":"' + res1.user.username + '","userId":"' + jsonwebtoken.verify(req.cookies.token, jwt_key).userId + '"}')

    })

    console.log("**/whoami exited**");

})

// app.post('/process', (req, res) => {
//     console.log("**/process entered**");
//     var process2 = new process1(req.body);
//     process2.save().then((doc) => {
//         var master = new processMaster({ processName: req.body.processName, latestVersionId: doc._id, pastversions: [] });
//         master.save().then((doc1) => {
//             logger("API", "process", "", doc1._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");


//             res.send(`${doc1}`);

//         })
//     })
//     console.log("**/process exited**");

// })

app.post('/objects', (req, res) => {
    console.log("**/objects entered**");
    obj.find({ schemaName: req.body.schemaName + "_v0" }).then((objs) => {
        console.log(req.body.schemaName);
        console.log(objs);
        if (objs.length > 0) {
            res.send({ error: "Object with same root element exists! Please change the root element name" });
        } else {
            req.body.schemaName = req.body.schemaName + "_v0"



            var obj1 = new obj((req.body));
            obj1.save().then((doc) => {
                console.log("SAVED!!!");
                fs.appendFile('./userSchemas/' + req.body.schemaName + '.js', "var mongoose=require('mongoose');\nvar " + req.body.schemaName + '=mongoose.model("' + req.body.schemaName + '",{"' + req.body.schemaName + '":[' + JSON.stringify(req.body.schemaStructure) + '],"instanceId":{"type":"String"}});\nmodule.exports={' + req.body.schemaName + "}", (err) => {
                })
                logger("API", "object", "", doc._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");
                fs.readFile('./app.js', (err, data) => {



                    data = String(data).replace("//newImports", "//newImports\nvar {" + req.body.schemaName + "}=require('./userSchemas/" + req.body.schemaName + "')");

                    data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.post('/" + req.body.schemaName + "', (req, res) => {\n\tconsole.log(req.body);\n\tvar obj1 = new " + req.body.schemaName + "(req.body);\n\tconsole.log(obj1)\n\obj1.save().then((doc) => {\n\t\tres.send(`${doc}`);\n\t})\n})")
                    data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "', (req, res) => {\n\t" + req.body.schemaName + ".find({}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
                    data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "/:id', (req, res) => {\n\t" + req.body.schemaName + ".find({_id:ObjectId(req.params.id)}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
                    fs.writeFile('./app.js', data, (err) => {
                        res.send(`${doc}`);

                    })
                })
            }).catch((err) => {
                console.log("ERR");
                console.log(err);
            })

        }
    })



    console.log("**/objects exited**");


})


app.put('/objects/:id', (req, res) => {
    console.log(req.body);
    console.log("**/objects entered**");

    obj.findByIdAndUpdate(req.params.id, {
        obsolete: "yes"
    }, (err, doc3) => {
        var version = "_v" + (Number((String(doc3.schemaName).substr(String(doc3.schemaName).length - 1))) + 1);
        req.body.schemaName = req.body.schemaName + version
        var obj1 = new obj((req.body));
        obj1.save().then((doc) => {
            logger("API", "object", doc._id, req.params.id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "UPDATE");

            logger("API", "object", "", doc._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "PUT");

            fs.appendFile('./userSchemas/' + req.body.schemaName + '.js', "var mongoose=require('mongoose');\nvar " + req.body.schemaName + '=mongoose.model("' + req.body.schemaName + '",{"' + req.body.schemaName + '":[' + JSON.stringify(req.body.schemaStructure) + '],"instanceId":{"type":"String"}});\nmodule.exports={' + req.body.schemaName + "}", (err) => {
            })


            fs.readFile('./app.js', (err, data) => {



                data = String(data).replace("//newImports", "//newImports\nvar {" + req.body.schemaName + "}=require('./userSchemas/" + req.body.schemaName + "')");

                data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.post('/" + req.body.schemaName + "', (req, res) => {\n\tconsole.log(req.body);\n\tvar obj1 = new " + req.body.schemaName + "(req.body);\n\tconsole.log(obj1)\n\obj1.save().then((doc) => {\n\t\tres.send(`${doc}`);\n\t})\n})")
                data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "', (req, res) => {\n\t" + req.body.schemaName + ".find({}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
                data = String(data).replace("//newSettersGetter" + "s", "//newSettersGetter" + "" + "s\n\napp.get('/" + req.body.schemaName + "/:id', (req, res) => {\n\t" + req.body.schemaName + ".find({_id:ObjectId(req.params.id)}).then((docs) => {\n\t\tconsole.log(docs);\n\t\tres.send(docs);\n\t})\n});")
                fs.writeFile('./app.js', data, (err) => {

                    res.send({});
                })

            })
        })



    });
    console.log("**/objects exited**");



})


app.get('/objects', (req, res) => {
    console.log("**/objects entered**");

    obj.find({}).then((docs) => {
        logger("API", "object", "", "", "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");

        res.send(docs);
    });
    console.log("**/objects exited**");

});

app.get('/objects/:id', (req, res) => {
    console.log("**/objects entered**");

    obj.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        logger("API", "object", "", req.params.id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");

        res.send(docs);
    })
    console.log("**/objects exited**");

});

app.get('/objects/:id/:name', (req, res) => {

    getObjects(req.params.id, req.params.name, req.query.mode, req.query.filter || "", req.connection.remoteAddress, jsonwebtoken.verify(req.cookies.token, jwt_key).userId, "actual", res, "", "", "", "");

});


getObjects = (id, name, mode, filterText, remoteAddress, userId, callMode, res, url, method, instanceId, wid) => {
    console.log("**/objects entered**");

    if (filterText.length > 0 && mode != "undefined" && mode != undefined && mode == "showAll") {

        var search = '{"$or": [';

        obj.findById(id, (err, res22) => {
            console.log("##");
            keys = Object.keys(res22.schemaStructure);
            for (var ip = 0; ip < keys.length; ip++) {
                if (ip != 0) {
                    search += ",";
                } search += '{"' + name + "." + keys[ip] + '":{"$regex":"' + filterText + '"}}'
            }
            search += "]}";
            logger("API", "object", name, id, "success", userId, remoteAddress, "GET");
            eval(name + '.find(' + (search) + ').then((docs)=>{console.log("AA");if(callMode=="actual"){res.send(docs)}else{return docs;}})');

        })

    } else if (filterText.length == 0 && mode != "undefined" && mode != undefined && mode == "showAll") {
        logger("API", "object", name, id, "success", userId, remoteAddress, "GET");

        eval(name + '.find().then((docs)=>{if(callMode=="actual"){res.send(docs)}else{return docs;}})');
    }
    else {
        console.log("@@@" + id + "@@@" + name);
        eval(name + '.findById("' + id + '",(err,docs)=>{console.log("**************");console.log(docs);console.log("**************");if(callMode=="actual"){res.send(docs)}else{console.log("EEEEEE");console.log(docs);doACall(url,method,docs,instanceId,wid,name);return docs;}})');

    }
    console.log("**/objects exited**");

}


doACall = (url, method, bodyJSON, instanceId, wid, name) => {
    console.log("#23" + wid);
    console.log("#######################");
    console.log(method);
    console.log(name);
    bodyJSON = '{"' + name + '":' + JSON.stringify(bodyJSON[name]) + "}";
    console.log(bodyJSON);
    console.log("#######################");


    var param = "";
    if (new URL(url).pathname.indexOf(":") != -1) {
        param = new URL(url).pathname.substr(new URL(url).pathname.indexOf(":") + 1)
        console.log("####");
        console.log(param);
        console.log("####");
        var jsonBody = JSON.parse(bodyJSON);

        var paramValue = (eval("jsonBody." + name + "[0]." + param));
        console.log(new URL(url).pathname.substr(new URL(url).pathname.indexOf(":")));
        url = url.replace(new URL(url).pathname.substr(new URL(url).pathname.indexOf(":")), paramValue)
        console.log("###" + url)


    }


    if (method == "GET" || method == "DELETE") {
        console.log("#24" + wid);
        fetch("/api/bpm"+url, {
            method: method,
            headers: {

                "content-type": "application/json"
            }
        }).then((prom) => prom.json()).then((res) => {

            console.log("##25" + wid);
            instanceWorkitemExecutor(instanceId, wid, JSON.stringify(res), null, null, "internal");



            console.log(res);
        })
    } else {
        console.log("#26" + wid);
        fetch("/api/bpm"+url, {
            method: method,
            headers: {

                "content-type": "application/json"
            },
            body: bodyJSON
        }).then((prom) => prom.json()).then((res) => {


            instanceWorkitemExecutor(instanceId, wid, JSON.stringify(res), null, null, "internal");



            console.log(res);
        })
    }
}

app.get('/process', (req, res) => {
    console.log("**/process entered**");

    var alpha = req.query.process;
    searchForm = req.query.searchForm;
    if (alpha != undefined) {
        logger("API", "process", "", req.query.process, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");

        searchQuery = "'_id':'" + ObjectID(alpha) + "'"
        process1.find({ "_id": ObjectId(alpha) }).select().then((docs) => {
            res.send(docs);
        })
    } else if (searchForm != undefined) {
        process1.find({ $and: [{ obsolete: { $ne: 'yes' } }, { deleted: { $ne: true } }, { $or: [{ formName: searchForm }, { "steps.frm1": searchForm }, { "steps.frm2": searchForm }] }] }, 'processName', (err, res1) => {
            res.send(res1);
        });
    }
    else {
        logger("API", "process", "", "", "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");
        console.log("");
        process1.find({ $and: [{ obsolete: { $ne: 'yes' } }, { deleted: { $ne: true } }] }).
            then((res1) => res.send(res1));


    }
    console.log("**/process exited**");


})
app.delete('/objects/:id', (req, res) => {
    console.log("**/objects entered**");

    _id = req.params.id;
    obj.deleteOne({ "_id": ObjectId(_id) }).then((doc) => {
        logger("API", "object", "", req.params.id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "DELETE");

        res.send(doc)
    })
    console.log("**/objects exited**");

})

app.post('/forms', (req, res) => {
    console.log("**/forms entered**");

    var frm = new form1(req.body);
    frm.save().then((doc) => {
        logger("API", "form", "", doc._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");

        res.send(doc);
    })
    console.log("**/forms entered**");

})

app.delete('/forms/:id', (req, res) => {
    console.log("**/forms entered**");

    var id = req.params.id;

    form1.findByIdAndUpdate(id, {
        deleted: true
    }).then((res1) => {
        res.send({ deleted: true })
    })

    console.log("**/forms entered**");

})

app.put('/forms/:id', (req, res) => {
    console.log("**/forms entered**");

    id = req.params.id;
    var frm = new form1(req.body);
    form1.findByIdAndUpdate(id, req.body, (err, res1) => {
        logger("API", "form", "", res1._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "PUT");

        res.send(res1);
    })
    console.log("**/forms exited**");

})

app.get('/forms/:id', (req, res) => {
    console.log("**/forms entered**");
    id = req.params.id;
    canDelete = req.query.mode || "";
    var used = "N";

    if (canDelete.length > 0 && canDelete === "canDelete") {
        process1.find({ formName: id }).then((processes) => {
            var count = 0;
            console.log("AACC" + processes.length);
            if (processes.length == 0) {
                console.log("SEND");
                res.send(usedInstances)
            }
            for (var i = 0; i < processes.length; i++) {
                console.log("PROCESS");
                workitem.find({ processId: processes[i]._id, status: "scheduled" }).then((workitems) => {
                    if (workitems.length > 0) {
                        used = "Y";
                    }
                    count += 1;
                    if (count == processes.length) {
                        res.send({ used });
                    }
                })
            }
        })
    } else {
        form1.findById(id, (err, res2) => {
            console.log(id);
            logger("API", "form", "", res2._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");

            res.send(res2);
        })

    }
    console.log("**/forms exited**");

})

app.get('/forms', (req, res) => {
    console.log("**/forms entered**");

    fields = req.query.fields;
    form1.find({ deleted: { $ne: true } }).select(fields).then((docs) => {
        logger("API", "form", "", "", "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");


        res.send(docs);
    })
    console.log("**/forms exited**");

})



app.put('/process/:id', (req, res) => {
    console.log("##########");
    console.log(req.params.id);
    console.log("##########");
    console.log("**/process entered**");

    var alpha = req.params.id;

    var process2 = new process1(req.body);
    process2.save().then((doc) => {

        process1.findByIdAndUpdate(alpha, {
            obsolete: "yes"
        }).then((doc1) => {
            var searchParameters = '{ "latestVersionId": "' + alpha + '" }'
            processMaster.find(JSON.parse(searchParameters)).then((doc4) => {
                console.log("@@@@@@@@WWW" + doc4);
                searchId = doc4[0]._id;
                processMaster.findByIdAndUpdate(searchId, {
                    latestVersionId: doc._id,
                    $push: {
                        pastVersions: alpha
                    }
                }, (err, doc3) => {
                    logger("API", "process", doc._id, req.params.id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "UPDATE");

                    logger("API", "process", "", doc._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "PUT");

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
            logger("API", "process", "", doc._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");

            res.send(`${doc1}`);

        })
    })
    console.log("**/process exited**");
})

app.delete('/deleteAll', (req, res) => {
    console.log("**/deleteAll entered**");

    process.deleteMany({}).then((doc) => {
        logger("API", "process", "", "", "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "DELETE");

        res.send(doc)
    })
    console.log("**/deleteAll exited**");

})

app.get('/process/:id', (req, res) => {
    console.log("**/process entered**");

    id = req.params.id;
    process1.findById(id, (err, res1) => {
        logger("API", "process", "", req.params.id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");

        res.send(res1);
    }).select('processName formName');

    console.log("**/process exited**");

})

app.post('/instance', (req, res) => {
    console.log("**/instance entered**");
    processId = req.body.processId;
    user.findById(jsonwebtoken.verify(req.cookies.token, jwt_key).userId, (err, res123) => {
        var ins = new instance({
            processId, user: res123.user.username
            , date: new Date(),
            status: "initiated"
        })
        ins.save().then((doc) => {
            logger("API", "instance", "", doc._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");

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
    addObjects(objects, req.params.id);
    instance.findByIdAndUpdate(instanceId, {
        $push: {
            workedUponUsers: {
                userId: jsonwebtoken.verify(req.cookies.token, jwt_key).userId
            }
        }
    }, (err, resinst) => {
    })
    instance.findById(instanceId, (err, data) => {
        process1.findById(data.processId, (err, data2) => {



            var date = new Date();
            var escalationDate = date;
            var escalationTriggered = false;
            var escalationApplicable = false;
            var rejectionApplicable = false;
            //var differentEye=false;
            console.log("###");
            console.log(escalationDate);
            console.log("###");
            if ((data2).steps[0].days1 > 0) {
                escalationApplicable = true;
                escalationDate.setDate(escalationDate.getDate() + (data2).steps[0].days1)
            }
            if ((data2).steps[0].hours1 > 0) {
                escalationApplicable = true;
                escalationDate.setHours(escalationDate.getHours() + (data2).steps[0].hours1)
            }
            if ((data2).steps[0].minutes1 > 0) {
                escalationApplicable = true;
                escalationDate.setMinutes(escalationDate.getMinutes() + (data2).steps[0].minutes1)

            }
            if ((data2).steps[0].rej1 == true) {
                rejectionApplicable = true;
            }
            // if ((data2).steps[0].difEye1 == true) {
            //     differentEye = true;
            // }
            console.log("###");
            console.log(escalationDate);
            console.log("###");
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
                escalationDate,
                escalationTriggered,
                escalationApplicable,
                escalationStatus: 'notTriggered',
                date: new Date(),
                rejectionApplicable
            })




            wi.save().then((doc) => {
                console.log("WORKITEM SAVED");
                console.log(doc);
                logger("API", "workitem", req.params.id, doc._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "POST");
                if (doc.stepType == "Service Task") {
                    executeServiceTask(doc._id, doc.instanceId, doc.stepId, "1", doc.processId);
                }
                res.send(doc);
            })

        });
    })

    console.log("**/instance exited**");


})

whatsNext = () => {

}

app.get('/rejectionSteps/:wid', (req, res) => {
    var wid = req.params.wid;
    workitem.findById(wid, (err, res2) => {
        var processId = res2.processId;
        var stepId = res2.stepId;
        process1.findById(processId, (err, res3) => {
            var steps = res3.steps;
            var rejArr = {};
            for (var i = 0; i < steps.length; i++) {
                console.log(stepId + "####" + steps[i]._id);
                if (stepId == steps[i]._id) {
                    break;
                } else {
                    if (steps[i].step1 == "Human Task") {
                        rejArr["lbl1_" + steps[i]._id] = {
                            stepId: steps[i]._id,
                            stepName: steps[i].lbl1,
                            stepType: steps[i].step1,
                            stepForm: steps[i].frm1,
                            stepNumber: "lbl1"

                        }
                    }
                    if (steps[i].lbl2 != undefined && steps[i].lbl2 !== 'undefined' && steps[i].lbl2.length > 0 && steps[i].step2 == "Human Task") {
                        rejArr["lbl2_" + steps[i]._id] = {
                            stepId: steps[i]._id,
                            stepName: steps[i].lbl2,
                            stepType: steps[i].step2,
                            stepForm: steps[i].frm2,
                            stepNumber: "lbl2"
                        }
                    }
                }
            }
            res.send(rejArr)
        })
    })
})

app.get('/searchObjects/:id', (req, res) => {
    var instanceId = req.params.id;
    instance.findById(instanceId, (err, res1) => {
        console.log(res1.objects.length);

        res.send(res1.objects);
    })
})

var oldObjects = [];

app.get('/rejectWorkItem/:wid/:rejectToStep', (req, res) => {
    var workitemId = req.params.wid;
    var rejectStep = req.params.rejectToStep
    var userSearch = jsonwebtoken.verify(token, jwt_key).userId

    user.findById(userSearch, (err, res123) => {
        workitem.findByIdAndUpdate(workitemId, {
            status: "rejected",
            user: res123.user.username,
            date: new Date()
        }).then(
            (doc) => {
                workitem.find({ "instanceId": doc.instanceId, "status": "scheduled" }).then((docs) => {

                    console.log("#R#R#R#");
                    console.log(docs);
                    console.log("#R#R#R#");
                    instance.findByIdAndUpdate(doc.instanceId, {
                        $push: {
                            workedUponUsers: {
                                userId: jsonwebtoken.verify(req.cookies.token, jwt_key).userId
                            }
                        }
                    }, (err, resinst) => {
                    })

                    if (docs.length != 0) {
                        for (var d = 0; d < docs.length; d++) {
                            console.log("###RR###" + docs[d]._id);
                            workitem.findByIdAndUpdate(docs[d]._id, {
                                status: "parallelReject",
                                user: res123.user.username,
                                date: new Date()
                            }, (err, res44) => {
                                console.log("#T#T#T");
                                console.log(err);
                                console.log(res44);
                                console.log("#T#T#T");
                            });
                        }


                    };
                });


                process1.findById(doc.processId, (err, doc1) => {

                    jumpTo = String(rejectStep).substr((String(rejectStep).indexOf("_") + 1));
                    jumpToLbl = String(rejectStep).substr(0, String(rejectStep).indexOf("_"));
                    console.log(jumpTo + "#" + jumpToLbl + "#" + String(rejectStep));
                    for (var i = 0; i < doc1.steps.length; i++) {
                        console.log("SEARCHING" + doc1.steps[i]._id);
                        if (doc1.steps[i]._id == jumpTo) {
                            console.log("GOTCHA");
                            var status = "";
                            var date = new Date();
                            var escalationDate = date;
                            var escalationTriggered = false;
                            var escalationApplicable = false;
                            var rejectionApplicable = false;
                            // var differentEye = false;

                            if (String(rejectStep).indexOf("lbl1") != -1) {
                                if (doc1.steps[i].days1 > 0) {
                                    escalationApplicable = true;
                                    escalationDate.setDate(escalationDate.getDate() + doc1.steps[i].days1)
                                }
                                if (doc1.steps[i].hours1 > 0) {
                                    escalationApplicable = true;
                                    escalationDate.setHours(escalationDate.getHours() + doc1.steps[i].hours1)
                                }
                                if (doc1.steps[i].minutes1 > 0) {
                                    escalationApplicable = true;
                                    escalationDate.setMinutes(escalationDate.getMinutes() + doc1.steps[i].minutes1)

                                }
                                if ((doc1).steps[i].rej1 == true) {
                                    rejectionApplicable = true;
                                }
                                // if ((doc1).steps[i].difEye1 == true) {
                                //     differentEye = true;
                                // }



                                var wi1 = new workitem({
                                    processName: doc.processName,
                                    processId: doc.processId,
                                    instanceId: doc.instanceId,
                                    status: "scheduled",
                                    stepName: doc1.steps[i].lbl1,
                                    stepType: (doc1).steps[i].step1,
                                    stepId: (doc1).steps[i]._id,
                                    formId: (doc1).steps[i].frm1,
                                    participant: (doc1).steps[i].part1,
                                    escalationDate,
                                    escalationTriggered,
                                    escalationApplicable,
                                    escalationStatus: 'notTriggered',
                                    date: new Date(),
                                    rejectionApplicable
                                })
                                wi1.save().then((doc) => {
                                    console.log("SAVED1" + doc);
                                    res.send({})

                                })

                            } else {
                                if (doc1.steps[i].days2 > 0) {
                                    escalationApplicable = true;
                                    escalationDate.setDate(escalationDate.getDate() + doc1.steps[i].days2)
                                }
                                if (doc1.steps[i].hours2 > 0) {
                                    escalationApplicable = true;
                                    escalationDate.setHours(escalationDate.getHours() + doc1.steps[i].hours2)
                                }
                                if (doc1.steps[i].minutes2 > 0) {
                                    escalationApplicable = true;
                                    escalationDate.setMinutes(escalationDate.getMinutes() + doc1.steps[i].minutes2)

                                }
                                if ((doc1).steps[i].rej2 == true) {
                                    rejectionApplicable = true;
                                }
                                // if ((doc1).steps[i].difEye2 == true) {
                                //     differentEye = true;
                                // }



                                var wi1 = new workitem({
                                    processName: doc.processName,
                                    processId: doc.processId,
                                    instanceId: doc.instanceId,
                                    status: "scheduled",
                                    stepName: doc1.steps[i].lbl2,
                                    stepType: (doc1).steps[i].step2,
                                    stepId: (doc1).steps[i]._id,
                                    formId: (doc1).steps[i].frm2,
                                    participant: (doc1).steps[i].part2,
                                    escalationDate,
                                    escalationTriggered,
                                    escalationApplicable,
                                    escalationStatus: 'notTriggered',
                                    date: new Date(),
                                    rejectionApplicable
                                })
                                wi1.save().then((doc) => {
                                    res.send({})
                                })

                            }

                        }
                    }
                });
            });
    });
});

//PENDING
app.post('/instance/:id/:wid', (req, res) => {
    instanceWorkitemExecutor(req.params.id, req.params.wid, req.body.objects, req.cookies.token, res, "actual")
})

instanceWorkitemExecutor = (id, wid, objects, token, res, mode) => {
    console.log("**/instance entered**");

    workitem.findById(wid, (err, resWI) => {
        if (resWI.status != "finished" &&
            resWI.status != "rejected" &&
            resWI.status != "parallelReject") {
            instanceId = id;
            workitemId = wid;
            objects = JSON.parse(objects);
            if (mode == "internal") {
                user1 = "5b7a73a6ab3b0a4167cab95b";
            } else {
                user1 = jsonwebtoken.verify(token, jwt_key).userId
            }
            instance.findByIdAndUpdate(instanceId, {
                $push: {
                    workedUponUsers: {
                        userId: user1
                    }
                }
            }, (err, resinst) => {
            })
            instance.findById(instanceId, (err, doc21) => {
                oldObjects = doc21.objects;
                instance.findByIdAndUpdate(instanceId, {
                    objects: []
                }, (err, res10) => {
                    addObjects(objects, instanceId);
                })
            })
            var userSearch = "";
            if (mode == "internal") {
                userSearch = "5b7a73a6ab3b0a4167cab95b";
            } else {
                userSearch = jsonwebtoken.verify(token, jwt_key).userId
            }
            user.findById(userSearch, (err, res123) => {
                console.log("##XYZ5" + workitemId);
                workitem.findByIdAndUpdate(workitemId, {
                    status: "finished",
                    user: res123.user.username,
                    date: new Date()
                }).then(
                    (doc) => {
                        workitem.find({ "instanceId": doc.instanceId, "status": "scheduled" }).then((docs) => {
                            console.log("XYZ2" + docs);

                            if (docs.length == 0) {
                                process1.findById(doc.processId, (err, doc1) => {

                                    for (var i = 0; i < doc1.steps.length; i++) {
                                        console.log("COMPARING!!!" + doc1.steps[i]._id + "##" + wid);
                                        console.log("###XYZ1####");
                                        console.log(doc1);
                                        console.log(wid);
                                        console.log("###XYZ1####");

                                        if (doc1.steps[i]._id == doc.stepId) {
                                            console.log("MATCH FOUND!!!!" + "##" + wid);
                                            var status = "";
                                            i = i + 1;
                                            console.log("###XYZ####");
                                            console.log(doc1);
                                            console.log(wid);
                                            console.log("###XYZ####");
                                            if (i == doc1.steps.length) {
                                                status = "finished";

                                                instance.findByIdAndUpdate(instanceId, {
                                                    status
                                                }, (err, doc21) => {

                                                });

                                            }
                                            else {
                                                console.log("CAME INSIDE ELS" + "##" + wid);
                                                status = doc1.steps[i]._id;
                                                var date = new Date();
                                                var escalationDate = date;
                                                var escalationTriggered = false;
                                                var escalationApplicable = false;
                                                var rejectionApplicable = false;
                                                // var differentEye = true;

                                                if (doc1.steps[i].days1 > 0) {
                                                    escalationApplicable = true;
                                                    escalationDate.setDate(escalationDate.getDate() + doc1.steps[i].days1)
                                                }
                                                if (doc1.steps[i].hours1 > 0) {
                                                    escalationApplicable = true;
                                                    escalationDate.setHours(escalationDate.getHours() + doc1.steps[i].hours1)
                                                }
                                                if (doc1.steps[i].minutes1 > 0) {
                                                    escalationApplicable = true;
                                                    escalationDate.setMinutes(escalationDate.getMinutes() + doc1.steps[i].minutes1)

                                                }
                                                if ((doc1).steps[i].rej1 == true) {
                                                    rejectionApplicable = true;
                                                }

                                                var wi1 = new workitem({
                                                    processName: doc1.processName,
                                                    processId: doc.processId,
                                                    instanceId: instanceId,
                                                    status: "scheduled",
                                                    stepName: doc1.steps[i].lbl1,
                                                    stepType: (doc1).steps[i].step1,
                                                    stepId: (doc1).steps[i]._id,
                                                    formId: (doc1).steps[i].frm1,
                                                    participant: (doc1).steps[i].part1,
                                                    escalationDate,
                                                    escalationTriggered,
                                                    escalationApplicable,
                                                    escalationStatus: 'notTriggered',
                                                    date: new Date(),
                                                    rejectionApplicable
                                                })
                                                wi1.save().then((doc) => {
                                                    console.log("SAVED1" + doc);
                                                    if (doc.stepType == "Service Task") {
                                                        executeServiceTask(doc._id, doc.instanceId, doc.stepId, "1", doc.processId);
                                                    }
                                                })
                                                if (doc1.steps[i].lbl2 != undefined && doc1.steps[i].lbl2.length > 0) {

                                                    var date = new Date();
                                                    var escalationDate = date;
                                                    var escalationTriggered = false;
                                                    var escalationApplicable = false;
                                                    var rejectionApplicable = false;
                                                    if (doc1.steps[i].days2 > 0) {
                                                        escalationApplicable = true;
                                                        escalationDate.setDate(escalationDate.getDate() + doc1.steps[i].days2)
                                                    }
                                                    if (doc1.steps[i].hours2 > 0) {
                                                        escalationApplicable = true;
                                                        escalationDate.setHours(escalationDate.getHours() + doc1.steps[i].hours2)
                                                    }
                                                    if (doc1.steps[i].minutes2 > 0) {
                                                        escalationApplicable = true;
                                                        escalationDate.setMinutes(escalationDate.getMinutes() + doc1.steps[i].minutes2)

                                                    }

                                                    if ((doc1).steps[i].rej2 == true) {
                                                        rejectionApplicable = true;
                                                    }

                                                    var wi2 = new workitem({
                                                        processName: doc1.processName,
                                                        processId: doc.processId,
                                                        instanceId: instanceId,
                                                        status: "scheduled",
                                                        stepName: doc1.steps[i].lbl2,
                                                        stepType: (doc1).steps[i].step2,
                                                        stepId: (doc1).steps[i]._id,
                                                        formId: (doc1).steps[i].frm2,
                                                        participant: (doc1).steps[i].part2,
                                                        escalationDate,
                                                        escalationTriggered,
                                                        escalationApplicable,
                                                        escalationStatus: 'notTriggered',
                                                        date: new Date(),
                                                        rejectionApplicable
                                                    })
                                                    wi2.save().then((doc) => {
                                                        console.log("SAVED2" + doc);

                                                        if (doc.stepType == "Service Task") {
                                                            executeServiceTask(doc._id, doc.instanceId, doc.stepId, "2", doc.processId);
                                                        }

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
                                    if (mode == "actual") {
                                        res.send({ status: "OK" });

                                    }
                                })
                            } else {
                                if (mode == "actual") {
                                    res.send({ status: "OK" });

                                }
                            }
                        })


                    }
                )

            });


        } else {
            var stmes = "already submitted by"
            if (resWI.status == "rejected") {
                stmes = "rejected by"
            } else if (resWI.status == "parallelReject") {
                stmes = "of a parallel step rejected by"
            }
            res.send({ status: "ERROR", message: "Work Item " + stmes + " " + resWI.user + " at " + resWI.date + " .Your changes will be discarded!You will be redirected to the Workitems list." });


        }
    })


    console.log("**/instance exited**");

}

executeServiceTask = (wid, instanceId, stepId, step, processId) => {
    console.log("ENTER SERVICE TASK") + stepId;
    process1.find({ "steps._id": ObjectId(stepId) }).then((proc) => {
        console.log("###########");
        console.log(proc);
        console.log(proc[0]);
        var url = ""
        var method = ""
        var headers = [];
        var queryParams = [];
        var input = "";
        var output = "";
        for (var i = 0; i < proc[0].steps.length; i++) {
            if (proc[0].steps[i]._id == stepId) {
                if (step == "1") {
                    url = proc[0].steps[i]["url1"]
                    method = proc[0].steps[i]["method1"]
                    headers = proc[0].steps[i]["headers1"]
                    queryParams = proc[0].steps[i]["queryParams1"]
                    input = proc[0].steps[i]["input1"]
                    output = proc[0].steps[i]["output1"]

                } else {
                    url = proc[0].steps[i]["url2"]
                    method = proc[0].steps[i]["method2"]
                    headers = proc[0].steps[i]["headers2"]
                    queryParams = proc[0].steps[i]["queryParams2"]
                    input = proc[0].steps[i]["input2"]
                    output = proc[0].steps[i]["output2"]

                }
                break;
            }
        }
        console.log(url);
        console.log(method);
        console.log(headers);
        console.log(queryParams);
        console.log(input);
        console.log(output);
        console.log("###########");

        if (method == "GET" || method == "DELETE") {


            if (url.indexOf(":") != -1) {



                instance.findById(instanceId).then((ins) => {
                    var bodyJSON = {};
                    var inputObjectId = "";
                    console.log("####$$$$" + input);
                    console.log("####$$$$" + ins.objects);

                    if (input.length > 0) {
                        for (var rt = 0; rt < ins.objects.length; rt++) {
                            if (input == ins.objects[rt].name) {
                                console.log("####$$$$MATCHED" + input);
                                inputObjectId = ins.objects[rt].id;
                                break;
                            }
                        }

                    }

                    if (inputObjectId.length > 0) {
                        getObjects(inputObjectId, input, "", "", "", "system", "internal", null, url, method, instanceId, wid)

                    }
                });



            } else {



                fetch("/api/bpm"+url, {
                    method: method,
                    headers: {

                        "content-type": "application/json"
                    }
                }).then((prom) => prom.json()).then((res) => {

                    instance.findById(instanceId).then((ins) => {
                        if (output.length > 0) {
                            var objs = ins.objects;

                            //addObjects(res, instanceId)
                            instanceWorkitemExecutor(instanceId, wid, JSON.stringify(res), null, null, "internal");


                        }
                    })


                    console.log(res);
                })
            }

        } else {
            instance.findById(instanceId).then((ins) => {
                var bodyJSON = {};
                var inputObjectId = "";
                console.log("####$$$$" + input);
                console.log("####$$$$" + ins.objects);

                if (input.length > 0) {
                    for (var rt = 0; rt < ins.objects.length; rt++) {
                        if (input == ins.objects[rt].name) {
                            console.log("####$$$$MATCHED" + input);
                            inputObjectId = ins.objects[rt].id;
                            break;
                        }
                    }

                }
                if (inputObjectId.length > 0) {
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$");



                    getObjects(inputObjectId, input, "", "", "", "system", "internal", null, url, method, instanceId, wid)
                    console.log(bodyJSON);
                    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$");



                } else {
                    fetch("/api/bpm"+url, {
                        method: method,
                        headers: {

                            "content-type": "application/json"
                        },
                        body: bodyJSON
                    }).then((prom) => prom.json()).then((res) => {


                        instanceWorkitemExecutor(instanceId, wid, JSON.stringify(res), null, null, "internal");



                        console.log(res);
                    })
                }

            });
        }
    })
    console.log("EXIT SERVICE TASK");
}

function addObjects(objects, instanceId) {
    console.log("***ADDED OBJECTS TO INSTANCED ID:-****" + instanceId);

    console.log(objects);
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


app.delete('/process/:id', (req, res) => {
    var id = req.params.id;

    console.log("DELETED" + id);

    process1.findByIdAndUpdate(id, {
        deleted: true
    }).then((doc) => {
        res.send({ deleted: true })
    })


});

app.get('/instance', (req, res) => {
    var searchProcessId = req.query.processId;
    var searchStatus = req.query.status;
    var mode = req.query.mode || "";
    var searchProcess = req.query.searchProcess;
    var status = req.query.status
    var initatedBy = req.query.initiatedBy
    var search = "{";
    if (status != undefined && status !== 'undefined' && status.length > 0) {
        search += '"status":' + '"' + status + '"';
    }
    if (initatedBy != undefined && initatedBy !== 'undefined' && initatedBy.length > 0) {
        if (search.length > 1) {
            search += ","
        }
        search += '"user":' + '"' + initatedBy + '"';
    }
    search += "}"
    console.log("XYZ" + searchProcess);
    if (searchProcess != undefined && searchProcess.length > 0) {
        console.log(searchProcess);
        instance.find({ processId: searchProcess }, (err, res2) => {
            res.send(res2);
        })
    }
    else if (mode.length > 0 && mode == "listAll") {
        console.log("########");
        console.log(search);
        console.log("########");
        instance.find(JSON.parse(search), (err, res2) => {
            res.send(res2);
        })
    } else {
        instance.count({ status: searchStatus, processId: searchProcessId }).then((doc) => {
            logger("API", "instance", "", "", "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");

            res.send({ count: doc });
        })

    }
})


app.get('/instance/:id', (req, res) => {
    console.log("**/instance entered**");

    instanceId = req.params.id;
    instance.findById(instanceId, (err, doc) => {
        var res1;
        logger("API", "instance", "", doc._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");

        res.send(doc);

        // process.findById(doc.processId, (err, res1) => {
        //     console.log(res1.objects)
        //     res.send(res1.objects)
        // })
    }).select('objects processId')
    console.log("**/instance exited**");

})


//TIMER WORKITEMS
setInterval(() => {
    workitem.find({ "status": "scheduled", "escalationApplicable": true, "escalationTriggered": false, "escalationStatus": "notTriggered" }).then((docs) => {
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$");
        for (var i = 0; i < docs.length; i++) {
            var currentDate = new Date().getTime();
            var wiescalation = docs[i].escalationDate.getTime();
            console.log(docs[i].escalationDate.getTime());
            console.log(currentDate);

            console.log((wiescalation - currentDate));
            if ((wiescalation - currentDate) < (300000 / 5)) {
                waitForTrigger(docs[i]._id, currentDate, wiescalation, docs[i].escalationDate, docs[i].date, docs[i].instanceId);
            }
        }
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$");
    })
}, 60000)


waitForTrigger = (triggerId, curr, esc, escDate, schDate, instanceId) => {
    workitem.findByIdAndUpdate(triggerId, {
        escalationStatus: "initiated"
    }, (err, res2) => {
        setTimeout(() => {
            user.find({}).then((users) => {
                for (var j = 0; j < users.length; j++) {
                    if (users[j].user.email != undefined && users[j].user.email !== "undefined" && users[j].user.email.length > 0) {
                        sendMail(users[j].user.email, "Escalation for InstanceId:-" + instanceId, "<h3>Dear " + users[j].user.username + ",</h3><br><br>Instance Id:-" + instanceId + " Workitem Id:-" + triggerId + " scheduled on:-" + schDate + " escalated on " + escDate + "<hr> Kindly take attention!<hr><hr>Shortcut for the same is here:-<a href='https://dry-depths-41802.herokuapp.com#" + triggerId + "'><h3>Click me!</h3></a>");

                    }
                }
            })
            workitem.findByIdAndUpdate(triggerId, { escalationStatus: "done", escalationTriggered: true }, (err, res2) => {

            })
        }, esc - curr)


    })
}

//TIMER WORKITEMS

app.get('/workitems', (req, res) => {
    console.log("**/workitems entered**");

    var search = '';

    console.log("SEARCH");
    console.log(req.query.search);
    var searchStep = req.query.searchStep;
    console.log("SEARCH");
    var userId = jsonwebtoken.verify(req.cookies.token, jwt_key).userId


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

            logger("API", "workitem", "", "", "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");

            res.send(data)
        });

    })


    console.log("**/workitems exited**");

})

app.get('/workitems/:id', (req, res) => {
    console.log("**/workitems entered**");

    var userId = jsonwebtoken.verify(req.cookies.token, jwt_key).userId;



    var id = req.params.id;

    var canOpen = req.query.checkOpen

    workitem.findById(id).then((data) => {

        if (canOpen != undefined && canOpen !== 'undefined' && canOpen.length > 0) {
            console.log(data.currentUser + "#" + data.currentStatus + "#" + userId);
            if (data.currentStatus == "open" && data.currentUser != userId) {
                res.send({ status: "open", user: data.currentUser })
            } else {
                workitem.findByIdAndUpdate(id, {
                    currentStatus: "open",
                    currentUser: userId
                }).then((doc) => {
                    res.send({ status: "OK" })
                })
            }
        } else {
            res.send(data)

        }


        logger("API", "workitem", "", data._id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");
    });
    console.log("**/workitems exited**");

})


app.put('/workitems/:id', (req, res) => {
    console.log("**/workitems entered**");

    var userId = jsonwebtoken.verify(req.cookies.token, jwt_key).userId;



    var id = req.params.id;


    workitem.findByIdAndUpdate(id, {
        currentStatus: "closed",
        currentUser: userId
    }).then((doc) => {
        res.send({ status: "OK" })
    })


    logger("API", "workitem", "", id, "success", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "PUT");
    console.log("**/workitems exited**");

})





app.get('/roles/:id', (req, res) => {

    roles.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.get('/roles', (req, res) => {
    var ids = req.query.ids;
    var mode = req.query.mode;
    if (mode != undefined && mode.length > 0) {
        roles.find({ "roles.type": "participant" }).then((docs) => {
            console.log(docs);
            res.send(docs);
        })
    }
    else if (ids != undefined && ids != "undefined" && ids.length > 0) {
        var search = '{"$or": [';
        oneAdded = false;
        var noNeed = [];
        console.log("@###");
        console.log(String(ids).split(','));
        console.log(String(ids).split(',').length);
        for (var e = 0; e < String(ids).split(',').length; e++) {
            console.log("REACHED");
            try {
                console.log("&&&");
                //ObjectId(String(ids).split(",")[e]);
                if (e != 0 && oneAdded == true) {
                    search += ",";
                }
                console.log("****************");
                search += '{"roles.roleName":"' + String(ids).split(",")[e] + '"}'
                console.log(search);
                console.log("****************");
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
            console.log("SEARCHED!");
            var roleName = "";
            for (var e1 = 0; e1 < docs.length; e1++) {
                roleName += docs[e1].roles[0].roleName + " ";
            }
            roleName += noNeed.join(" ");
            console.log("#$#$#$$#$");
            console.log(roleName);
            console.log(noNeed);
            console.log("#$#$#$$#$");
            res.send(docs[0].roles[0].mode);
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


app.get('/user', (req, res) => {
    user.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.get('/user/:id', (req, res) => {
    console.log(req.params.id);
    req.params.id = req.params.id.replace("_", "")
    user.findById(req.params.id, (err, docs) => {
        res.send({
            user: docs.user.username
        })
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

app.put('/user', (req, res) => {
    console.log(req.body);
    var password = req.body.newPassword
    var id = jsonwebtoken.verify(req.cookies.token, jwt_key).userId;
    user.findById(id, (err, res2) => {
        bcrypt.hash(password, 10).then((res3) => {
            res2.user.password = res3;
            user.findByIdAndUpdate(id, res2).then((res1) => {
                res.send(res1);
            })

        });
    })
})

//newSettersGetters

app.get('/test_v0/:id', (req, res) => {
    test_v0.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.get('/test_v0', (req, res) => {
    test_v0.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/test_v0', (req, res) => {
    console.log(req.body);
    var obj1 = new test_v0(req.body);
    console.log(obj1)
    obj1.save().then((doc) => {
        res.send(`${doc}`);
    })
})

app.get('/employee_v1/:id', (req, res) => {
    employee_v1.find({ _id: ObjectId(req.params.id) }).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.get('/employee_v1', (req, res) => {
    employee_v1.find({}).then((docs) => {
        console.log(docs);
        res.send(docs);
    })
});

app.post('/employee_v1', (req, res) => {
    console.log(req.body);
    var obj1 = new employee_v1(req.body);
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


app.use((req, res, next) => {
    logger("page", "index", "", "", "failure", jsonwebtoken.verify(req.cookies.token, jwt_key).userId, req.connection.remoteAddress, "GET");

    res.redirect("/index.html")
})


app.listen(port, () => {
    console.log("Server started on:", port);
})


