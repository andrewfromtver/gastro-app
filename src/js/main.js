// assets import
import bgImg from '../assets/food.jpg'
import noAvatarImg from '../assets/no-avatar.png'
import addPhotoImg from '../assets/add-photo.svg'
import loginImg from '../assets/login.svg'

import searchImg from '../assets/search.svg'
import backImg from '../assets/back.svg'
import addToCartImg from '../assets/add-to-cart.svg'
import editImg from '../assets/edit.svg'
import sendImg from '../assets/send.svg'
import likeImg from '../assets/like.svg'

import homeImg from '../assets/home.svg'
import manageListImg from '../assets/manage-list.svg'
import useListImg from '../assets/use-list.svg'
import statImg from '../assets/stat.svg'
import personImg from '../assets/person.svg'

import menuImg from '../assets/1.gif'
import itemsImg from '../assets/2.gif'
import menuListImg from '../assets/3.gif'
import itemsListImg from '../assets/4.gif'


// css import
import '../css/style.css'
import '../css/main.css'
import '../css/login.css'
import '../css/animate.min.css'

// js import
import { database } from './database'
import { idbSupport, initDb, addUserToDb, getUserFromDb, delUserFromDb } from './idb.js'
import { sendFeedback, sendList } from './telegram_api.js'



// render wellcome page
const addUser = () => {
    let inner = `
        <div class="wellcome animate__animated animate__pulse">
            <h2>Gastro App</h2>
            <form id="userAdd">
                <label>Логин</label>
                <input 
                    type="text"
                    id="userName" 
                    name="username" 
                    maxlength="128" 
                    placeholder="Имя или псевдоним (не более 128 символов)"
                    required
                >
    `
    
    if (idbSupport) {
        inner += `
            <button 
                id="addAvatar"
                type="button"
            >
                <img src="${addPhotoImg}">
                <input
                    hidden
                    type="file" 
                    id="userPic" 
                    name="userpic" 
                    accept="image/*"
                >
            </button>
            <img id="photo" src="${noAvatarImg}" alt="userpic-preview">
        `
    }

    inner += `
                <button>
                    <img src="${loginImg}">
                </button>
            </form>
        </div>
    `
    document.querySelector('#gastro-app').innerHTML = inner
    userAdd.onsubmit = () => {
        event.preventDefault()
        initApp(
            {
                username: document.querySelector('input').value,
                useragent: window.navigator.userAgent || 'Not defined'
            }, 
            true
        )
    }
    userName.oninput = () => {
        checkImage(userName.value)
    }
    addAvatar.onclick = () => {
        userPic.click()
    }
    userPic.onchange = () => {
        previewFile()
    } 
}

// welcome page service functions
const checkImage = (username) => {
    if (idbSupport)  getUserFromDb(username, (data) => { 
        if (data[0]) {
            document.querySelector('#photo').src = data[0].userpic
        }
        else {
            document.querySelector('#photo').src = noAvatarImg
        }
        document.querySelector('input[type=file]').value = ''
    })
}
const previewFile = () => {
    let preview = document.querySelector('#photo')
    let file = document.querySelector('input[type=file]').files[0]
    let reader  = new FileReader()
    reader.onloadend = function () {
        preview.src = reader.result
    }
    if (file) {
        reader.readAsDataURL(file)
    } else {
        preview.src = ''
    }
    document.querySelector('input[type=file]').value = ''
}

