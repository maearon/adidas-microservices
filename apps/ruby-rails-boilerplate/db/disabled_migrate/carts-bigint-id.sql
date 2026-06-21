-- Neon: adidas_product_prod / public
-- carts.id: text UUID → bigint (giống wishes)
-- cart_items.cart_id: bigint FK → carts.id
--
-- Chạy xong:
--   cd apps/web && npx prisma introspect && npx prisma generate

BEGIN;

-- 1) Gỡ mọi FK từ cart_items → carts (nếu có)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT con.conname
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_class frel ON frel.oid = con.confrelid
    WHERE rel.relname = 'cart_items'
      AND frel.relname = 'carts'
      AND con.contype = 'f'
  LOOP
    EXECUTE format('ALTER TABLE cart_items DROP CONSTRAINT %I', r.conname);
  END LOOP;
END $$;

-- 2) Xóa data cũ (cart_items.cart_id cũ là bucket, không khớp carts.id)
DELETE FROM cart_items;
DELETE FROM carts;

-- 3) Đổi carts sang bigint id
DROP TABLE IF EXISTS carts;

CREATE TABLE carts (
  id         BIGSERIAL PRIMARY KEY,
  user_id    TEXT NOT NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carts_user_id ON carts(user_id);

-- 4) cart_items.cart_id đã là bigint — chỉ thêm FK
ALTER TABLE cart_items
  ADD CONSTRAINT fk_cart_items_cart_id
  FOREIGN KEY (cart_id) REFERENCES carts(id)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

COMMIT;

-- Kiểm tra (chạy riêng sau COMMIT):
-- SELECT column_name, data_type FROM information_schema.columns
--   WHERE table_name = 'carts' AND column_name = 'id';
-- SELECT conname FROM pg_constraint
--   WHERE conrelid = 'cart_items'::regclass AND contype = 'f';
