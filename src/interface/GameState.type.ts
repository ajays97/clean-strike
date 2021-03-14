import Player from "../models/Player.model";

export default interface GameState {
    message: string;
    player?: Player;
    points?: number;
};