// render tutorial page
const initApp = (data = false, userReg = false) => {
    let photo = noAvatarImg
    if (document.querySelector('#photo')) photo = document
        .querySelector('#photo').src
    let inner = ''
    let inner2 = ''
    let dbData = {
        username: data.username,
        userpic: photo,
        useragent: data.useragent
    }
    if (idbSupport) {
        if (userReg) delUserFromDb(data.username)
        addUserToDb(dbData)
    }
    if (data) {
        localStorage.setItem('Session', JSON.stringify(data))
        inner += `
            <nav>
                <div class="title">
                    <h2 class="animate__animated animate__slideInLeft">
                        Обучение
                    </h2>
                </div>
            </nav>
            <div class="content">
                <video 
                    controls 
                    autoplay 
                    id="tutorial" 
                    class="animate__animated animate__zoomIn"
                >
                    <source src="./tutorial.mp4" type="video/mp4">
                </video>
            </div>
            <footer></footer>
        `
        inner2 = `
            <button id="go-shopping">Все поняно, продолжим!</button>
        `
    }
    else {
        inner = `
            <h3>Внутренняя ошибка, пожалуйста перезагрузите приложениею</h3>
            <button id="logout">Перезагрузить</button>
        `
        console.error('Wrong UI init mode [can\'t load username].')
    }
    document.querySelector('#gastro-app').innerHTML = inner
    document.querySelector('footer').innerHTML = inner2
    if (data) {
        document.querySelector('#go-shopping').onclick = () => {
            goShopping()
        }   
    }
    let globalJson = JSON.parse(localStorage.getItem('Session'))
    if (localStorage.getItem(`${globalJson.username}_tutorial`)) {
        goShopping()
    }
}

// render navbar icons and main functions
const goShopping = () => {
    let globalJson = JSON.parse(localStorage.getItem('Session'))
    localStorage.setItem(
        `${globalJson.username}_tutorial`, 
        'Tutorial compleated'
    )
    let inner = `
        <img src="${homeImg}" id="home" alt="home">
        <img src="${manageListImg}" id="manage_list" alt="manage list">
        <img src="${useListImg}" id="use_list" alt="use list">
        <img src="${statImg}" id="stat" alt="stat">
        <img src="${personImg}" id="account" alt="account">
    `
    document.querySelector('.content').innerHTML = ''
    document.querySelector('footer').innerHTML = inner
    home.onclick = () => {
        homePage()
    }
    manage_list.onclick = () => {
        manageListPage()
    }
    use_list.onclick = () => {
        useListPage()
    }
    stat.onclick = () => {
        statPage()
    }
    account.onclick = () => {
        accountPage()
    }
    homePage()
    fetch('https://api.telegram.org/bot' +
        '5837458997:AAGRCm4-pih4NBvUrvTz4QN3Lv3MV7j8UR8' +
        '/sendMessage?parse_mod=html&chat_id=-1001838020997&text=' +
        `${encodeURIComponent('Username: ' + globalJson.username + ' \n')}` +
        `${encodeURIComponent('Useragent: ' + globalJson.useragent)}`)
}



