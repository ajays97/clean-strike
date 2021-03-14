import { Play } from "../models/Player.model";

/**
 * 
 * @param playCommand input play outcome
 * @returns the number of coins to deduct from the board for a given play outcome
 */
export const getCoinsForPlay = (playCommand: Play): number => {
    switch (playCommand) {
        case Play.STRIKE:
        case Play.RED_STRIKE:
        case Play.DEFUNCT_COIN:
            return 1;
        case Play.MULTI_STRIKE:
            return 2;
        case Play.STRIKER_STRIKE:
        case Play.EMPTY_STRIKE:
            return 0;
    };
};