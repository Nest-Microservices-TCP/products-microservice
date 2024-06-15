import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);
    /**
     * La razon de la expresion (page - 1) es porque,
     * skip lo que hace es saltar registros, y las posiciones
     * en javascript se leen a partir del 0, por ende, si el
     * usuario quiere ver la pagina 1, esta es la cero, multiplicada
     * por el limite da 0, por lo que no se salta ningun registro
     *
     * Y asi sucesivamente con las demas paginas
     */
    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { available: true },
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    /**
     * El filtro de available es para revisar si el
     * producto no ha sido afectado por un soft delete y asi
     * no manipular productos que en teoria estan eliminados
     */
    const product = await this.product.findFirst({
      where: {
        id: id,
        available: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with id=${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // return this.product.delete({
    //   where: { id },
    // });

    //Soft delete
    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return product;
  }
}
