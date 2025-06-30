export type Feedback = {
    rating: number;
    comment: string;
    author: string;
    date: string; // ISO date string
};

export type Player = {
    id: string;
    playerName: string;
    MinutesPlayed: number;
    YoB: number;
    position: string;
    isCaptain: boolean;
    image: string;
    team: string;
    PassingAccuracy: number;
    feedbacks: Feedback[];
};