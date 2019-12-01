export interface Leaderboard {
    members: LeaderboardMember[];
}

export interface LeaderboardMember {
    username: string;
    score: number;
    avatar: string;
}
