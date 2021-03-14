import GameState from "../src/interface/GameState.type";
import GameManager from "../src/lib/GameManager";
import Player, { Play } from "../src/models/Player.model";
import { getCoinsForPlay } from "../src/utils/utils";

describe('GameManager', function () {
    const player1 = new Player('A');
    const player2 = new Player('B');
    const gameManager = GameManager.getInstance(9, [player1, player2], player1);

    const players = gameManager.getPlayers();

    it('should have 9 coins on game start', function () {
        expect(gameManager.getCoins()).toEqual(9);
    });

    it('should return 8 coins after a strike for player A', function () {
        expect(gameManager.getPlayer().getName()).toEqual('A');
        gameManager.playTurn(Play.STRIKE, getCoinsForPlay(Play.STRIKE));
        expect(gameManager.getCoins()).toEqual(8);

        gameManager.setPlayer(player2);
    });

    it('should return 6 coins after a multi strike by player B', function () {
        expect(gameManager.getPlayer().getName()).toEqual('B');
        gameManager.playTurn(Play.MULTI_STRIKE, getCoinsForPlay(Play.MULTI_STRIKE));
        expect(gameManager.getCoins()).toEqual(6);

        gameManager.setPlayer(player1);
    });

    it('should return 5 coins after a defunct', function () {
        gameManager.playTurn(Play.DEFUNCT_COIN, getCoinsForPlay(Play.DEFUNCT_COIN));
        expect(players[0].getEmptyStrikes()).toEqual(1);
        expect(gameManager.getCoins()).toEqual(5);

        gameManager.setPlayer(player2);
    });

    it('should return 4 coins after a red strike', function () {
        gameManager.playTurn(Play.RED_STRIKE, getCoinsForPlay(Play.RED_STRIKE));
        expect(gameManager.getCoins()).toEqual(4);

        gameManager.setPlayer(player1);
    });

    it('should assign 0 point for player 1 and 5 for player 2', function () {
        expect(players[0].getPoints()).toEqual(0);
        expect(players[1].getPoints()).toEqual(5);
    });

    it('should assign 2 empty strikes for player A and 1 for player B', function () {
        gameManager.playTurn(Play.EMPTY_STRIKE, getCoinsForPlay(Play.EMPTY_STRIKE));
        expect(players[0].getEmptyStrikes()).toEqual(2);
        expect(players[1].getEmptyStrikes()).toEqual(0);
    });

    it('should retain player A points as 0 and not less than zero', function () {
        gameManager.playTurn(Play.DEFUNCT_COIN, getCoinsForPlay(Play.STRIKER_STRIKE));
        expect(players[0].getPoints()).toEqual(0);
        
        
        gameManager.setPlayer(player2);
        gameManager.playTurn(Play.MULTI_STRIKE, getCoinsForPlay(Play.MULTI_STRIKE));
        
        gameManager.setPlayer(player1);
        gameManager.playTurn(Play.STRIKE, getCoinsForPlay(Play.STRIKER_STRIKE));

        gameManager.setPlayer(player2);
    });

    it('should assign player B as winner after coins left is 0', function () {
        expect(gameManager.getWinner()).toBeNull();

        gameManager.playTurn(Play.MULTI_STRIKE, getCoinsForPlay(Play.MULTI_STRIKE));
        expect(gameManager.getCoins()).toEqual(0);

        expect(gameManager.getWinner().getName()).toEqual('B');
    });


});

describe('GameManager::checkForWin', function () {
    const player1 = new Player('A');
    const player2 = new Player('B');
    const gameManager = GameManager.getInstance(9, [player1, player2], player1);

    it('should return null no players have minimum win points of 5', function () {
        const winner = gameManager.checkForWin([1, 4]);
        expect(winner).toBeNull();
    });

    it('should return player A if A is 3 points ahead of B', function () {
        const winner = gameManager.checkForWin([5, 2]);
        expect(winner.getName()).toEqual('A');
    });

    it('should return player B if B is 3 points ahead of A', function () {
        const winner = gameManager.checkForWin([1, 6]);
        expect(winner.getName()).toEqual('B');
    });

    it('should return null for draw if minimum difference is unsatisfied', function () {
        const winner = gameManager.checkForWin([5, 6]);
        expect(winner).toBeNull();
    });
;});