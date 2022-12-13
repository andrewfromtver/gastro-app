// service functions
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
const checkImage = (username) => {
    getUserFromDb(username, (data) => { 
        if (data[0]) {
            document.querySelector('#photo').src = data[0].userpic
        }
        else {
            document.querySelector('#photo').src = './assets/noavatar.png'
        }
        document.querySelector('input[type=file]').value = ''
    })
}

// render wellcome page
const addUser = () => {
    let inner = `
        <div class="wellcome animate__animated animate__pulse">
            <h2>Gastro App</h2>
            <form id="adduser" onsubmit="initApp({
                username: document.querySelector('input').value,
                useragent: window.navigator.userAgent || 'Not defined'
            })">
                <label>Логин</label>
                <input 
                    type="text" 
                    oninput="checkImage(this.value)" 
                    id="username" 
                    name="username" 
                    maxlength="8" 
                    placeholder="Имя или псевдоним (не более 8 символов)"
                    required
                >
                <button onclick="document.body.querySelector('#userpic').click()" type="button">
                    <img src="./assets/add_a_photo.svg">
                    <input
                        hidden
                        type="file" 
                        onchange="previewFile()" 
                        id="userpic" 
                        name="userpic" 
                        accept=".jpg, .jpeg, .png"
                    >
                </button>
                <img id="photo" src="./assets/noavatar.png" alt="userpic-preview">
                <button>
                    <img src="./assets/login.svg">
                </button>
            </form>
        </div>
    `
    document.querySelector('#gastro-app').innerHTML = inner
}

// render tutorial page
const initApp = (data = false) => {
    event.preventDefault()
    let photo = './assets/noavatar.png'
    if (document.querySelector('#photo')) photo = document.querySelector('#photo').src
    let inner = ''
    let inner2 = ''
    let dbData = {
        username: data.username,
        userpic: photo,
        useragent: data.useragent
    }
    delUserFromDb(data.username)
    addUserToDb(dbData)
    if (data) {
        localStorage.setItem('Session', JSON.stringify(data))
        inner += `
            <nav>
                <div class="title">
                    <h2 class="animate__animated animate__slideInLeft">Обучение</h2>
                </div>
                <div>
                    <p>${data.username}</p>
                    <img src="${photo || './assets/noavatar.png'}" alt="userpic">
                    <button id="logout">
                        <img src="./assets/logout.svg">
                    </button>
                </div>
            </nav>
            <div class="content">
                <video autoplay loop id="tutorial" class="animate__animated animate__zoomIn">
                    <source src="./assets/tutorial.mp4" type="video/mp4">
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
    document.querySelector('#logout').onclick = () => {
        localStorage.removeItem('Session')
        window.location.reload()
    }
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
    localStorage.setItem(`${globalJson.username}_tutorial`, 'Tutorial compleated')
    let inner = `
        <img src="./assets/home.svg" id="home" alt="home">
        <img src="./assets/manage_list.svg" id="manage_list" alt="manage list">
        <img src="./assets/use_list.svg" id="use_list" alt="use list">
        <img src="./assets/stat.svg" id="stat" alt="stat">
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
    homePage()
}
