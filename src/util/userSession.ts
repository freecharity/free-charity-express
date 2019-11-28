import {User} from '../models/user';

/**
 * Session Controller
 * This file manages the user login sessions for this application.
 * A map is used to map every username to a uniquely generated session.
 **/

export class UserSession {
    public sessions: Map<string, string> = new Map<string, string>();

    public addUserSession(user: User): string {
        const sessionId = this.generateSessionId();
        this.sessions.set(user.username.toLowerCase(), sessionId);
        return sessionId;
    }

    public removeUserSession(user: User): boolean {
        this.sessions.delete(user.username.toLowerCase());
        return !this.sessions.has(user.username.toLowerCase());
    }

    public validateSession(username: string, sessionId: string): boolean {
        return this.sessions.get(username.toLowerCase()) == sessionId;
    }

    private generateSessionId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

export const userSession = new UserSession();
