export interface Book extends CreateBookDto {
    id: string;
}

export interface CreateBookDto {
    title: string;
    photoUrl: string;
    author: string;
    publishedDate: Date;
    isbn: string;
    summary: string;
}

export interface UpdateBookDto {
    title?: string;
    photoUrl?: string;
    author?: string;
    publishedDate?: Date;
    isbn?: string;
    summary?: string;
}