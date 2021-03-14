import chalk from "chalk";
import figlet from 'figlet';

export const drawHeader = () => {
    console.log(chalk.red(figlet.textSync('Clean Strike', {horizontalLayout: "full"})));
    return;
};