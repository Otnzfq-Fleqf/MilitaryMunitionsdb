let updateMilitaryBranchForm = document.getElementById('update-military-branch-form-ajax');

updateMilitaryBranchForm.addEventListener("submit", function(e) {
  e.preventDefault();

  let inputBranchId = document.getElementById("branch-select");
  let inputName = document.getElementById("input-name-update");

  let branchId = inputBranchId.value;
  let newName = inputName.value;

  if (!branchId || !newName) {
    return alert("Please select a military branch and enter a new name before submitting.");
  }

  let data = {
    branchId: branchId,
    name: newName,
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-military-branch-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {

      updateRow(branchId, newName);

    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
        console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
});

function updateRow(branchId, newName) {
  let table = document.getElementById("branches-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == branchId) {
      let nameCell = row.cells[1];
      nameCell.textContent = newName;
      break;
    }
  }
}
  