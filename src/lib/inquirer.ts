import inquirer from 'inquirer';

export const askPlayerNames = () => {
    const questions = [
        {
            name: 'player1',
            message: 'Enter Player 1 name:'
        },
        {
            name: 'player2',
            message: 'Enter Player 2 name:'
        }
    ];

    return inquirer.prompt(questions);
};