// nav buttons
const homePage = () => {
    document.querySelector('body').style.backgroundImage = `url(${bgImg})`
    document.querySelector('nav').innerHTML = `
        <div stye="width: 100%;" class="title">
            <h2 style="width: calc(100vw - 32px); text-align: center;" class="animate__animated animate__slideInLeft">Gastro App</h2>
        </div>
    `
    let inner = `
        <div class="home animate__animated animate__zoomIn">
            <div class="searchbar">
                <form id="searchForm">
                    <input 
                        name="query"
                        id="searchQuery"
                        required
                        type="text" 
                        placeholder="Введите название рецепта"
                        maxlength="256"
                    >
                    <button>
                        <img src="${searchImg}">
                    </button>
                </form>
            </div>
            <div>
                <button id="menuPageBtn">
                    <img src="${menuImg}">
                    Список рецептов
                </button>
                <button id="useListPageBtn">
                    <img src="${itemsImg}">
                    Список покупок
                </button>
            </div>
            <div>
                <button id="likedMenuPageBtn">
                    <img src="${menuListImg}">
                    Избранные рецепты
                </button>
                <button id="likedListPageBtn">
                    <img src="${itemsListImg}">
                    Избранные покупки
                </button>
            </div>
        </div>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
    searchForm.onsubmit = () => {
        event.preventDefault()
        menuPage(searchQuery.value)
    }
    menuPageBtn.onclick = () => {
        menuPage()
    }
    useListPageBtn.onclick = () => {
        useListPage()
    }
    likedMenuPageBtn.onclick = () => {
        likedMenuPage()
    }
    likedListPageBtn.onclick = () => {
        likedListPage()
    }
}

// home page service functions
const menuPage = (query = false, tag = false) => {
    let result = []
    if (!query) result = database
    else {
        database.forEach(e => {
            if (e.title.toLowerCase().includes(query.toLowerCase())) {
                result.push(e)
            }
        })
    }
    document.querySelector('body').style.backgroundImage = `url(${bgImg})`
    let exec = homePage
    if (tag || query) exec = menuPage
    document.querySelector('nav').innerHTML = `
        <div class="title">
            <img 
                class="animate__animated animate__slideInLeft" 
                src="${backImg}" 
                id="backBtn"
            >
            <h2 class="animate__animated animate__slideInLeft">
                ${tag || 'Рецепты'}
            </h2>
        </div>
        <div class="searchbar-nav">
            <form id="searchForm2">
            <input maxlength="256" id="searchQuery" name="query" type="text">
            <button>
                <img src="${searchImg}">
            </button>
            </form>
        </div>
    `
    backBtn.onclick = () => {
        exec()
    }
    searchForm2.onsubmit = () => {
        event.preventDefault()
        menuPage(searchQuery.value)
    }
    let typesInner = ''
    let types = []
    let inner = '<div class="menu"><div class="types animate__animated animate__slideInLeft"></div>'
    let tagResult = []
    if (tag) {
        result.forEach(e => {
            if (e.type === tag) tagResult.push(e)
        })
        result = tagResult
    }
    result.forEach(e => {
        inner += `
            <div 
                onclick="showItem(this.id)" 
                class="card menu-item animate__animated animate__zoomIn" 
                id="${e.id}"
            >
                <img class="img"src="${e.img || './assets/no-image.png'}">
                <img 
                    id="${e.id}" 
                    class="like" 
                    onclick="likeUnlike(this.id)" 
                    src="${likeImg}"
                >
                <h3>${e.title}</h3>
                <p>${e.type}</p>
            </div>
        `
        types.push(e.type)
    })
    inner += '</div><br>'
    if (result.length === 0) {
        inner += `
            <div class="detail">
                <h3>¯\\_(ツ)_/¯</h3>
            </div>
        `
    }
    [... new Set(types)].forEach(e => {
        typesInner += `
            <div onclick="menuPage(false, this.innerText)">${e}</div>
        `
    })
    document.querySelector('.content').innerHTML = inner
    if (!query && !tag) document.querySelector('.types').innerHTML = typesInner
    if (query) document.querySelector('input').value = query
    refreshLikeIcons()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}















const manageListPage = (components = false) => {
    let items = []
    let username = JSON.parse(localStorage.getItem('Session')).username
    if (sessionStorage.getItem(`${username}_list`)) {
        items = JSON.parse(sessionStorage.getItem(`${username}_list`))
    }
    if (components) {
        components.querySelectorAll('li').forEach (e => {
            items.push(e.innerText)
        })
    }
    let uniqueItems = [...new Set(items)]
    sessionStorage.setItem(`${username}_list`, JSON.stringify(items))
    document.querySelector('body').style.backgroundImage = `url(${bgImg})`
    document.querySelector('nav').innerHTML = `
        <div class="title">
            <img class="animate__animated animate__slideInLeft" src="${backImg}" onclick="homePage()">
            <h2 class="animate__animated animate__slideInLeft">Список</h2>
        </div>
    `
    let inner = `<div class="list save__toggle animate__animated animate__zoomIn"><table><thead><th class="clear"><h3>Редактировать список</h3></th></thead><tbody id="components">`
    uniqueItems.forEach(e => {
        let id = guid()
        inner += `
            <tr class="${id}">
                <td>
                    <input maxlength="256" oninput="editItem()" type="text" value="${e}">
                </td>
                <td id="${id}" class="dell" onclick="delItem(this.id)">
                    <img src="./assets/delete.svg">
                </td>
            </tr>
        `
    })
    inner += `
            </tbody>
            </table>
            <div>
                <button>
                    <img onclick="addItem()" src="${addToCartImg}">
                </button>
            </div>
        </div>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout( () => {saveBtnListner()}, 750)
}













