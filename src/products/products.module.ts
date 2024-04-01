import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCT_SERVICE } from '../config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE,
        transport: Transport.TCP,
        options: {
          port: envs.MS_PRODUCT_PORT,
          host: envs.MS_PRODUCT_HOST,
        },
      },
    ]),
  ],
})
export class ProductsModule {}
