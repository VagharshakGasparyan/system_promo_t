import AllMigration from './migrations/migrateAll.js';
import AllSeed from './seeders/seedAll.js';

const com_colours = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
        crimson: "\x1b[38m" // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        gray: "\x1b[100m",
        crimson: "\x1b[48m"
    }
};
const help = [
    {command: "npx tsx com.js migrate", description: "Migrate all."},
    {command: "npx tsx com.js seed", description: "Seed all."}
];
let comMaxLen = 0;
help.forEach((h) => {
    comMaxLen = h.command.length > comMaxLen ? h.command.length : comMaxLen;
});
let helpText = help.map((h) => {
    let ws = " ".repeat(comMaxLen - h.command.length);
    return com_colours.fg.green + h.command + ws + com_colours.fg.yellow + " " + h.description;
}).join("\n") + com_colours.reset;

async function f() {
    let args = process.argv.slice(2);
    if(args.length < 1){
        console.log(helpText);
        return;
    }
    if(args[0] === 'migrate'){
        await new AllMigration().up();
    }else if(args[0] === 'seed'){
        await new AllSeed().up();
    }else if(args[0] === 'help'){
        console.log(helpText);
    }else{
        console.log('There is no such command.');
    }
    // console.log(args);

    process.exit(1);
}

f();