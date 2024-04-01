import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param, ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PRODUCT_SERVICE } from '../config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from '../common';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  // Create a product
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, {
      name: createProductDto.name,
      price: createProductDto.price,
      description: createProductDto.description,
    });
  }

  // Get all products
  @Get()
  getProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send(
      { cmd: 'find_all_products' },
      {
        limit: paginationDto.limit,
        page: paginationDto.page,
      },
    );
  }

  // Get a product by id
  @Get(':id')
  async getProduct(@Param('id') id: number) {
    try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id }),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // Update a product by id
  @Patch(':id')
  updateProduct(
    @Param('id',ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send({ cmd: 'update_product' }, {
      id,
      name: updateProductDto.name,
      price: updateProductDto.price,
      description: updateProductDto.description,
    }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    )
  }

  // Soft delete
  @Patch('/soft-delete/:id')
  softDeleteProduct(@Param('id') id: number) {
    return this.productsClient.send({ cmd: 'soft_delete_product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    )
  }

  // Hard delete
  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productsClient.send({ cmd: 'remove_product' }, { id }).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    )
  }
}
