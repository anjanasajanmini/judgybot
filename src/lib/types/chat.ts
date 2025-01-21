export interface ChatDocument {
    id: string;
    userId: string;
    title: string;
    messages: Array<{ role: string; content: string }>;
    keyTakeaways: string;
    createdAt: number;
    updatedAt: number;
} 