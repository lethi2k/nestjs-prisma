import { STATUS_CODES } from 'node:http';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class QueryFailedFilter implements ExceptionFilter<PrismaClientKnownRequestError> {
  constructor(public reflector: Reflector) {}

  catch(
    exception: PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | undefined;

    // Handle specific Prisma error codes and map to appropriate HTTP status
    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        status = HttpStatus.CONFLICT;
        message = 'Unique constraint failed. A record with the same value already exists.';
        break;
      // Add additional Prisma error codes and corresponding responses if needed
      default:
        message = 'An unexpected error occurred.';
    }

    response.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message: message || exception.message,
    });
  }
}
