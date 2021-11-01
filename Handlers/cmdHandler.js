const fs = require("fs");
const { Collection } = require("discord.js");
module.exports = (client) => {
    client.commands = new Collection();
    client.cmdA = new Collection();

    const filesLoad = (folder, folderName, t, loadedFolders) => {
        const cmdFiles = fs.readdirSync(folder.join("")).filter(file => file.endsWith(".js"))

        if(cmdFiles.length === 0) client.categories.pop();

        for(const file of cmdFiles){
            const cmd = require("." + folder.join("") + file);

            client.commands.set(cmd.name, cmd);

            client.categories.find(c => c.name === folderName).cmds.push(cmd.name);
            cmd.aliases.forEach(alias => {
                client.cmdA.set(alias, cmd.name);
            })

            console.log(file + " loaded");
        }

        if(t === 1) folder.pop();

        folderSearch(folder, loadedFolders);
    }

    const folderSearch = (folder, loaded) => {
        const files = fs.readdirSync(folder.join(""));

        for(const file of files){
            if(!fs.existsSync(folder.join("") + file)) return;

            const stats = fs.lstatSync(folder.join("") + file);

            if(!stats.isDirectory()) continue;

            if(loaded.includes(file)) continue;

            client.categories.push({
                name: `${file}`,
                cmds: []
            });

            folder.push(file + "/");
            loaded.push(file);

            filesLoad(folder, file, 1, loaded);
        }
    }

    const cmdsFolder = ["./Commands/"];
    const loadedFolders = [];

    client.categories = [
        {
            name: `Commands`,
            cmds: []
        }
    ];

    filesLoad(cmdsFolder, "Commands", 0, loadedFolders);
}