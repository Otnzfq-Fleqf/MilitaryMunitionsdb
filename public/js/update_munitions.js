let updateMunitionsForm = document.getElementById('update-munitions-form-ajax');

updateMunitionsForm.addEventListener("submit", function (e) {
  e.preventDefault();

  let inputMunitionId = document.getElementById("munitionId-select");
  let inputType = document.getElementById("input-type-update");
  let inputSpecs = document.getElementById("input-specs-update");
  let inputQuantity = document.getElementById("input-quantity-update");

  let munitionId = inputMunitionId.value;
  let newType = inputType.value;
  let newSpecs = inputSpecs.value;
  let newQuantity = inputQuantity.value;

  if (!munitionId || !newType || !newSpecs || !newQuantity) {
    return alert("Please fill out all fields before submitting");
  }

  let data = {
    munitionId: munitionId,
    type: newType,
    specs: newSpecs,
    quantity: newQuantity,
  };
    
  var xhttp = new XMLHttpRequest();
  xhttp.open("PUT", "/update-munitions-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {

      updateRow(munitionId, newType, newSpecs, newQuantity);

    } else if (xhttp.readyState == 4 && xhttp.status != 200) {
        console.log("There was an error with the input.");
    }
  };
  xhttp.send(JSON.stringify(data));
});

function updateRow(munitionId, newType, newSpecs, newQuantity) {
  let table = document.getElementById("Munitions-table"); 
  for (let i = 0, row; row = table.rows[i]; i++) {
    if (table.rows[i].getAttribute("data-value") == munitionId) {
      let typeCell = row.cells[1];
      typeCell.textContent = newType;
      let specsCell = row.cells[2];
      specsCell.textContent = newSpecs;
      let quantityCell = row.cells[3];
      quantityCell.textContent = newQuantity;
      break;
    }
  }
}
