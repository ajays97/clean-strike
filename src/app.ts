import inquirer from "inquirer";

import { drawHeader } from "../src/lib/draw-header";
import { askPlayerNames } from '../src/lib/inquirer';
import GameManager, { BoardState } from "../src/lib/GameManager";
import Player, { Play } from "../src/models/Player.model";
import localStrings from '../src/utils/en.json';
import { START_COINS } from "../src/utils/constants";
import GameState from "../src/interface/GameState.type";
import { getCoinsForPlay } from "../src/utils/utils";

console.clear();

drawHeader();

const startGame = async (): Promise<void> => {

    let togglePlayer: boolean = true;

    const playerNames = await askPlayerNames();

    let gameMessage: string = null;

    // Create player objects for Player 1 and Player 2
    const player1: Player = new Player(playerNames.player1);
    const player2: Player = new Player(playerNames.player2);

    const players: Player[] = [player1, player2];

    const gameManager = GameManager.getInstance(START_COINS, players, player1);    // player1 starts

    while (gameManager.getBoardState() !== BoardState.END) {

        drawGameBoardHeader(gameManager.getCoins(), player1, player2);

        const player = togglePlayer ? player1 : player2;
        gameManager.setPlayer(player);

        console.log(`${localStrings.player} ${gameManager.getPlayer().name}: ${localStrings.chooseOutcome}\n`);
        console.log(`${gameMessage ? gameMessage + '\n\n' : ''} ${localStrings.outcomeList.toString().replace(/,/g, '\n')}\n`);

        const inputTurn = await inquirer.prompt({ message: '>', name: 'playOutcome'});

        const playOutcome = parseInt(inputTurn.playOutcome);
        const inputCoins = getCoinsForPlay(playOutcome);
    
        if (playOutcome === Play.RED_STRIKE) {
            if (gameManager.getRedCoins() === 0) {
                gameMessage = `${localStrings.redStrikeUsed}`;
                continue;
            } else {
                gameManager.setRedCoins(0);
            }
        }

        const gameResultState: GameState = gameManager.playTurn(playOutcome, inputCoins);

        if (gameResultState && gameResultState.player) {
            drawGameBoardHeader(gameManager.getCoins(), player1, player2);
            console.log(`${gameResultState.message}\n\n\n`);
        } else if (gameManager.getBoardState() === BoardState.END) {
            drawGameBoardHeader(gameManager.getCoins(), player1, player2);
            console.log(`${localStrings.gameResultDraw}\n\n\n`)
        }

        // Switch player
        togglePlayer = !togglePlayer;
        gameMessage = null;

    }

};

const drawGameBoardHeader = (coinsLeft: number, player1: Player, player2: Player): void => {
    console.clear();
    drawHeader();
    console.log(`${localStrings.coinsLeft}: ${coinsLeft}\n`);
    console.log(`${player1.getName()}: ${localStrings.points}:${player1.getPoints()} ${localStrings.emptyStrikes}:${player1.getEmptyStrikes()} ${localStrings.fouls}:${player1.getFouls()}, \t\t\t ${player2.getName()}: ${localStrings.points}:${player2.getPoints()} ${localStrings.emptyStrikes}:${player2.getEmptyStrikes()} ${localStrings.fouls}:${player2.getFouls()}\n\n\n\n`);
};

startGame();