const useListPage = () => {
    document.querySelector('body').style.backgroundImage = `url(${bgImg})`
    document.querySelector('nav').innerHTML = `
        <div class="title">
            <img class="animate__animated animate__slideInLeft" src="${backImg}" onclick="homePage()">
            <h2 class="animate__animated animate__slideInLeft">Покупки</h2>
        </div>
    `
    let items = []
    let username = JSON.parse(localStorage.getItem('Session')).username
    if (sessionStorage.getItem(`${username}_list`)) {
        items = JSON.parse(sessionStorage.getItem(`${username}_list`))
    }
    let uniqueItems = [...new Set(items)]
    let inner = `
        <div class="list animate__animated animate__zoomIn">
            <table>
                <thead>
                    <th>
                        <h3>Что нужно купить</h3>
                    </th>
                </thead>
                <tbody id="components">`
    uniqueItems.forEach(e => {
        let id = guid()
        inner += `
                    <tr class="${id}">
                        <td id="${id}" onclick="checkUncheck(this.id)">
                            ${e}
                        </td>
                    </tr>
        `
    })
    inner += `
                </tbody>
            </table>
            <div>
                <button>
                    <img onclick="manageListPage()" src="${editImg}">
                </button>
            </div>
        </div>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
}























const statPage = () => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    document.querySelector('body').style.backgroundImage = `url(${bgImg})`
    document.querySelector('nav').innerHTML = `
        <div class="title">
            <img class="animate__animated animate__slideInLeft" src="${backImg}" onclick="homePage()">
            <h2 class="animate__animated animate__slideInLeft">Статистика</h2>
        </div>
    `
    let menuItemsQty = database.length
    let likedMenuItemsQty = 0
    if (localStorage.getItem(`${username}_liked`)) likedMenuItemsQty = JSON.parse(localStorage.getItem(`${username}_liked`)).length 
    let likedListsQty = 0
    if (localStorage.getItem(`${username}_shopping_list`)) likedListsQty = JSON.parse(localStorage.getItem(`${username}_shopping_list`)).length 
    let itemsInCurrentList = 0
    if (sessionStorage.getItem(`${username}_list`)) itemsInCurrentList = JSON.parse(sessionStorage.getItem(`${username}_list`)).length 
    let inner = `
        <div class="counters animate__animated animate__zoomIn">
            <div>
                <h2>${menuItemsQty}</h2>
                <h3>блюд</h3>
                <p>В базе рецептов</p>
            </div>
            <div>
                <h2>${likedMenuItemsQty}</h2> 
                <h3>рецептов</h3>       
                <p>Вам понравилось</p>
            </div>
        </div>
        <div class="counters animate__animated animate__zoomIn">
            <div>
                <h2>${likedListsQty}</h2>
                <h3>списков</h3>
                <p>Покупок сохоанено</p>
            </div>
            <div>
                <h2>${itemsInCurrentList}</h2>
                <h3>товаров</h3>
                <p>В текущем списке</p>
            </div>
        </div>
        <form onsubmit="sendFeedback(this.name.value, this.description.value)" class="feedback animate__animated animate__zoomIn" id="feedback">
            <h3>Отправьте нам Ваш рецепт</h3>
            <label>Вашe имя или псевдоним</label>
            <input placeholder="Мы укажем это значение в графе 'Автор рецепта'" maxlength="256" name="name" type="text" required>
            <label>Ваш рецепт</label>
            <textarea 
                placeholder="Укажите ингридиенты и способ приготовления (не более 1024 символов)"
                name="description" 
                rows="6" 
                maxlength="1024" 
                required
            ></textarea>
            <button>
                <img src="${sendImg}">
            </button>
        </form>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
}























