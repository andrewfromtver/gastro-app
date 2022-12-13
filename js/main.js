// service functions
let guid = () => {
    let length = 32
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}
const checkUncheck = (id) => {
    if (document.body.querySelector(`.${id}`).style.textDecoration === 'line-through') document.body.querySelector(`.${id}`).style.textDecoration = ''
    else document.body.querySelector(`.${id}`).style.textDecoration = 'line-through'
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
const homePage = () => {
    document.querySelector('body').style.backgroundImage = 'url(./assets/food.jpg)'
    document.querySelector('.title').innerHTML = `
        <h2 class="animate__animated animate__slideInLeft">Gastro App</h2>
    `
    let inner = `
        <div class="home animate__animated animate__zoomIn">
            <div>
                <button onclick="menuPage()">
                    <img src="./assets/1.gif">
                    Список рецептов
                </button>
                <button onclick="useListPage()">
                    <img src="./assets/2.gif">
                    Список покупок
                </button>
            </div>
            <div>
                <button onclick="likedMenuPage()">
                    <img src="./assets/3.gif">
                    Избранные рецепты
                </button>
                <button onclick="likedListPage()">
                    <img src="./assets/4.gif">
                    Избранные покупки
                </button>
            </div>
        </div>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
const likedMenuPage = () => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    let items = []
    if (localStorage.getItem(`${username}_liked`)) {
        items = JSON.parse(localStorage.getItem(`${username}_liked`))
    }
    document.querySelector('body').style.backgroundImage = 'url(./assets/food.jpg)'
    document.querySelector('.title').innerHTML = `
        <h2 class="animate__animated animate__slideInLeft">Избранное</h2>
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
                            <td id="${database[e -1].id}" onclick="showItem(this.id, 'liked')">
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
        items = JSON.parse(localStorage.getItem(`${username}_shopping_list`))
    }
    document.querySelector('body').style.backgroundImage = 'url(./assets/food.jpg)'
    document.querySelector('.title').innerHTML = `
        <h2 class="animate__animated animate__slideInLeft">Избранное</h2>
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
                            <td id="${e.id}" class="dell" onclick="delList(this.id)">
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
    document.querySelector('body').style.backgroundImage = 'url(./assets/food.jpg)'
    if (localStorage.getItem('Session')) {
        let globalJson = JSON.parse(localStorage.getItem('Session'))
        initApp(globalJson)
        if (localStorage.getItem(String(globalJson.username))) {
            goShopping()
        }
    }
    else addUser()
}
