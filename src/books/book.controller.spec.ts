import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BookController', () => {
  let bookController: BookController;
  const testBook = {
    title: 'The Lord of the Rings - The Fellowship of the Ring',
    photoUrl:
      'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1654215925i/61215351.jpg',
    author: 'J. R. R. Tolkien',
    publishedDate: new Date('1954-07-29T07:00:00.000Z'),
    isbn: '9780261102880',
    summary:
      "The hobbit Frodo inherits the One Ring, a powerful and dangerous artifact created by the Dark Lord Sauron. Frodo embarks on a quest to destroy the Ring and ensure Sauron's defeat, joined by a fellowship of hobbits, men, dwarves, elves, and a wizard.",
  };
  let bookId: string; // this will be populated in beforeEach function

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService],
    }).compile();

    bookController = app.get<BookController>(BookController);
    bookController.create(testBook);

    const { books, limit, page } = bookController.findAll({});
    bookId = books[0].id;
    
  });

  describe('create', () => {
    it('should create a book!"', () => {
      const bookToCreate = {
        "title": "The Hobbit",
        "photoUrl": "https://i.pinimg.com/474x/6d/b0/42/6db0423e60a67cb467c83b85bae481fd.jpg",
        "author": "J. R. R. Tolkien",
        "publishedDate": new Date("1937-09-21T00:00:00.000Z"),
        "isbn": "9780547928174",
        "summary": "Bilbo Baggins, a hobbit, is persuaded by the wizard Gandalf to join a company of dwarves on a quest to reclaim their mountain home and treasure from the dragon Smaug."
      };
      const createReq = bookController.create(bookToCreate);
      expect(createReq).toBe('Created book details.');
    });
  });

  describe('find all', () => {
    it('should return all books!"', () => {
      const findAllReq = bookController.findAll({});
      expect(findAllReq.books.length).toBe(1);
      expect(findAllReq.limit).toBe(10);
      expect(findAllReq.page).toBe(1);
    });
  });

  describe('find one', () => {
    it('should find one book!"', () => {
      const findReq = bookController.findOne(bookId);

      expect(findReq?.title).toBe(testBook.title);
      expect(findReq?.photoUrl).toBe(testBook.photoUrl);
      expect(findReq?.author).toBe(testBook.author);
      expect(findReq?.publishedDate).toBe(testBook.publishedDate);
      expect(findReq?.isbn).toBe(testBook.isbn);
      expect(findReq?.summary).toBe(testBook.summary);
    });
  });

  describe('update', () => {
    it('should update book!"', () => {
      const newSummary = 'One Ring to Rule them All';
      const updateReq = bookController.update(bookId, { summary: newSummary });

      expect(updateReq).toBe('Updated book details.');
    });
  });

  describe('delete', () => {
    it('should delete a book!"', () => {
        const delReq = bookController.delete(bookId);
        expect(delReq).toBe("Book Deleted!");
    });
  });
});
