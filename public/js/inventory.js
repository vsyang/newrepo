'use strict' 
 
// Get a list of items in inventory based on the classification_id 
let classificationList = document.querySelector("#classificationList")
classificationList.addEventListener("change", function () { 
  let classification_id = classificationList.value 
  console.log(`classification_id is: ${classification_id}`) 
  let classIdURL = "/inv/getInventory/"+classification_id 
  fetch(classIdURL) 
  .then(function (response) { 
    if (response.ok) { 
      return response.json(); 
    } 
    throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { 
    console.log(data); 
    buildInventoryList(data); 
  }) 
  .catch(function (error) { 
    console.log('There was a problem: ', error.message) 
  }) 
})

// Build inventory items into HTML table components and inject into DOM 
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");
  
  // If there are NO vehicles in this classification
  if (!data || data.length === 0) {
    // If the logged-in user is an Admin, show delete option INSTEAD of table
    if (ACCOUNT_TYPE === "Admin") {
      const classification_id = classificationList.value;
      inventoryDisplay.innerHTML = `
        <p>There are no vehicles in this classification.</p>
        <p>
          <a href="/inv/delete-classification/${classification_id}">
            Delete this classification?
          </a>
        </p>
      `;
      return; 
    }

    // Regular employee: show an empty table with a "No vehicles" row
    let emptyTable = '<thead>'; 
    emptyTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
    emptyTable += '</thead>'; 
    emptyTable += '<tbody>'; 
    emptyTable += '<tr><td colspan="3">No vehicles found</td></tr>';
    emptyTable += '</tbody>';

    inventoryDisplay.innerHTML = emptyTable;
    return;
  }

  // If we DO have vehicles, everyone sees the same table
  let dataTable = '<thead>'; 
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
  dataTable += '</thead>'; 
  dataTable += '<tbody>'; 
  data.forEach(function (element) { 
    console.log(element.inv_id + ", " + element.inv_model); 
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
    dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
    dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
  }); 
  dataTable += '</tbody>'; 
  inventoryDisplay.innerHTML = dataTable; 
}

