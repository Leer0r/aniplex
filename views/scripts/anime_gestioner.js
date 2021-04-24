const {
    ipcRenderer
} = require('electron');

document.querySelectorAll(".anime_container").forEach((anime) => {
    anime.addEventListener("click", (e) => {
        ipcRenderer.send("anime_click", anime.id)
    })
})