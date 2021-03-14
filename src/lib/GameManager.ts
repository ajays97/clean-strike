import GameState from "../interface/GameState.type";
import Player, { Play } from "../models/Player.model";
import { MINIMUM_WIN_POINTS, WIN_POINTS_DIFFERENCE } from "../utils/constants";
import localStrings from '../utils/en.json';

class GameManager {
    private static _instance: GameManager;
    private coins: number;
    private boardState: number;
    private player: Player;
    private winner: Player;
    private redCoins: number;
    private players: Player[];

    private constructor(coins: number, players: Player[], player: Player) {
        this.coins = coins;
        this.boardState = BoardState.START;
        this.winner = null;
        this.player = player;
        this.players = players;
        this.redCoins = 1;
    }

    public static getInstance(coins: number = 9, players: Player[], player: Player): GameManager {
        if (!GameManager._instance) {
            GameManager._instance = new GameManager(coins, players, player);
        }

        return GameManager._instance;
    };

    public setRedCoins(redCoins: number) {
        this.redCoins = redCoins;
    };

    public getRedCoins() {
        return this.redCoins;
    };

    public setPlayer(player: Player) {
        this.player = player;
    };

    public getPlayer() {
        return this.player;
    };

    public setPlayers(players: Player[]) {
        this.players = players;
    };

    public getPlayers() {
        return this.players;
    };

    public setWinner(winner: Player) {
        this.winner = winner;
    };

    public getWinner() {
        return this.winner;
    };

    public setCoins(coins: number) {
        this.coins = coins;
    }

    public getCoins() {
        return this.coins;
    };

    public getBoardState() {
        return this.boardState;
    };

    public setBoardState(boardState: BoardState) {
        this.boardState = boardState;
    };

    public playTurn(playCommand: Play, coinsPlayed: number): GameState {
        this.player.play(playCommand, coinsPlayed);
        this.setCoins(Math.max(0, this.coins - coinsPlayed));

        if (this.coins === 0) {
            const [player1, player2] = [...this.players];
            const player1Points = player1.getPoints();
            const player2Points = player2.getPoints();
            this.winner = this.checkForWin([player1Points, player2Points]);

            if (!this.winner) {
                this.setBoardState(BoardState.END);     // Game Over
                return {
                    message: `${localStrings.gameResultDraw}`
                };
            } else {
                this.setBoardState(BoardState.END);     // Game Over
                return {
                    message: `${localStrings.gameWon.replace(`<player>`,
                        this.winner.getName())
                        .replace('<score1>', `${this.players[0].getPoints()}`)
                        .replace('<score2>', `${this.players[1].getPoints()}`)}`,
                    player: this.winner,
                    points: this.winner.getPoints()
                };
            }
        }
    };

    /**
     * Update code here to check for winner amidst 'n' players
     * @returns Returns the winning player if any or null;
     */
    public checkForWin(playerPoints: number[]): Player {
        const [player1, player2] = [...this.players];
        const [player1Points, player2Points] = [...playerPoints];

        if (player1Points >= MINIMUM_WIN_POINTS || player2Points >= MINIMUM_WIN_POINTS) {
            const pointsDifference = player1Points - player2Points;

            if (pointsDifference >= WIN_POINTS_DIFFERENCE) {
                return player1;
            } else if (pointsDifference <= -WIN_POINTS_DIFFERENCE) {
                return player2;
            } else {
                return null;
            }
        }

        return null;
    };
};

export const enum BoardState {
    START, ONGOING, END
};

export default GameManager;