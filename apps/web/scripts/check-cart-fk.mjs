import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const rows = await prisma.$queryRaw`
  SELECT conname, pg_get_constraintdef(oid) AS def
  FROM pg_constraint
  WHERE conrelid = 'cart_items'::regclass AND contype = 'f'
`

console.log(JSON.stringify(rows, (_, v) => (typeof v === "bigint" ? v.toString() : v), 2))

await prisma.$disconnect()

// cd "c:\Users\manhn\source\adidas-microservices\apps\web"; @"
// ALTER TABLE cart_items
//   ADD CONSTRAINT fk_cart_items_cart_id
//   FOREIGN KEY (cart_id) REFERENCES carts(id)
//   ON DELETE NO ACTION
//   ON UPDATE NO ACTION;
// "@ | npx prisma db execute --schema prisma/schema.prisma --stdin
// Script executed successfully.