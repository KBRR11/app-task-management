
export interface Task {
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    userId: string;
    createdAt: {
        _seconds: number;
        _nanoseconds: number;
    };
}

