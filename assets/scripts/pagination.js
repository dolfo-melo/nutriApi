
const data = 50
const state = {
    page: 1,
    totalPage: Math.ceil(data/5)
}

const controls = {
    next() {
        if (state.page < totalPage) {
            state.page++
        }else {
            return null
        }
    },
    prev() {
        if (state.page > 1) {
            state.page--
        }else {
            return null
        }
    },
    executa() {
        document.querySelector('.next').addEventListener('click', () => {
            controls.next()
            console.log(state.page)
        })
        document.querySelector('.prev').addEventListener('click', () => {
            controls.prev()
            onsole.log(state.page)
        })
    }
}