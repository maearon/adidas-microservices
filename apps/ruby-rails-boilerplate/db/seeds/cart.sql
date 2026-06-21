CREATE TABLE carts (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT NOT NULL,
  created_at TIMESTAMPTZ(6) NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT now()
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
