import GameManager from "../src/lib/GameManager";
import Player from "../src/models/Player.model";

describe('GameManager', function () {
    const player1 = new Player('A');
    const player2 = new Player('B');
    const gameManager = GameManager.getInstance(9, [player1, player2], player1);

    it('should have 9 coins on game start', function () {
        expect(gameManager.getCoins()).toEqual(9);
    });
});