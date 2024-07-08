import { Injectable } from '@nestjs/common';
import {
  Book,
  CreateBookDto,
  UpdateBookDto,
} from './book.interface';

interface SortFn<T, K extends keyof T> {
  (a: T, b: T, key: K): number;
}

function compareBy<T, K extends keyof T>(key: K, ascendingOrder: boolean): SortFn<T, K> {
  return (a: T, b: T) => {
    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === 'string' && typeof valueB == 'string') {
      return ascendingOrder ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA); 
    } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return ascendingOrder ? valueA - valueB : valueB - valueA;
    } else {
      return 0;
    }
  };
}

const sorterFuncMapper = (ascendingOrder: boolean)=>{
    return new Map<string, Function>([
        // ['id', compareBy<Book, 'id'>('id')],
        ['title', compareBy<Book, 'title'>('title', ascendingOrder)],
        ['author', compareBy<Book, 'author'>('author', ascendingOrder)],
        ['publishedDate', compareBy<Book, 'publishedDate'>('publishedDate', ascendingOrder)],
      ])
};

function generateRandomId(): string {
  const randomPart = Math.random().toString(36).substring(2, 15);
  const timestampPart = Date.now().toString(36).substring(2);
  return randomPart + timestampPart;
}

@Injectable()
export class BookService {
  private books: Book[] = [];

  findAll(page: number, limit: number, sortBy: string, order: string): Book[] {
    const mapper = sorterFuncMapper(order == "asc")
    var sorterFunc = mapper.get(sortBy) || compareBy<Book, 'id'>('id', true);
    const sortedBooks = [...this.books].sort(
      sorterFunc as (a: Book, b: Book) => number,
    );
    var offset = limit * (page - 1);
    return sortedBooks.slice(offset, offset + limit);
  }

  findOne(id: string): Book | void {
    return this.books.find((_book: Book) => _book.id == id);
  }

  create(book: CreateBookDto): void {
    this.books.push({ id: generateRandomId(), ...book  });
  }

  update(id: string, book: UpdateBookDto): void {
    var bookIndex: string | number = this.books.findIndex(
      (_book: Book) => _book.id == id,
    );

    if (bookIndex == -1) {
      return;
    }
    var currBook = this.books[bookIndex];

    currBook.title = book.title ?? currBook.title;
    currBook.photoUrl = book.photoUrl ?? currBook.photoUrl;
    currBook.author = book.author ?? currBook.author;
    currBook.publishedDate = book.publishedDate ?? currBook.publishedDate;
    currBook.isbn = book.isbn ?? currBook.isbn;
    currBook.summary = book.summary ?? currBook.summary;
  }

  delete(id: string): void {
    this.books = this.books.filter((_book: Book) => _book.id != id);
  }
}
