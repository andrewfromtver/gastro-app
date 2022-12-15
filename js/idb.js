// indexed DB
const initDb = () => {
    if (('indexedDB' in window)) {
        const dbName = "gastro-app"
        const request = indexedDB.open(dbName, 1)
        request.onerror = (e) => {
            console.error(e)
        }
        request.onupgradeneeded = (event) => {
            const db = event.target.result
            const objectStore = db.createObjectStore("users", {
                keyPath: "username"
            })
            objectStore.createIndex("users_idx", "username", {
                unique: true
            })
        }
        idbSupport = true
    }
    else idbSupport = false
}


const addUserToDb = (userData) => {
    const dbName = "gastro-app"
    const request = indexedDB.open(dbName, 1)
    request.onerror = (e) => {
        console.error(e)
    }
    request.onsuccess = (event) => {
        const db = event.target.result
        const customerObjectStore = db
            .transaction("users", "readwrite").objectStore("users")
        customerObjectStore.add(userData)
    }
}


const getUserFromDb = (
        username, 
        callback = (result) => {console.log(result[0])}
    ) => {
    const dbName = "gastro-app"
    const request = indexedDB.open(dbName, 1)
    request.onerror = (e) => {
        console.error(e)
    }
    request.onsuccess = (event) => {
        const db = event.target.result
        let usersIndex = db
            .transaction("users").objectStore("users").index("users_idx")
        let request = usersIndex.getAll(username);
        request.onsuccess = function() {
            if (request.result) {
                callback(request.result)
            }
            else callback([])
        }
    }
}


const delUserFromDb = (username) => {
    const dbName = "gastro-app"
    const request = indexedDB.open(dbName, 1)
    request.onerror = (e) => {
      console.error(e)
    }
    request.onsuccess = (event) => {
        const db = event.target.result
        let users = db
            .transaction("users", "readwrite").objectStore("users")
        let usersIndex = users.index("users_idx")
        let request = usersIndex.getKey(username);
        request.onsuccess = function() {
            if (request.result) {
                let id = request.result
                let deleteRequest = users.delete(id)
            }
        }
    }
}
