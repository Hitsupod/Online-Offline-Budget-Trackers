let db;
// Creating the database
const request = indexDB.open("budget", 1);

// Create the object store
request.onupgradeneeded = (event) => {
    const db = event.target.reesult;
    db.createObjectStore("pending", {autoIncrement: true});
};

// Check online 
request.onsuccess = (event) => {
    db = event.target.result;
    if (navigator.onLine) {
        checkDataBase();
    }
};

// Log Error
request.onerror = (event) => {
    console.log(event.target.errorCode)
};