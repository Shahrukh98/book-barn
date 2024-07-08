export interface CreateBookDto {
    title: string;
    photoUrl: string;
    author: string;
    publishedDate: string;
    isbn: string;
    summary: string;
}

export interface UpdateBookDto {
    title?: string;
    photoUrl?: string;
    author?: string;
    publishedDate?: string;
    isbn?: string;
    summary?: string;
}