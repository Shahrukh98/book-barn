import { Controller, Get, Post, Put, Delete, Query, Param, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto, UpdateBookDto } from './book.interface';
import { IsInt, IsOptional, IsString, IsEnum, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';


export class GetBooksQueryDto {
  @IsOptional()
  @IsInt()
  @Min(10)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsEnum(['id','title','author','publishedDate'])
  sortBy?: string;

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: string; 
}

// GET /books
// GET /books/[id]
// POST /books
// PUT /books/[id]
// DELETE /books/[id]

@Controller("/books")
export class BookController {
  constructor(private readonly bookService: BookService) {}


  /**
   * Create a new book.
   * @body CreateBookDto (CreateBookDto)
   * @returns 
  */
  @Post("/")
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() book: CreateBookDto) {
    await this.bookService.create(book)
    return "Created book details."
  }

  /**
   * Retrieve a list of books.
   * @query queryParams  { page: number, limit: number, sortBy: string, order: "asc" | "desc"}
   * @returns 
   */
  @Get("/")
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() queryParams: GetBooksQueryDto) {
    const page = queryParams?.page ?? 1 
    const limit = queryParams?.limit ?? 10
    const sortBy = queryParams?.sortBy ?? "id" 
    const order = queryParams?.order ?? "asc" 
    const books = await this.bookService.findAll(page, limit, sortBy, order);

    return {
      'books': books,
      'page': page,
      'limit': limit
    };
  }

  /**
   * Retrieve a specific book by ID.
   * @param id Id of the book to find
   * @returns 
   */
  @Get("/:id")
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string ) {
    return this.bookService.findOne(id);
  }

  /**
   * Update an existing book by ID.
   * @param id Id of the book to update
   * @body UpdateBookDto (UpdateBookDto)
   * @returns 
   */
  @Put("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    this.bookService.update(id, updateBookDto)
    return "Updated book details." // With 204, we are not supposed to return any content. The string is used for testing
  }

  /**
   * Delete a book by ID.
   * @param id Id of the book to delete
   * @returns 
   */
  @Delete("/:id")
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string){
    this.bookService.delete(id)
    return "Book Deleted!" // With 204, we are not supposed to return any content. The string is used for testing
  }

}