const accountPage = () => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    document.querySelector('body').style.backgroundImage = 'url(./assets/food.jpg)'
    document.querySelector('nav').innerHTML = `
        <div class="title">
            <img class="animate__animated animate__slideInLeft" src="./assets/back.svg" onclick="homePage()">
            <h2 class="animate__animated animate__slideInLeft">Аккаунт</h2>
        </div>
    `
    let menuItemsQty = database.length
    let likedMenuItemsQty = 0
    if (localStorage.getItem(`${username}_liked`)) likedMenuItemsQty = JSON.parse(localStorage.getItem(`${username}_liked`)).length 
    let likedListsQty = 0
    if (localStorage.getItem(`${username}_shopping_list`)) likedListsQty = JSON.parse(localStorage.getItem(`${username}_shopping_list`)).length 
    let itemsInCurrentList = 0
    if (sessionStorage.getItem(`${username}_list`)) itemsInCurrentList = JSON.parse(sessionStorage.getItem(`${username}_list`)).length 
    let inner = `
        <div class="detail animate__animated animate__zoomIn">
            <img class="user-photo">
            <h3 style="margin: 8px 4px 0 4px;" id="username">${username}</h3>
            <div class="chat-id">
                <label>Telegram chat ID</label>
                <input placeholder="Укажите Telegram chat ID" type="text" id="chat-id" oninput="saveId(this.value)">
            </div>
        </div>
        <div class="detail animate__animated animate__zoomIn">
            <button onclick="logout()" id="logout">
                <img src="./assets/logout.svg">
            </button>
        </div>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    if (localStorage.getItem('Session') && idbSupport) {
        getUserFromDb(username, (data) => {
            document.body.querySelector('.user-photo').src = data[0].userpic
        })
    }

    if (localStorage.getItem(`${username}_chatId`)) {
        document.querySelector('#chat-id').value = localStorage.getItem(`${username}_chatId`)
    }
}

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
    let uniqueItems = [...new Set(items)]
    sessionStorage.setItem(`${username}_list`, JSON.stringify(uniqueItems))
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
                    <input 
                        oninput="editItem()" 
                        type="text" 
                        value="${e}"
                        maxlength="256"
                    >
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
                <input 
                    oninput="editItem()" 
                    type="text"
                    maxlength="256"
                >
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
    let uniqueItems = [...new Set(items)]
    sessionStorage.setItem(`${username}_list`, JSON.stringify(uniqueItems))
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
            <img class="user-photo" src="${e.img || './assets/no-image.png'}">
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
const clearAllItems = () => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    let uniqueItems = []
    sessionStorage.setItem(`${username}_list`, JSON.stringify(uniqueItems))
    manageListPage()
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

// service functions


const logout = () => {
    localStorage.removeItem('Session')
    window.location.reload()
}
export let guid = () => {
    let length = 32
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
        result += characters
            .charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
const checkUncheck = (id) => {
    if (document.body.querySelector(`.${id}`).style.textDecoration === 'line-through') document.body.querySelector(`.${id}`).style.textDecoration = ''
    else document.body.querySelector(`.${id}`).style.textDecoration = 'line-through'
}
const saveBtnListner = () => {
    let shareInner = `
        <div class="searchbar-nav">
            <button>
                <img 
                    src="./assets/share.svg"
                    onclick="sendList()"
                >
            </button>
            </form>
        </div>
    `
    document.querySelector('.save__toggle').classList = 'save__toggle list'
    let trigger = components.querySelectorAll('input').length
    if (trigger > 1) {
        if (!document.body.querySelector('.save')) {
            document.querySelector('nav').innerHTML += shareInner
            document.querySelector('.content').innerHTML += `
                <div class="save list animate__animated animate__zoomIn">
                    <div>
                        <form id="saveList" onsubmit="saveList()">
                        <div>
                            <input 
                                placeholder="Введите название для этого списка"
                                type="text" 
                                id="listName" 
                                required
                                maxlength="256"
                            >
                        </div>
                        <button>
                            <img src="./assets/save.svg">
                        </button>
                        </form>
                    </div>
                </div>
            `
        }
        if (!document.body.querySelector('.clear__btn')) {
            let clearBtn = `
                <img class="clear__btn" onclick="clearAllItems()" src="./assets/clear.svg">
            `
            document.body.querySelector('.clear').innerHTML += clearBtn
        }
    }
    else {
        if (document.body.querySelector('.save')) {
            document.body.querySelector('.save').remove()
        }
        if (document.body.querySelector('.clear__btn')) {
            document.body.querySelector('.clear__btn').remove()
        }
        if (document.body.querySelector('.searchbar-nav')) {
            document.body.querySelector('.searchbar-nav').remove()
        }
    }
}
const saveId = (id) => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    
    localStorage.setItem(`${username}_chatId`, id)
} 




// hidden app pages

const likedMenuPage = (query = false) => {
    event.preventDefault()
    let username = JSON.parse(localStorage.getItem('Session')).username
    let items = []
    if (localStorage.getItem(`${username}_liked`)) {
        items = JSON.parse(localStorage.getItem(`${username}_liked`))
    }
    let result = []
    if (!query) result = items
    else {
        items.forEach(el => {
            database.forEach(e => {
                if (e.id == el && e.title.toLowerCase().includes(query.toLowerCase())
                ) {
                    result.push(e.id)
                }
            })
        })
    }
    document.querySelector('body').style
        .backgroundImage = 'url(./assets/food.jpg)'
    document.querySelector('nav').innerHTML = `
        <div class="title">
            <img 
                class="animate__animated animate__slideInLeft" 
                src="./assets/back.svg" 
                onclick="homePage()"
            >
            <h2 class="animate__animated animate__slideInLeft">
                Избранное
            </h2>
        </div>
        <div class="searchbar-nav">
            <form onsubmit="likedMenuPage(this.query.value)">
            <input maxlength="256" name="query" type="text" required>
            <button>
                <img src="./assets/search.svg">
            </button>
            </form>
        </div>
    `
    let inner = `
        <div class="list animate__animated animate__zoomIn">
            <table>
                <thead>
                    <th>
                        <h3>Рецепты</h3>
                    </th>
                </thead>
                <tbody id="components">`
    if (result.length > 0) {
        result.forEach(e => {
            let obj = {}
            database.forEach(el => {
                if (el.id == e) obj = el
            })
            inner += `
                <tr>
                    <td 
                        id="${obj.id}" 
                        onclick="showItem(this.id, 'liked')"
                    >
                        ${obj.title}
                    </td>
                </tr>
            `
        })
    }
    else {
        inner += `
            <tr>
                <td style="text-align: center;">¯\\_(ツ)_/¯</td>
            </tr>
        `
    }
    inner += `
                </tbody>
            </table>
            <div>
                <button onclick="menuPage()">
                    <img src="./assets/edit.svg">
                </button>
            </div>
        </div>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
