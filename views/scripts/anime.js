const fs = require("fs");
const path = require("path");
const crypto = require("crypto-js");

const {
    ipcRenderer
} = require('electron');

let animes_render = {};

function create_anime_data(location) {
    console.log("Create directory at " + location);
    fs.access(location, (err) => {
        if (err) { //create a new folder for the anime
            fs.mkdir(location, (err) => {
                if (err) {
                    console.error(err);
                    return console.error("Mkdir failed...");
                }
            })
        }
    })
}

const data = fs.readFileSync(path.join("ressources/config/userconfig.json"))
const user_data = JSON.parse(data);
user_data.animefolder.forEach((folder) => {
    const folder_data = fs.readdirSync(folder);
    folder_data.forEach(animes => {
        const anime_stat = fs.lstatSync(path.join(folder, animes));
        if (anime_stat.isFile()) {
            let anime_name = path.parse(animes).name.replace(/\//g, "_");
            const anime_hash_string = crypto.MD5(anime_name).toString();
            animes_render[anime_name] = anime_hash_string;
            console.log("Anime added : " + anime_name)
            if (!fs.existsSync(path.join("ressources/animes/", anime_hash_string))) {
                create_anime_data(path.join("ressources/animes/", anime_hash_string));
            }
        }
    })
})


ipcRenderer.send("anime_charged", animes_render)
console.log("send : ")
console.log(animes_render);