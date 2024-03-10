let updateBaseForm = document.getElementById('update-base-form-ajax');

updateBaseForm.addEventListener("submit", function (e) {
  e.preventDefault(); 

  let inputBaseName = document.getElementById("base-select");
  let inputLocation = document.getElementById("input-location-update");

  let baseId = inputBaseName.value;
  let newLocation = inputLocation.value;

  // Simple input validation
  if (!baseId || !newLocation) {
    return alert("Please select a base and enter a new location");
  }

  let data = {
    baseId: baseId,
    location: newLocation
  };

  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-base-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {

      updateRow(baseId, newLocation); 

    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
});

function updateRow(baseId, newLocation) {
  let table = document.getElementById("bases-table");
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == baseId) {
      let locationCell = row.cells[2]; 
      locationCell.textContent = newLocation;
      break;
    }
  }
}
