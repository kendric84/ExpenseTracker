let expenseCategory = document.getElementById("category");
let expenseLocation = document.getElementById("location");
let expenseAmount = document.getElementById("amount");
let expenseDate = document.getElementById("date");
let expenseDescription = document.getElementById("description");
let dataSource = "user";
let dataSet = [];
let categoryOptions = [];
let locationOptions = [];
let localData = [];

document.addEventListener("DOMContentLoaded", pullData(), refreshTable());

function pushNewItem() {
  let idMax = 0;
  let newItem = [];
  dataSource = "user";
  idMax =
    Object.keys(localStorage).length === 0
      ? 0
      : Math.max.apply({}, Object.keys(localStorage)) + 1;
  newItem.push(idMax);
  newItem.push(expenseCategory.value);
  newItem.push(expenseLocation.value);
  newItem.push(expenseAmount.value);
  newItem.push(expenseDate.value);
  newItem.push(expenseDescription.value);
  newItem.push("X");
  localStorage.setItem(idMax, JSON.stringify(newItem));
  pullData();
  refreshTable();
}

function refreshOptions() {
  categoryOptions = [];
  locationOptions = [];
  for (let i = 0; i < dataSet.length; i++) {
    categoryOptions.push(dataSet[i][1]);
    locationOptions.push(dataSet[i][2]);
  }

  categoryOptions.sort();
  locationOptions.sort();
  categoryOptions = [...new Set(categoryOptions)];
  locationOptions = [...new Set(locationOptions)];

  let dl = document.getElementById("category-options");
  while (dl.hasChildNodes()) {
    dl.removeChild(dl.childNodes[0]);
  }
  for (let i = 0; i < categoryOptions.length; i++) {
    let op = document.createElement("option");
    op.value = categoryOptions[i];
    dl.appendChild(op);
  }

  dl = document.getElementById("location-options");
  while (dl.hasChildNodes()) {
    dl.removeChild(dl.childNodes[0]);
  }
  for (let i = 0; i < locationOptions.length; i++) {
    let op = document.createElement("option");
    op.value = locationOptions[i];
    dl.appendChild(op);
  }
}

function pullData() {
  if (dataSource === "user") {
    localData = [];
    let keys = Object.keys(localStorage);
    let i = keys.length;
    while (i--) {
      localData.push(JSON.parse(localStorage.getItem(keys[i])));
    }
    dataSet = localData;
  } else {
    dataSet = sampleData;
  }
}

function refreshTable() {
  let tableRows = document.getElementsByClassName("table-detail-rows");
  while (tableRows[0]) {
    tableRows[0].parentElement.removeChild(tableRows[0]);
  }
  let table = document.getElementById("expense-table");
  for (let i = 0; i < dataSet.length; i++) {
    let tr = document.createElement("tr");
    tr.className = "table-detail-rows";
    tr.id = i;
    table.appendChild(tr);
    let newTableRow = document.getElementById(i);
    let rowData = dataSet[i];
    for (let j = 0; j < rowData.length; j++) {
      let td = document.createElement("td");
      let column = "";
      switch (j) {
        case 0:
          column = "id-column";
          break;
        case 1:
          column = "category-column";
          break;
        case 2:
          column = "location-column";
          break;
        case 3:
          column = "amount-column";
          break;
        case 4:
          column = "date-column";
          break;
        case 5:
          column = "description-column";
          break;
        case 6:
          column = "remove-column";
          td.id = i;
          break;
      }
      td.className = "table-detail " + column;
      td.textContent = rowData[j];
      newTableRow.appendChild(td);
    }
  }
  setRemoveRowsClick();
  setMouseOver();
  refreshOptions();
}

document.getElementById("add-button").addEventListener("click", function () {
  pushNewItem();
  expenseCategory.value = "";
  expenseLocation.value = "";
  expenseAmount.value = "";
  expenseDate.value = "";
  expenseDescription.value = "";
});

document.getElementById("clear-button").addEventListener("click", function () {
  if (dataButton.value === "Load Sample Data") {
    localStorage.clear();
    dataSource = "user";
    localData = [];
    dataSet = localData;
  } else {
    dataSet = [];
  }
  refreshTable();
});

let dataButton = document.getElementById("sample-data-button");
dataButton.addEventListener("click", function () {
  if (dataButton.value === "Load Sample Data") {
    dataButton.value = "Load User Data";
    dataSource = "sample";
    dataSet = sampleData;
    refreshTable();
  } else {
    dataButton.value = "Load Sample Data";
    dataSource = "user";
    dataSet = localData;
    refreshTable();
  }
});

function setRemoveRowsClick() {
  let removeColumn = document.getElementsByClassName("remove-column");
  for (let i = 0; i < removeColumn.length; i++) {
    removeColumn[i].addEventListener("click", function () {
      if (dataSource === "user") {
        localStorage.removeItem(i);
        pullData();
      } else if (dataSource === "sample") {
        sampleData.splice(i, 1);
      }
      refreshTable();
      setMouseOver();
    });
  }
}

function setMouseOver() {
  let highlightRow = document.getElementsByClassName("table-detail-rows");
  for (let i = 0; i < highlightRow.length; i++) {
    document.getElementById(highlightRow[i].id).onmouseover = function () {
      highlightRow[i].setAttribute("style", "background-color:lightskyblue;");
    };
    document.getElementById(highlightRow[i].id).onmouseout = function () {
      highlightRow[i].setAttribute("style", "background-color:;");
    };
  }
}

//Table sorting
let lastSort = "ascending";
let columnNumber = 0;
let headers = document.getElementsByClassName("table-header");
for (let i = 0; i < headers.length; i++) {
  headers[i].addEventListener("click", function () {
    switch (this.id) {
      case "id-header":
        columnNumber = 0;
        break;
      case "category-header":
        columnNumber = 1;
        break;
      case "location-header":
        columnNumber = 2;
        break;
      case "amount-header":
        columnNumber = 3;
        break;
      case "date-header":
        columnNumber = 4;
        break;
      case "description-header":
        columnNumber = 5;
        break;
    }
    if (columnNumber === 0 || columnNumber === 3) {
      if (lastSort === "descending") {
        dataSet.sort(function (a, b) {
          return a[columnNumber] - b[columnNumber];
        });
        lastSort = "ascending";
        refreshTable();
      } else {
        dataSet.sort(function (a, b) {
          return b[columnNumber] - a[columnNumber];
        });
        lastSort = "descending";
        refreshTable();
      }
    } else {
      if (lastSort === "descending") {
        dataSet.sort(function (a, b) {
          if (a[columnNumber] < b[columnNumber]) {
            return -1;
          }
          if (a[columnNumber] > b[columnNumber]) {
            return 1;
          }
          return 0;
        });
        lastSort = "ascending";
        refreshTable();
      } else {
        dataSet.sort(function (a, b) {
          if (a[columnNumber] > b[columnNumber]) {
            return -1;
          }
          if (a[columnNumber] < b[columnNumber]) {
            return 1;
          }
          return 0;
        });
        lastSort = "descending";
        refreshTable();
      }
    }
  });
}
