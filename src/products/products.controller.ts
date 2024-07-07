import {
  Controller,
  // Get,
  // Post,
  // Body,
  // Patch,
  // Param,
  // Delete,
  // Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Podemos crear aplicaciones híbridas, las cuales tienen diferentes
   * métodos de comunicación, ejemplo, podrías dejar el decorador @Post
   * para que se puedan comunicar a este microservicio a traves de Http
   * asi como dejar el decorador @MessagePattern para que igualmente
   * puedan comunicarse al microservicio a traves del transporter
   * definido en el microservicio
   */
  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  /**
   * Ahora la data que debe ser recibida para la operación del método
   * ya no vendrá en un @Body ya que la comunicación no es Http, ahora
   * esta vendrá en el @Payload
   */
  // create(@Body() createProductDto: CreateProductDto) {
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'findAll_products' })
  // findAll(@Query() paginationDto: PaginationDto) {
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'findOne_product' })
  // findOne(@Param('id') id: string) {
  /**
   * En la sintaxis @Payload('id') se refiere a que tome del
   * payload la propiedad con la llave 'id'
   */
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(+id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'updateOne_product' })
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  /**
   * Ahora es necesario agregar el campo id al DTO para poder recibirlo y usarlo
   * desde el payload
   */
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'deleteOne_product' })
  // remove(@Param('id') id: string) {
  remove(@Payload('id') id: number) {
    return this.productsService.remove(+id);
  }

  @MessagePattern({ cmd: 'validate_products' })
  validateProducts(@Payload() ids: number[]) {
    return this.productsService.validateProducts(ids);
  }
}
