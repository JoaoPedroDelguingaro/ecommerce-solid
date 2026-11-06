# E-commerce SOLID — Projeto 2

## Como rodar

```bash
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

No Windows (PowerShell), use `copy .env.example .env` no lugar do `cp`.

A API sobe em http://localhost:3000.

### Modos de execução

O modo é escolhido pela variável `APP_ENV` no arquivo `.env`. Trocar de modo exige mudar só essa linha e reiniciar a aplicação (o `.env` não é recarregado sozinho). A escolha acontece somente em `src/container/container.ts`.

| | `APP_ENV=dev` | `APP_ENV=test` |
|---|---|---|
| E-mail | `EtherealMailProvider` (envia para o Ethereal, precisa de internet) | `ConsoleMailProvider` (imprime o e-mail no console) |
| Pedidos | `PrismaOrderRepository` (SQLite) | `InMemoryOrderRepository` (array em memória) |

No modo `test`, a aplicação funciona sem internet. Os produtos continuam vindo do SQLite local, então o `prisma:migrate` e o `prisma:seed` precisam ter sido rodados antes.

Um valor diferente de `dev` ou `test` faz a aplicação falhar ao iniciar, com uma mensagem de erro.

## Testando

`POST http://localhost:3000/orders` com o corpo:

```json
{
  "customer": "cliente@ethereal.email",
  "items": [{ "productId": 1, "quantity": 1 }],
  "paymentMethod": "credit_card",
  "paymentDetails": { "cardNumber": "1234567812345678", "cvv": "123" }
}
```

- Produto `1`: livro físico, R$ 100 + R$ 10 de frete (total R$ 110).
- Produto `2`: e-book, R$ 50, sem frete (total R$ 50).
- Formas de pagamento: `credit_card`, `debit_card` e `pix`.

Nos dois modos os totais são os mesmos. O que muda é o e-mail (link do Ethereal no `dev`, impresso no console no `test`) e onde o pedido é guardado.

## Estrutura

```
src/
├── container/     # types.ts (identificadores) e container.ts (único lugar que conhece as classes concretas)
├── domain/        # produtos, pedido e erros de negócio
├── repositories/  # IOrderRepository, IProductRepository, versões Prisma e InMemoryOrderRepository
├── providers/     # IMailProvider, EtherealMailProvider e ConsoleMailProvider
├── payments/      # IPaymentMethod, uma classe por forma de pagamento e o registro
├── services/      # OrderService e NotificationService
├── controllers/   # OrderController: só HTTP
├── app.ts         # pede o OrderController ao container e registra a rota
└── server.ts      # ponto de entrada (reflect-metadata e dotenv)
```

Os services e o controller dependem só de interfaces e do `TYPES`. Nenhum deles lê o `APP_ENV` nem importa Prisma, Nodemailer ou uma implementação concreta.