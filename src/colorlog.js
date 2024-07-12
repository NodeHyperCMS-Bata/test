export const consoleColors = {
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m"
};

let consoleColor = {};
for(const color in consoleColors){
    consoleColor[color] = (...text) => {
        return consoleColors[color]+text.join(' ')+consoleColors.white;
    };
}

export let colorlog = consoleColor;