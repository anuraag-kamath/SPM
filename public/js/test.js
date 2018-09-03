//var dms_server_url = "http://localhost:4000";
//var dms_server_url = "https://damp-woodland-10129.herokuapp.com"

var dms_tag_id = "";



//const packet_size = 1024000;
var tempArr = [];
var parts = 0;
var currentToken = 0;

document.addEventListener('DOMContentLoaded', function () {
    /* your logic here */

    createDms("normal")


});

createDms = (mode) => {
    dmsEls = (document.getElementsByTagName("mydms"));
    if (document.getElementsByTagName("mydms").length > 0) {
        dms_tag_id = dmsEls[0].id;
        var row = document.createElement("ROW");
        row.style.display = "flex";
        var div1 = document.createElement("DIV");
        div1.id = "dms_col_1"
        div1.style.flex = 1;
        div1.style.height = "100%";
        div1.style.width = "100%"
        var div2 = document.createElement("DIV");
        div2.id = "dms_col_2"
        div2.style.flex = 1;
        div2.style.display = "none"
        var documentListDiv = document.createElement("DIV");
        documentListDiv.id = "documentListDiv"
        var inputFile = document.createElement("INPUT");
        inputFile.type = "file";
        inputFile.id = "dms_file_input";
        inputFile.setAttribute("onchange", "documentUploaded(event)");
        inputFile.accept = ".png,.jpeg,.jpg,.pdf,.gif,.txt"
        var table = document.createElement("TABLE");
        table.id = "dms_doc_list";
        var th1 = document.createElement("TH");
        th1.className = "dms_header";
        var th2 = document.createElement("TH");
        th2.className = "dms_header";
        var th3 = document.createElement("TH");
        th3.className = "dms_header";
        th1.innerText = "Name"
        th1.style.borderBottom="1px solid black"
        table.appendChild(th1);
        table.style.width = "100%"
        th2.innerText = "Extension"
        th2.className = "smallScreen"
        th2.style.borderBottom="1px solid black"
        table.appendChild(th2);
        th3.innerText = "Size"
        th3.className = "smallScreen"
        th3.style.borderBottom="1px solid black"
        table.appendChild(th3);
        var documentDiv = document.createElement("DIV");
        documentDiv.style.display = "none";
        documentDiv.id = "documentDiv"
        var iframe = document.createElement("IFRAME");
        iframe.id = "documentFrame"
        iframe.src = "";
        iframe.height = "100%";
        iframe.width = "100%"
        documentListDiv.appendChild(inputFile);
        documentListDiv.appendChild(table);
        div1.appendChild(documentListDiv);
        documentDiv.appendChild(iframe);
        div2.appendChild(documentDiv);
        div1.className = "col-12"
        div2.className = "col-0"
        row.appendChild(div1);
        row.appendChild(div2);
      
        dmsEls[0].appendChild(row);

        var sheet = document.createElement('style')
        sheet.innerHTML = "#dms_doc_list th{padding:20px 0;background-color:aqua;text-align:left} #dms_doc_list tr{ text-align:left}";
        document.body.appendChild(sheet);
        fetchDocuments();

    }

}

fetchDocuments = () => {
    document.getElementById("dms_doc_list").innerHTML="";
    fetch('/api/dms/documents?uniqueIdentifier=' + document.getElementById(dms_tag_id).getAttribute('uniqueIdentifier'), {
        method: "GET",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "content-type": "application/json"
        }
    }).then((prom) => prom.text()).then((res) => {

        res = JSON.parse(res)
        for (var i = 0; i < res.length; i++) {
            var tr = document.createElement("TR");
            var td1 = document.createElement("TD");
            td1.innerText = res[i]['name']
            td1.id = res[i]._id;
            td1.style.cursor = "pointer";
            td1.style.borderBottom="1px solid black"
            var td2 = document.createElement("TD");
            td2.innerText = res[i]['ext']
            td2.className = "smallScreen"
            td2.style.borderBottom="1px solid black"
            var td3 = document.createElement("TD");
            td3.innerText = res[i]['totalSize']
            td3.className = "smallScreen"
            td3.style.borderBottom="1px solid black"
            var td5 = document.createElement("TD");

            td2.id = res[i]._id + "_ext";
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td5);


            document.getElementById("dms_doc_list").appendChild(tr);

            document.getElementById(res[i]._id).addEventListener('click', (ev) => {
                fetch("/api/dms/documents/" + ev.target.id + '?uniqueIdentifier=' + document.getElementById(dms_tag_id).getAttribute('uniqueIdentifier')).then((prom) => prom.text()).then((doc) => {
                    document.getElementById('documentDiv').style.display = "block";
                    document.getElementById('dms_col_1').style.maxWidth = "30%"
                    document.getElementById('dms_col_2').style.maxWidth = "70%"
                    document.getElementById('dms_col_2').style.display = "block"

                    document.getElementById('documentFrame').style.top = "0";
                    document.getElementById('documentFrame').style.height = "100%";
                    document.getElementById('documentFrame').style.overflow = "scroll";

                    document.getElementById('documentFrame').style.width = "100%";
                    document.getElementById('documentFrame').style.backgroundColor = "gray";
                    document.getElementById('documentFrame').src = doc;
                    if (String(document.getElementById(ev.target.id + "_ext").innerText).indexOf("officedocument") != -1) {
                        document.getElementById('documentFrame').style.display = "none"
                        document.getElementById('documentListDiv').style.opacity = "1"
                    }
                })
            });
        }
    })
}

function documentUploaded(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (file.size > 2048000) {
        alert("File Limit of 2MB");

    } else if (file.type != "application/pdf" &&
        file.type != "image/png" &&
        file.type != "image/gif" &&
        file.type != "image/jpeg" &&
        file.type != "image/jpg" &&
        file.type != "text/plain") {
        alert("Supported File formats:-pdf,png,jpeg,jpg,plain text");

    } else {


        var reader = new FileReader();
        reader.onload = function () {

            var contents = (reader.result);
            var masterDocId = "";

            bodyJson = {
                "name": file.name,
                "ext": file.type,
                "total": 1,
                "part": 1,
                "totalSize": file.size,
                "binaryContent": contents,
                "documentMasterId": masterDocId,
                "uniqueIdentifier": document.getElementById(dms_tag_id).getAttribute('uniqueIdentifier')
            };

            fetch('/api/dms/documents', {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "content-type": "application/json"
                },
                body: JSON.stringify(bodyJson)
            }).then((prom) => prom.text()).then((doc123) => {
                masterDocId = JSON.parse(doc123).documentMaster;
                fetchDocuments();
            })
        }
        reader.readAsDataURL(file);

    }
}





// document.addEventListener('click', (ev) => {
//     document.getElementById('documentDiv').style.display = "none";
//     document.getElementById('documentListDiv').style.opacity = "1";
// });


