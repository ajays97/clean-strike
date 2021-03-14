class Player implements PlayCommand {

    name: string;
    points: number;
    emptyStrikes: number;
    fouls: number;
    previousPlay: Play;

    public constructor(name: string) {
        this.name = name;
        this.points = 0;
        this.emptyStrikes = 0;
        this.fouls = 0;
        this.previousPlay = null;
    }

    play(playCommand: Play, _coins: number) {
        switch (playCommand) {
            case Play.STRIKE:
                this.strike();
                this.setFouls(0);
                this.setEmptyStrikes(0);
                break;

            case Play.MULTI_STRIKE:
                this.multiStrike();
                this.setFouls(0);
                this.setEmptyStrikes(0);
                break;

            case Play.RED_STRIKE:
                this.redStrike();
                this.setFouls(0);
                this.setEmptyStrikes(0);
                break;

            case Play.STRIKER_STRIKE:
                this.strikerStrike();
                break;

            case Play.DEFUNCT_COIN:
                this.defunctCoin();
                break;

            case Play.EMPTY_STRIKE:
                this.emptyStrike();
                break;
        };

        // Set previousPlay
        this.previousPlay = playCommand;

        if (this.fouls === 3) {
            this.setPoints(Math.max(0, this.points - 1));       // Lose a point for 3 fouls
            this.fouls = 0;         // Reset fouls after deducting a point
        }
    };

    public getPoints() {
        return this.points;
    };

    public setPoints(points: number) {
        this.points = points;
    };

    public getName() {
        return this.name;
    };

    public setName(name: string) {
        this.name = name;
    };

    public getEmptyStrikes() {
        return this.emptyStrikes;
    };

    public setEmptyStrikes(emptyStrikes: number) {
        this.emptyStrikes = emptyStrikes;
    }

    public setFouls(fouls: number) {
        this.fouls = fouls;
    };

    public getFouls() {
        return this.fouls;
    };

    public strike() {
        this.points += 1;
        return this;
    };

    public multiStrike() {
        // Player always wins 2 points on a multi-strike
        this.points += 2;
        return this;
    };

    public redStrike() {
        // TBD
        this.points += 3;
        return this;
    };

    public strikerStrike() {
        this.setPoints(Math.max(0, this.points - 1));
        this.fouls += 1;
        return this;
    };

    public defunctCoin() {
        this.setPoints(Math.max(0, this.points - 2));
        this.fouls += 1;
        this.emptyStrikes += 1;
        return this;
    };

    public emptyStrike() {
        this.emptyStrikes += 1;

        // Player loses a point on 3 empty strikes
        if (this.emptyStrikes === 3) {
            this.setPoints(Math.max(0, this.points - 1));
            this.fouls += 1;            // Foul since player loses a point
            this.emptyStrikes = 0;
        } else {
            this.fouls = 0;             // Empty strike resets consecutive foul counter
        }

        return this;
    };

};

export default Player;

interface PlayCommand {
    /**
     * 
     * @param playCommand Command to execute for the player
     * @param coins Number of coins for the played command
     */
    play(playCommand: Play, coins: number): void;
};

export enum Play {
    STRIKE = 1,
    MULTI_STRIKE = 2,
    RED_STRIKE = 3,
    STRIKER_STRIKE = 4,
    DEFUNCT_COIN = 5,
    EMPTY_STRIKE = 6
};