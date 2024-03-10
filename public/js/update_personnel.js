let updatePersonnelForm = document.getElementById('update-personnel-form-ajax');

updatePersonnelForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let inputPersonnelId = document.getElementById("personnel-select");
  let inputName = document.getElementById("input-name-update");
  let inputRank = document.getElementById("input-rank-update");
  let inputRole = document.getElementById("input-role-update");
  let inputBaseId = document.getElementById("input-baseId-update");

  let personnelId = inputPersonnelId.value;
  let newName = inputName.value;
  let newRank = inputRank.value;
  let newRole = inputRole.value;
  let newBaseId = inputBaseId.value;

  if (!personnelId || !newName || !newRank || !newRole || !newBaseId) {
    return alert("Please fill out all fields before submitting");
  }

  let data = { 
    personnelId: personnelId, 
    name: newName,
    rank: newRank,
    role: newRole,
    baseId: newBaseId
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-personnel-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {

      updateRow(personnelId, newName, newRank, newRole, newBaseId);

    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
});

function updateRow(personnelId, newName, newRank, newRole, newBaseId) {
  let table = document.getElementById("Personnel-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == personnelId) {
      let nameCell = row.cells[1];
      nameCell.textContent = newName;
      let rankCell = row.cells[2];
      rankCell.textContent = newRank;
      let roleCell = row.cells[3];
      roleCell.textContent = newRole;
      let baseIdCell = row.cells[4];
      baseIdCell.textContent = newBaseId;
      break;
    }
  }
}