const fs = require("fs");
const path = require("path");
const crypto = require("crypto-js");
const http = require("http");

const {
    ipcRenderer
} = require('electron');

var JSSoup = require('jssoup').default;


let animes_render = {
    "solo": {}
};


const { Hash } = require("crypto");
const unidecode = require("unidecode");
const { default: axios } = require("axios");

function create_anime_folder(location) {
    console.log("Create directory at " + location);
    fs.mkdirSync(location);
}

function create_anime_data(location, info) {
    const json_data = JSON.stringify(info, null, 4)
    console.log(json_data)
    fs.writeFileSync(path.join(process.cwd(), location), json_data);
    ipcRenderer.send("data_add", location);
}


async function add_image_url(anime_name) {
    const uri_search = `https://www.google.com/search?q=${anime_name}&sxsrf=ALeKk02SbSB4p64ZbY-wpfAnwMFlIGlT0A:1618508134268&source=lnms&tbm=isch&sa=X&ved=2ahUKEwj2h6LT5IDwAhUjz4UKHbVYABgQ_AUoA3oECAEQBQ&cshid=1618508200787229&biw=1920&bih=975`
    axios
        .get(uri_search)
        .then((response) => {
            let soup = new JSSoup(response.data);
            console.log(soup.findAll("img", "rg_i"));
        })
        .catch((err) => {
            console.log(err);
        })
}



const data = fs.readFileSync(path.join("ressources/config/userconfig.json"))
const user_data = JSON.parse(data);
user_data.animefolder.forEach((folder) => {
    const folder_data = fs.readdirSync(folder);
    folder_data.forEach(animes => {
        const anime_content = path.join(folder, animes);
        const anime_stat = fs.lstatSync(anime_content);
        if (anime_stat.isFile()) {
            let anime_name = unidecode(anime_content.replace(/\ /g, "_"));
            const anime_hash_string = crypto.MD5(anime_name).toString();
            animes_render["solo"][unidecode(path.parse(animes).name)] = {
                "hash": anime_hash_string,
                "location": anime_name
            };
            if (!fs.existsSync(path.join("ressources/animes/", anime_hash_string))) {
                create_anime_folder(path.join("ressources/animes/", anime_hash_string));
                create_anime_data(path.join("ressources/animes/", anime_hash_string, "data.json"), {
                    "nb_ep": 1,
                    "nb_watch": 0
                })
            }
        }
        else {
            animes = unidecode(animes)
            let folder_name = unidecode(anime_content.replace(/\ /g, "_"));
            animes_render[animes] = {}
            const anime_hash_string = crypto.MD5(folder_name).toString();
            animes_render[animes]["hash"] = unidecode(anime_hash_string);
            animes_render[animes]["location"] = unidecode(folder_name)
            const folder_content = fs.readdirSync(anime_content);
            let all_episodes = [];
            let exist = true;
            if (!fs.existsSync(path.join("ressources/animes/", anime_hash_string))) {
                create_anime_folder(path.join("ressources/animes/", anime_hash_string));
                exist = false;
            }
            nb_ep = 0;
            folder_content.forEach(sub_anime => {
                const sub_anime_stat = fs.lstatSync(path.join(anime_content, sub_anime))
                if (sub_anime_stat.isFile()) {
                    all_episodes.push(unidecode(sub_anime));
                    nb_ep++;
                }
            })
            if (!exist) {
                create_anime_data(path.join("ressources/animes/", anime_hash_string, "data.json"), {
                    "nb_ep": nb_ep,
                    nb_watch: 0
                });
            }
            animes_render[animes]["episodes"] = all_episodes;
        }
    })
})

ipcRenderer.send("anime_charged", animes_render,)