const likedListPage = (query = false) => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    let items = []
    if (localStorage.getItem(`${username}_shopping_list`)) {
        items = JSON.parse(
            localStorage.getItem(`${username}_shopping_list`)
        )
    }
    let result = []
    if (!query) result = items
    else {
        items.forEach(e => {
            if (e.title.toLowerCase().includes(query.toLowerCase())) {
                result.push(e)
            }
        })
    }
    document.querySelector('body').style
        .backgroundImage = 'url(./assets/food.jpg)'
    document.querySelector('nav').innerHTML = `
        <div class="title">
            <img 
                class="animate__animated animate__slideInLeft" 
                src="./assets/back.svg" 
                onclick="homePage()"
            >
            <h2 class="animate__animated animate__slideInLeft">
                Избранное
            </h2>
        </div>
        <div class="searchbar-nav">
            <form onsubmit="likedListPage(this.query.value)">
            <input maxlength="256" name="query" type="text" required>
            <button>
                <img src="./assets/search.svg">
            </button>
            </form>
        </div>
    `
    let inner = `
        <div class="list animate__animated animate__zoomIn">
            <table>
                <thead>
                    <th>
                        <h3>Списки покупок</h3>
                    </th>
                </thead>
                <tbody id="components">`
    if (result.length > 0) {
        result.forEach(e => {
            inner += `
                <tr class="${e.id}">
                    <td id="${e.id}" onclick="useList(this.id)">
                        ${e.title}
                    </td>
                    <td 
                        id="${e.id}" 
                        class="dell" 
                        onclick="delList(this.id)"
                    >
                        <img src="./assets/delete.svg">
                    </td>
                </tr>
            `
        })
    }
    else {
        inner += `
            <tr>
                <td style="text-align: center;">¯\\_(ツ)_/¯</td>
            </tr>
        `
    }
    inner += `
                </tbody>
            </table>
            <div>
                <button onclick="manageListPage()">
                    <img src="./assets/edit.svg">
                </button>
            </div>
        </div>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// start script execution
window.onload = () => {
    initDb()
    document.querySelector('body').style
        .backgroundImage = `url(${bgImg})`
    if (localStorage.getItem('Session')) {
        let globalJson = JSON.parse(localStorage.getItem('Session'))
        initApp(globalJson)
        if (localStorage.getItem(String(globalJson.username))) {
            goShopping()
        }
    }
    else addUser()
}
