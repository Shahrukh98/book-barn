import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookController } from './books/book.controller';
import { BookService } from './books/book.service';
import { MorganMiddleware } from './middlewares/morgan.middleware';

@Module({
  controllers: [AppController, BookController],
  providers: [AppService, BookService],
  
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MorganMiddleware).forRoutes(BookController)
  }
}