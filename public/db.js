const dbName = "transactionDB";
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;

var request = indexedDB.open(dbName, 2);

request.onerror = function (event) {
  console.log(event.target.errorCode, "ON ERROR OCCURRED");
};

request.onsuccess = function (event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onupgradeneeded = function (event) {
  db = event.target.result;

  db.createObjectStore("pending", { autoIncrement: true });
};

function saveRecord(record) {
  var transaction = db.transaction(["pending"], "readwrite");
  var store = transaction.objectStore("pending");

  store.add(record);
}

function checkDatabase() {
  var transaction = db.transaction(["pending"], "readwrite");
  var store = transaction.objectStore("pending");

  var results = store.getAll();

  results.onsuccess = function () {
    console.log(results);
    if (results.result.length === 0) {
      return;
    }

    fetch("/api/transaction/bulk", {
      method: "POST",
      body: JSON.stringify(results.result),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    })
      .then(() => {
        var transaction = db.transaction(["pending"], "readwrite");
        var store = transaction.objectStore("pending");
        store.clear();
      })
      .catch((err) => {
        console.error(err);
      });
  };
}

window.addEventListener("online", checkDatabase);
