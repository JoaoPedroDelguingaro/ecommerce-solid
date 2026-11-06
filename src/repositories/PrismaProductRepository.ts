import { PrismaClient } from '@prisma/client';
import { ProductData } from '../domain/IProduct';
import { IProductRepository } from './IProductRepository';
import { injectable, inject } from 'inversify';
import { TYPES } from '../container/types';

@injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(@inject(TYPES.PrismaClient)   private prisma: PrismaClient) {}

  findById(id: number): Promise<ProductData | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }
}
