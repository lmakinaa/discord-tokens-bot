const fs = require("fs")
module.exports = async client=>{
    fs.readdirSync("./Events").filter(f => f.endsWith(".js")).forEach(async file =>{
        let command = require(`../Events/${file}`)
        console.log(file.split(".js").join(""));
    })
}