// nav buttons
const menuPage = () => {
    document.querySelector('body').style.backgroundImage = 'url(./assets/food.jpg)'
    document.querySelector('.title').innerHTML = `
        <h2 class="animate__animated animate__slideInLeft">Рецепты</h2>
    `
    let inner = ''
    database.forEach(e => {
        inner += `
            <div onclick="showItem(this.id)" class="card animate__animated animate__zoomIn" id="${e.id}">
                <img class="img"src="${e.img}">
                <img id="${e.id}" class="like" onclick="likeUnlike(this.id)" src="./assets/like.svg">
                <h3>${e.title}</h3>
                <p>${e.type}</p>
            </div>
        `
    })
    document.querySelector('.content').innerHTML = inner
    refreshLikeIcons()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
const manageListPage = (components = false) => {
    let items = []
    let username = JSON.parse(localStorage.getItem('Session')).username
    if (components) {
        components.querySelectorAll('li').forEach (e => {
            items.push(e.innerText)
        })
    }
    else {
        if (sessionStorage.getItem(`${username}_list`)) {
            items = JSON.parse(sessionStorage.getItem(`${username}_list`))
        }
    }
    sessionStorage.setItem(`${username}_list`, JSON.stringify(items))
    
    document.querySelector('body').style.backgroundImage = `url('./assets/bg.jpg')`
    document.querySelector('.title').innerHTML = `
        <h2 class="animate__animated animate__slideInLeft">Список</h2>
    `
    let inner = '<div class="list save__toggle animate__animated animate__zoomIn"><table><thead><th><h3>Редактировать список</h3></th></thead><tbody id="components">'
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
            </tbody>
            </table>
            <div>
                <button>
                    <img onclick="addItem()"src="./assets/add_to_cart.svg">
                </button>
            </div>
        </div>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    setTimeout( () => {saveBtnListner()}, 750)
}
const useListPage = () => {
    document.querySelector('body').style.backgroundImage = `url('./assets/bg.jpg')`
    document.querySelector('.title').innerHTML = `
        <h2 class="animate__animated animate__slideInLeft">Покупки</h2>
    `
    let items = []
    let username = JSON.parse(localStorage.getItem('Session')).username
    if (sessionStorage.getItem(`${username}_list`)) {
        items = JSON.parse(sessionStorage.getItem(`${username}_list`))
    }
    let inner = `
        <div class="list animate__animated animate__zoomIn">
            <table>
                <thead>
                    <th>
                        <h3>Что нужно купить</h3>
                    </th>
                </thead>
                <tbody id="components">`
    items.forEach(e => {
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
                    <img onclick="manageListPage()"src="./assets/edit.svg">
                </button>
            </div>
        </div>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
const statPage = () => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    document.querySelector('body').style.backgroundImage = 'url(./assets/food.jpg)'
    document.querySelector('.title').innerHTML = `
        <h2 class="animate__animated animate__slideInLeft">Статистика</h2>
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
                <h3>сохранено</h3>
                <p>Списков покупок</p>
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
            <input name="name" type="text" required>
            <label>Ваш рецепт</label>
            <textarea name="description" rows="6" required></textarea>
            <button>
                <img src="./assets/send.svg">
            </button>
        </form>
    `
    document.querySelector('.content').innerHTML = inner
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
