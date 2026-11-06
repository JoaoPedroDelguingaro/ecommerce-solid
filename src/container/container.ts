import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TYPES } from './types';
import { IMailProvider } from '../providers/IMailProvider';
import { EtherealMailProvider } from '../providers/EtherealMailProvider';
import { ConsoleMailProvider } from '../providers/ConsoleMailProvider';
import { IOrderRepository } from '../repositories/IOrderRepository';
import { IProductRepository } from '../repositories/IProductRepository';
import { PrismaOrderRepository } from '../repositories/PrismaOrderRepository';
import { PrismaProductRepository } from '../repositories/PrismaProductRepository';
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository';
import { IPaymentMethod } from '../payments/IPaymentMethod';
import { CreditCardPayment } from '../payments/CreditCardPayment';
import { DebitCardPayment } from '../payments/DebitCardPayment';
import { PixPayment } from '../payments/PixPayment';
import { PaymentMethodRegistry } from '../payments/PaymentMethodRegistry';
import { NotificationService } from '../services/NotificationService';
import { OrderService } from '../services/OrderService';
import { OrderController } from '../controllers/OrderController';

export function buildContainer(): Container {
  const container = new Container();
  const env = process.env.APP_ENV ?? 'dev';

  if (env === 'test') {
    container.bind<IMailProvider>(TYPES.MailProvider).to(ConsoleMailProvider).inSingletonScope();
    container.bind<IOrderRepository>(TYPES.OrderRepository).to(InMemoryOrderRepository).inSingletonScope();
  } else if (env === 'dev') {
    container.bind<IMailProvider>(TYPES.MailProvider).to(EtherealMailProvider).inSingletonScope();
    container.bind<IOrderRepository>(TYPES.OrderRepository).to(PrismaOrderRepository).inSingletonScope();
  } else {
    throw new Error(`APP_ENV inválido: "${env}". Use "dev" ou "test".`);
  }

  container.bind<PrismaClient>(TYPES.PrismaClient).toDynamicValue(() => new PrismaClient()).inSingletonScope();
  container.bind<IProductRepository>(TYPES.ProductRepository).to(PrismaProductRepository).inSingletonScope();
  container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(CreditCardPayment);
  container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(DebitCardPayment);
  container.bind<IPaymentMethod>(TYPES.PaymentMethod).to(PixPayment);
  container.bind<PaymentMethodRegistry>(TYPES.PaymentMethodRegistry).to(PaymentMethodRegistry);
  container.bind<NotificationService>(TYPES.NotificationService).to(NotificationService);
  container.bind<OrderService>(TYPES.OrderService).to(OrderService);
  container.bind<OrderController>(TYPES.OrderController).to(OrderController);

  return container;
}

export const container = buildContainer();