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

function buildInventoryList(data) { 
  let inventoryDisplay = document.getElementById("inventoryDisplay"); 
  let classification_id = classificationList.value;

  // Clear previous delete actions
  emptyActionsDiv.innerHTML = ""; 

  // ALWAYS show a table — even if it's empty
  let dataTable = '<thead>'; 
  dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
  dataTable += '</thead>'; 
  dataTable += '<tbody>';

  if (data.length > 0) {
    // There ARE vehicles, list them
    data.forEach(function (element) { 
      dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
      dataTable += `<td><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></td>`; 
      dataTable += `<td><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></td></tr>`; 
    });
  } else {
    // Classification is EMPTY → show empty row
    dataTable += `<tr><td colspan="3">No vehicles found</td></tr>`;

    // Admin gets delete link
    if (ACCOUNT_TYPE === "Admin") {
      emptyActionsDiv.innerHTML = `
        <p>This classification has no vehicles.</p>
        <p>
          <a href="/inv/delete-classification/${classification_id}">
            Delete this classification
          </a>
        </p>
      `;
    }
    // Employees get nothing extra — table still shows
  }

  dataTable += '</tbody>'; 

  // Display table no matter what
  inventoryDisplay.innerHTML = dataTable; 
}