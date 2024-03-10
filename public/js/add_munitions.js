// Get the objects we need to modify
let addMunitionsForm = document.getElementById('add-munitions-form-ajax');

// Modify the objects we need
addMunitionsForm.addEventListener("submit", function (e) {
  
  e.preventDefault(); // Prevent page reload

  // Get form fields we need to get data from
  let inputType = document.getElementById("input-type");
  let inputSpecs = document.getElementById("input-specs");
  let inputQuantity = document.getElementById("input-quantity");

  // Get the values from the form fields
  let typeValue = inputType.value;
  let specsValue = inputSpecs.value;
  let quantityValue = inputQuantity.value;

  // Prepare data for sending
  let data = {
    type: typeValue,
    specs: specsValue,
    quantity: quantityValue 
  }

  // Setup our AJAX request
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", "/add-munition-ajax", true);
  xhttp.setRequestHeader("Content-type", "application/json");

  // Handle the server response
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {

      // Add the new data to the table 
      // IMPORTANT: Change 'addRowToTable' to the appropriate function for your munition table
      addRowToTable(xhttp.response); 

      // Clear input fields using the previously defined variables:
      inputType.value = '';
      inputSpecs.value = '';
      inputQuantity.value = '';
    } 
    else if (xhttp.readyState == 4 && xhttp.status != 200) {
      console.log("There was an error with the input.")
    }
  }

  // Send the request and wait for the response
  xhttp.send(JSON.stringify(data));

})


// Function to add a row to the Munitions table 
addRowToTable = (data) => {
  // Get a reference to the current table 
  let currentTable = document.getElementById("Munitions-table"); // Ensure this ID matches your table 

  // Get the location where we should insert the new row (end of table)
  let newRowIndex = currentTable.rows.length;

  // Get a reference to the new row from the database query (assuming data is the updated table)
  let parsedData = JSON.parse(data);
  let newRow = parsedData[parsedData.length - 1]; // Assuming the new munition is the last element

  // Create a row and cells
  let row = document.createElement("TR");
  let idCell = document.createElement("TD");
  let typeCell = document.createElement("TD");
  let specsCell = document.createElement("TD");
  let quantityCell = document.createElement("TD");
  
  let deleteCell = document.createElement("TD");

  // Fill the cells with correct data
  idCell.innerText = newRow.munitionId; // Ensure property names match your data
  typeCell.innerText = newRow.type;
  specsCell.innerText = newRow.specs;
  quantityCell.innerText = newRow.quantity;

  deleteCell = document.createElement("button");
  deleteCell.innerHTML = "Delete";
  deleteCell.onclick = function(){
      deleteMunition(newRow.munitionId);
  };


  // Add the cells to the row 
  row.appendChild(idCell);
  row.appendChild(typeCell);
  row.appendChild(specsCell);
  row.appendChild(quantityCell);
  row.appendChild(deleteCell);

  // Add row attribute for the delete function
  row.setAttribute('data-value', newRow.munitionId);

  // Add the row to the table 
  currentTable.appendChild(row);

   // Code to add new munition to the update dropdown
  let selectMenu = document.getElementById("munitionIdSelect");
  let option = document.createElement("option");
  option.text = newRow.munitionId; 
  option.value = newRow.munitionId; 
  selectMenu.add(option);
}
