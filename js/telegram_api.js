// feedback
const sendFeedback = (username, description) => {
    event.preventDefault()
    fetch('https://api.telegram.org/bot' +
        '5837458997:AAGRCm4-pih4NBvUrvTz4QN3Lv3MV7j8UR8' +
        '/sendMessage?parse_mod=html&chat_id=-1001838020997&text=' +
        `${encodeURIComponent('Автор рецепта: ' + username + ' \n')}` +
        `${encodeURIComponent('Рецепт: ' + description)}`)
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

// send list
const sendList = () => {
    let username = JSON.parse(localStorage.getItem('Session')).username
    let list = ''

    components.querySelectorAll('input').forEach(e => {
        list += `\n ${e.value}`
    })

    if (sessionStorage.getItem(`${username}_chatId`)) {
        chatId = JSON.parse(sessionStorage.getItem(`${username}_chatId`))

        fetch('https://api.telegram.org/bot' +
            '5837458997:AAGRCm4-pih4NBvUrvTz4QN3Lv3MV7j8UR8' +
            '/sendMessage?parse_mod=html&chat_id=' + chatId + '&text=' +
            `${encodeURIComponent('Автор списка покупок: ' + username + ' \n')}` +
            `${encodeURIComponent('Список покупок: ' + list)}`)
            .then(e => {
                if (e.status === 200) {
                    alert('Список покупок успешно отправлен в Telegram')
                }
                else if (e.status === 403) {
                    alert('Наш Telegem бот не может отправить вам сообщение, пожалуйста найдите нашего бота и запустите его (найти нашего бота можно по имени - @gastro_app_bot)')
                }
                else {
                    alert(`Во время отправки сообщения произошла ошибка, код ошибки - ${e.status}`)
                }
            })

    }

    else {
        alert('Вы не указали Telegram chat ID для отправки сообщения, пожалуйста укажите chat ID и повторите попытку')
    }
}