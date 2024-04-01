import { Catch, RpcExceptionFilter, ArgumentsHost, UnauthorizedException, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

// import { Observable, throwError } from 'rxjs';

const logger = new Logger('RpcCustomExceptionFilter');
@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost){
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    if ( typeof  rpcError === 'object' && 'status' in rpcError && 'message' in rpcError ) {
      const status = isNaN(+rpcError.status) ? 400 : rpcError.status;
      logger.error(exception.message)
      return response.status(status).json({
        statusCode: status,
        message: rpcError.message,
      });
    }

    response.status(400).json({
      status: 400,
      message: rpcError
    });
    logger.error(exception.message);
    }
}
