function deletePersonnel(personnelId) {
    let data = { id: personnelId };
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-personnel-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(personnelId);
        } else if (xhttp.readyState == 4) {
            console.log("Error deleting personnel with ID: " + personnelId);
        }
    };
    xhttp.send(JSON.stringify(data));
}

function deleteRow(personnelId) {
    let table = document.getElementById("Personnel-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (row.getAttribute("data-value") == personnelId) {
            table.deleteRow(i);
            break;
        }
    }
}
