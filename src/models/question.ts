export interface Question {
    question_id?: number;
    question: string;
    answer: string;
    incorrect_1: string;
    incorrect_2: string;
    incorrect_3: string;
    category_id: number;
    category_name: string;
    deleted: number;
}
