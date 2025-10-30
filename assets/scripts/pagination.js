
const data = 50
const state = {
    page: 1,
    totalPage: Math.ceil(data.length/5)
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
        document.getElementById("next").addEventListener('click', () => {
            controls.next()
        })
        document.getElementById("prev").addEventListener('click', () => {
            controls.prev()
        })
    }
}