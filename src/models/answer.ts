export interface Answer {
    answer_id: number;
    ip_address: string;
    correct: boolean;
    answer: string;
    deleted: boolean;
    datetime: string;
    question_id: number;
    user_id: number;
}