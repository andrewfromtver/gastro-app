// service functions
let guid = () => {
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
    let e = document.body.querySelector(`.${id}`).style.textDecoration
    if (e === 'line-through') e = ''
    else e = 'line-through'
}


const saveBtnListner = () => {
    document.querySelector('.save__toggle').classList = 'save__toggle list'
    let trigger = components.querySelectorAll('input').length
    if (trigger > 1) {
        if (!document.body.querySelector('.save')) {
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
    }
    else {
        if (document.body.querySelector('.save')) {
            document.body.querySelector('.save').remove()
        }
    }
}


// hidden app pages
const menuPage = (query = false) => {
    let result = []
    if (!query) result = database
    else {
        database.forEach(e => {
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
                Рецепты
            </h2>
        </div>
        <div class="searchbar-nav">
            <form onsubmit="menuPage(this.query.value)">
            <input name="query" type="text" required>
            <button>
                <img src="./assets/search.svg">
            </button>
            </form>
        </div>
    `
    let inner = '<div class="menu">'
    result.forEach(e => {
        inner += `
            <div 
                onclick="showItem(this.id)" 
                class="card menu-item animate__animated animate__zoomIn" 
                id="${e.id}"
            >
                <img class="img"src="${e.img}">
                <img 
                    id="${e.id}" 
                    class="like" 
                    onclick="likeUnlike(this.id)" 
                    src="./assets/like.svg"
                >
                <h3>${e.title}</h3>
                <p>${e.type}</p>
            </div>
        `
    })
    inner += '</div><br>'
    if (result.length === 0) {
        inner += `
            <div class="detail">
                <h3>¯\\_(ツ)_/¯</h3>
            </div>
        `
    }
    document.querySelector('.content').innerHTML = inner
    refreshLikeIcons()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}


const likedMenuPage = () => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    let items = []
    if (localStorage.getItem(`${username}_liked`)) {
        items = JSON.parse(localStorage.getItem(`${username}_liked`))
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
        <div>
            <button>
                <img src="./assets/search.svg">
            </button>
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
    if (items.length > 0) {
        items.forEach(e => {
            inner += `
                <tr>
                    <td 
                        id="${database[e -1].id}" 
                        onclick="showItem(this.id, 'liked')"
                    >
                        ${database[e - 1].title}
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


const likedListPage = () => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    let items = []
    if (localStorage.getItem(`${username}_shopping_list`)) {
        items = JSON.parse(
            localStorage.getItem(`${username}_shopping_list`)
        )
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
        <div>
            <button>
                <img src="./assets/search.svg">
            </button>
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
    if (items.length > 0) {
        items.forEach(e => {
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


// feedback
const sendFeedback = (username, description) => {
    event.preventDefault()
    fetch('https://api.telegram.org/bot' +
        '1070038475:AAHkzMK4T5bmMeFhR22aidxpFkwuzMlObgk/' +
        'sendMessage?chat_id=-1001490927690&text=' +
        `Имя => ${username} ` +
        `Рецепт => ${description}`)
        .then(e => {
            if (e.status === 200) {
                document.body.querySelector('.feedback').innerHTML = `
                    <h3>Спасибо за отклик</h3>
                    <p>
                        Мы получили Ваш рецепт, 
                        наши специалисты обязательно ознакомятся с ним и 
                        если такого рецепта не окажется в нашей базе, 
                        мы его с удовольствием опубликуем. Спасибо!
                    </p>
                `
            }
        })
}


// start script execution
let idbSupport = false
window.onload = () => {
    initDb()
    document.querySelector('body').style
        .backgroundImage = 'url(./assets/food.jpg)'
    if (localStorage.getItem('Session')) {
        let globalJson = JSON.parse(localStorage.getItem('Session'))
        initApp(globalJson)
        if (localStorage.getItem(String(globalJson.username))) {
            goShopping()
        }
    }
    else addUser()
}
