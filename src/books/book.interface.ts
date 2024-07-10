export interface CreateBook {
  title: string;
  photoUrl: string;
  author: string;
  publishedDate: string;
  isbn: string;
  summary: string;
}

export interface UpdateBook {
  title?: string;
  photoUrl?: string;
  author?: string;
  publishedDate?: string;
  isbn?: string;
  summary?: string;
}

export interface CreateBorrowRequest {
  numberOfDays: number;
}
