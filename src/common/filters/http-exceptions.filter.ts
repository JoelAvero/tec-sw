import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // TODO: send error to Cloudwatch or some other service
    /*
      exception.stack;
      error datetime
      error message
      request.url
      etc...
    */

    response.status(status).json({
      statusCode: status || 500,
      message: exception.message || 'Internal server error',
    });
  }
}
