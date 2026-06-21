DELETE from cart_items;
DELETE from carts;

DELETE from wishes;
DELETE from wish_items;

DELETE from guest_carts;
DELETE from guest_cart_items;

DELETE from guest_wishes;
DELETE from guest_wish_items;
-- Reference SQL for Neon (already applied manually).
-- carts.user_id + wishes.user_id → TEXT (Better Auth UUID), no FK to users.

BEGIN;

ALTER TABLE public.carts   DROP CONSTRAINT IF EXISTS fk_user;
ALTER TABLE public.carts   DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
ALTER TABLE public.wishes  DROP CONSTRAINT IF EXISTS fk_user;
ALTER TABLE public.wishes  DROP CONSTRAINT IF EXISTS wishes_user_id_fkey;

ALTER TABLE public.carts
  ALTER COLUMN user_id TYPE TEXT USING user_id::text;

ALTER TABLE public.wishes
  ALTER COLUMN user_id TYPE TEXT USING user_id::text;

CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts (user_id);
CREATE INDEX IF NOT EXISTS index_wishes_on_user_id ON public.wishes (user_id);

COMMIT;
