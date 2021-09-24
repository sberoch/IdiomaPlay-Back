import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { config } from '../config';

const dupKeyRegex = /^duplicate key value violates unique constraint/;
const violatesFKRegec = /violates foreign key constraint/;

@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const request = context.getRequest();
    let message: string;
    let code: string;

    if (dupKeyRegex.test(exception.message)) {
      message = 'Ya existe.';
      code = config.errorCodes.DUP_KEY;
    } else if (violatesFKRegec.test(exception.message)) {
      message =
        'Se esta violando una clave foranea al eliminar/modificar esta entidad.';
      code = config.errorCodes.VIO_FK;
    } else {
      message = 'Error desconocido.';
      code = config.errorCodes.UNK_ERR;
    }

    const errorResponse = {
      path: request.url,
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: new Date().toISOString(),
      message,
      code,
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
