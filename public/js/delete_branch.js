function deleteBranch(branchId) {
  if (confirm("Are you sure you want to delete this branch?")) { // Confirmation dialog 
    let data = {
      id: branchId
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-branch-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
        deleteRow(branchId); 
      } else if (xhttp.readyState == 4 && xhttp.status != 204) {
        console.log("There was an error with the deletion.");
        alert("There was an error deleting the branch. Please try later.");
      }
    };

    xhttp.send(JSON.stringify(data));
  }
}

function deleteRow(branchId){
  let table = document.getElementById("branches-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
     //iterate through rows
     //rows would be accessed using the "row" variable assigned in the for loop
     if (table.rows[i].getAttribute("data-value") == branchId) {
          table.deleteRow(i);
          break;
     }
  }
}
