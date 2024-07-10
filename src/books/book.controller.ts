import { Type } from 'class-transformer';
import { IsInt, IsEnum, Min, IsString, IsOptional } from 'class-validator';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';

import { AuthorizedRequest, RolesGuard, UserRole } from '../auth/auth.guard';
import { CreateBook, UpdateBook } from './book.interface';
import { BookService } from './book.service';

export class GetBooksQueryDto {
  @IsInt()
  @Min(10)
  @Type(() => Number)
  pageSize: number = 10;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsEnum(['id', 'title', 'author', 'publishedDate'])
  sortBy: string = 'id';

  @IsEnum(['asc', 'desc'])
  sortDirection: string = 'asc';
}

class CreateBookBody implements CreateBook {
  @IsString()
  title: string;

  @IsString()
  photoUrl: string;

  @IsString()
  author: string;

  @IsString()
  publishedDate: string;

  @IsString()
  isbn: string;

  @IsString()
  summary: string;
}

class UpdateBookBody implements UpdateBook {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  photoUrl: string;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  publishedDate: string;

  @IsOptional()
  @IsString()
  isbn: string;

  @IsOptional()
  @IsString()
  summary: string;
}

class BorrowRequestBody {
  @IsInt()
  @Min(5)
  numberOfDays: number;
}

// GET /books user, admin
// GET /books/[id] user, admin
// POST /books admin
// PUT /books/[id]  admin
// DELETE /books/[id]  admin

// POST /books/borrow/[id] user
// POST /books/return/[id] user
// POST /books/approve/[requestId] admin
// POST /books/reject/[id] admin

// A better design would be to have the API routes this way.
// POST /books/[id]/return
// POST /books/[id]/borrow 
// POST /borrow-requests/[id]/approve
// POST /borrow-requests/[id]/reject 

@Controller('/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() book: CreateBookBody) {
    return this.bookService.create(book);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.User, UserRole.Admin])
  @Get('/')
  @HttpCode(HttpStatus.OK)
  findAll(@Query() queryParams: GetBooksQueryDto) {
    const { page, pageSize, sortBy, sortDirection } = queryParams;
    return this.bookService.findAll(page, pageSize, sortBy, sortDirection);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.User, UserRole.Admin])
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.bookService.findOne(id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id') id: string, @Body() updateBook: UpdateBookBody) {
    return this.bookService.update(id, updateBook);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.bookService.delete(id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.User])
  @Post('/borrow/:id')
  @HttpCode(HttpStatus.CREATED)
  makeBorrowRequest(
    @Param('id') id: string,
    @Req() request: AuthorizedRequest,
    @Body() body: BorrowRequestBody,
  ) {
    return this.bookService.makeBorrowRequest(
      id,
      request.user.id,
      body.numberOfDays,
    );
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.User])
  @Post('/return/:id')
  @HttpCode(HttpStatus.OK)
  returnBook(@Param('id') id: string, @Req() request: AuthorizedRequest) {
    return this.bookService.returnBook(id, request.user.id);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Post('/approve/:requestId')
  @HttpCode(HttpStatus.OK)
  approveBorrowRequest(@Param('requestId') requestId: string) {
    return this.bookService.approveBorrowRequest(requestId);
  }

  @UseGuards(RolesGuard)
  @SetMetadata('roles', [UserRole.Admin])
  @Post('/reject/:requestId')
  @HttpCode(HttpStatus.OK)
  rejectBorrowRequest(@Param('requestId') requestId: string) {
    return this.bookService.rejectBorrowRequest(requestId);
  }
}
