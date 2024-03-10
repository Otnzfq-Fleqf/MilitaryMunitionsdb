function deleteMunition(munitionId) {
    let link = '/delete-munition-ajax'; // Your backend route 
    let data = {
      id: munitionId
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(munitionId);  // Assuming successful deletion
      },
      error: function(error) {  // Handle errors
        console.error("Error deleting munition:", error);
        // You could display an error message to the user here
      }
    });
}
  
function deleteRow(munitionId) {
    let table = document.getElementById("Munitions-table"); // Get the table
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == munitionId) {
            table.deleteRow(i);
            break;
        }
    }
}