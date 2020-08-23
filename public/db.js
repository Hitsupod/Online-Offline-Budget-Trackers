const { response } = require("express");

let db;
// Creating the database
const request = indexDB.open("budget", 1);

// Create the object store
request.onupgradeneeded = function (event) {
    const db = event.target.reesult;
    db.createObjectStore("pending", {autoIncrement: true});
};

// Check online 
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        checkDataBase();
    }
};

// Log Error
request.onerror = function (event) {
    console.log(event.target.errorCode)
};

// Store Record
function storeRecord(record) {
    // Creating transaction on pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // Accessing the store
    const store = transaction.objectStore("pending");
    //Adding the record
    store.add(record);
}

function checkDataBase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    // Get and store all Records from store
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.json())
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                // Clear the store
                store.clear();
            })
        }
    }
}

// Listen for back online 
window.addEventListener("online", checkDataBase);
