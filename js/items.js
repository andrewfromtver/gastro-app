// items processing
const delItem = (id) => {
    document.body.querySelector(`.${id}`).remove()
    let items = []
    if (components) {
        components.querySelectorAll('input').forEach (e => {
            items.push(e.value)
        })
    }
    let username = JSON.parse(localStorage.getItem('Session')).username
    sessionStorage.setItem(`${username}_list`, JSON.stringify(items))
    saveBtnListner()
}


const addItem = () => {
    components.innerHTML = ''
    let id = guid()
    let inner = ''
    let items = []
    let username = JSON.parse(localStorage.getItem('Session')).username
    if (sessionStorage.getItem(`${username}_list`)) {
        items = JSON.parse(sessionStorage.getItem(`${username}_list`))
    }
    items.forEach(e => {
        let id = guid()
        inner += `
            <tr class="${id}">
                <td>
                    <input oninput="editItem()" type="text" value="${e}">
                </td>
                <td id="${id}" class="dell" onclick="delItem(this.id)">
                    <img src="./assets/delete.svg">
                </td>
            </tr>
        `
    })
    inner += `
        <tr class="${id}">
            <td>
                <input oninput="editItem()" type="text">
            </td>
            <td id="${id}" class="dell" onclick="delItem(this.id)">
                <img src="./assets/delete.svg">
            </td>
        </tr>
    `
    components.innerHTML +=inner
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    saveBtnListner()
}


const editItem = () => {
    let items = []
    if (components) {
        components.querySelectorAll('input').forEach (e => {
            items.push(e.value)
        })
    }
    let username = JSON.parse(localStorage.getItem('Session')).username
    sessionStorage.setItem(`${username}_list`, JSON.stringify(items))
}


const showItem = (id, backTo = 'menu') => {
    let e = {}
    database.forEach(el => {
        if (el.id == id) e = el
    })
    let components = ''
    e.components.forEach(e => {
        components += `
            <li>${e}</li>
        `
    })
    let instruction = ''
    e.instruction.forEach(e => {
        instruction += `
            <p>${e}</p>
        `
    })
    let calories = ''
    e.calories.forEach(e => {
        calories += `
            <li>${e}</li>
        `
    })
    let inner = `
        <div class="detail animate__animated animate__zoomIn" id="${e.id}">
            <h2>${e.title}</h2>
            <p>${e.description}</p>
            <h3>Ингридиенты</h3>
            <ul id="components">
                ${components}
            </ul>
            <div>
                <button onclick="manageListPage(components)">
                    <img src="./assets/add.svg">
                </button>
            </div>
            <h3>Как приготовить</h3>
            <div>
                ${instruction}
            </div>
            <h3>Калорийность</h3>
            <ul>
                ${calories}
            </ul>
    `
    if (backTo === 'menu') {
        inner += `
                <div>
                    <button onclick="menuPage()">
                        <img src="./assets/undo.svg">
                    </button>
                </div>
            </div>
        `
    }
    else if (backTo === 'liked') {
        inner += `
                <div>
                    <button onclick="likedMenuPage()">
                        <img src="./assets/undo.svg">
                    </button>
                </div>
            </div>
        `
    }
    else {
        inner += `
            </div>
        `
    }
    document.querySelector('.content').innerHTML = inner
    let execOption = 'menuPage()'
    if (backTo === 'menu') execOption = 'menuPage()'
    else if (backTo === 'liked') execOption = 'likedMenuPage()'
    document.querySelector('nav').innerHTML = `
        <div class="title">
        <img 
            class="animate__animated animate__slideInLeft" 
            src="./assets/back.svg" 
            onclick="${execOption}"
        >
            <h2 class="animate__animated animate__slideInLeft">Детали</h2>
        </div>
    `
    document.querySelector('body').style.backgroundImage = `url(${e.img})`
    window.scrollTo({ top: 0, behavior: 'smooth' })
}


// liked items processing
const likeUnlike = (id) => {
    if (!e) var e = window.event
    e.cancelBubble = true
    if (e.stopPropagation) e.stopPropagation()
    
    let username = JSON.parse(localStorage.getItem('Session')).username
    let items = []
    if (localStorage.getItem(`${username}_liked`)) {
        items = JSON.parse(localStorage.getItem(`${username}_liked`))
    }
    if (items.includes(id)) {
        const i = items.indexOf(id)
        if (i > -1) {
            items.splice(i, 1)
        }
    }
    else {
        items.push(id)
    }
    localStorage.setItem(`${username}_liked`, JSON.stringify(items))
    refreshLikeIcons()
}


const refreshLikeIcons = () => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    let items = []
    if (localStorage.getItem(`${username}_liked`)) {
        items = JSON.parse(localStorage.getItem(`${username}_liked`))
    }
    let icons = document.body.querySelectorAll('img.like')
    icons.forEach(e => {
        if (items.includes(e.id)) e.style.opacity = '1'
        else e.style.opacity = '0.2'
    })
}


// lists processing
const saveList = () => {
    event.preventDefault()
    let username = JSON.parse(localStorage.getItem('Session')).username
    let shoppingList = []
    if (localStorage.getItem(`${username}_shopping_list`)) {
        shoppingList = JSON.parse(
            localStorage.getItem(`${username}_shopping_list`)
        )
    }
    let items = []
    if (components) {
        components.querySelectorAll('input').forEach(e => {
            items.push(e.value)
        })
    }
    let list = {
        id: guid(),
        title: document.querySelector('#listName').value,
        list: items
    }
    if (document.body.querySelector('.save')) {
        document.body.querySelector('.save').remove()
    }
    shoppingList.push(list)
    localStorage.setItem(
        `${username}_shopping_list`, 
        JSON.stringify(shoppingList)
    )
}


const useList = (id) => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    let items = []
    let shoppingList = []
    if (localStorage.getItem(`${username}_shopping_list`)) {
        shoppingList = JSON.parse(
            localStorage.getItem(`${username}_shopping_list`)
        )
    }
    shoppingList.forEach(e => {
        if (e.id === id) {
            items = e.list
        }
    })
    sessionStorage.setItem(`${username}_list`, JSON.stringify(items))
    useListPage()
}


const delList = (id) => {
    document.body.querySelector(`.${id}`).remove()

    let username = JSON.parse(localStorage.getItem('Session')).username
    let shoppingList = []
    if (localStorage.getItem(`${username}_shopping_list`)) {
        shoppingList = JSON.parse(
            localStorage.getItem(`${username}_shopping_list`)
        )
    }
    let newArray = []
    shoppingList.forEach(e => {
        if (e.id !== id) newArray.push(e) 
    })
    localStorage.setItem(
        `${username}_shopping_list`, 
        JSON.stringify(newArray)
    )
}
