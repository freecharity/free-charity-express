export interface Answer {
    answer_id: number;
    answer: string;
    correct: number;
    deleted: number;
    ip: string;
    date_answered: string;
    question_id: number;
    user_id: number;
}