createTable = (name) => {
    var ts=new Date().getTime();
    var table = document.createElement("TABLE");
    table.id=ts
    var thead = document.createElement("THEAD");
    thead.id="thead_"+ts
    var tbody = document.createElement("TBODY");
    tbody.id="tbody_"+ts
    
}

