```
http://localhost:3001/adidas-tubular-shadow/VC93-BL-b8e2.html
```

Rõ rồi! Vì bạn không dùng migration, mà sửa trực tiếp DB và sync lại bằng prisma introspect hoặc bin/rails db:schema:dump, nên mình sẽ cung cấp toàn bộ SQL thuần (PostgreSQL) để:
Tuyệt vời, nhờ bạn chia sẻ schema.prisma, giờ mình có thể viết các lệnh SQL thuần một cách chính xác, phù hợp với phong cách hiện tại bạn đang dùng (PostgreSQL + Prisma + Rails mapping). Dưới đây là các lệnh SQL được thiết kế khớp 100% với schema thực tế của bạn:

✅ 1. Tạo bảng categories
```
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  parent_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP(6) DEFAULT now(),
  updated_at TIMESTAMP(6) DEFAULT now()
);
```
🔁 Prisma sẽ introspect ra:

```
model Category {
  id         Int       @id @default(autoincrement())
  name       String    @db.VarChar
  slug       String    @unique @db.VarChar
  parent_id  Int?      @db.Integer
  created_at DateTime? @default(now()) @db.Timestamp(6)
  updated_at DateTime? @default(now()) @db.Timestamp(6)

  @@map("categories")
}
```
✅ 2. Liên kết bảng products với categories
a. Thêm cột category_id:
```
ALTER TABLE products
ADD COLUMN category_id INTEGER;
```
b. Tạo ràng buộc foreign key:
```
ALTER TABLE products
ADD CONSTRAINT fk_products_category
FOREIGN KEY (category_id) REFERENCES categories(id);
```
c. Optional: tạo chỉ mục
```
CREATE INDEX index_products_on_category_id ON products(category_id);
```
Prisma sẽ nhận ra:

```
category_id Int?
category     Category? @relation(fields: [category_id], references: [id])
```
✅ 3. Thêm cột slug, status, is_featured, badge cho bảng products
```
ALTER TABLE products
ADD COLUMN slug VARCHAR UNIQUE,
ADD COLUMN status VARCHAR DEFAULT 'active',
ADD COLUMN is_featured BOOLEAN DEFAULT false,
ADD COLUMN badge VARCHAR;
```
Prisma sẽ introspect ra tương ứng:

```
slug         String?   @unique @db.VarChar
status       String?   @default("active") @db.VarChar
is_featured  Boolean?  @default(false)
badge        String?   @db.VarChar
```
✅ 4. Thêm rating, status, title vào bảng reviews
```
ALTER TABLE reviews
ADD COLUMN rating INTEGER CHECK (rating >= 1 AND rating <= 5),
ADD COLUMN status VARCHAR DEFAULT 'approved',
ADD COLUMN title VARCHAR;
```
→ Prisma sau introspect:

```
rating Int?    @db.Integer
status String? @default("approved") @db.VarChar
title  String? @db.VarChar
```
✅ 5. Unique constraint và indexing
```
CREATE UNIQUE INDEX index_products_on_slug ON products(slug);
```
✅ 6. Optional: Unique màu trong variant theo product (nếu cần)
```
ALTER TABLE variants
ADD CONSTRAINT unique_product_color
UNIQUE (product_id, color);
```
🧪 Kiểm tra schema sau thay đổi:
Bạn có thể dùng lại:

```
bin/rails db:schema:dump
```
```
npx prisma introspect
```
🧩 Kết
Với các câu lệnh SQL ở trên, bạn có thể:

Cập nhật DB bằng tay 1 lần

Sync lại với cả Prisma lẫn Rails mà không bị “lạc quẻ”

Đảm bảo phong cách đúng với @map(...), @relation(...), @default(...)

✅ Nếu bạn muốn mình viết thêm câu lệnh DROP nếu tồn tại để idempotent, hoặc cần tạo luôn PRISMA model tương ứng sau introspect thì nói nhé.


-----------------------------------------------------------------------

✅	Tạo hai bảng model_bases và models theo đúng phong cách Rails chuẩn mà bạn đang dùng:

✅ Bảng model_bases
```
CREATE TABLE model_bases (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  image_url VARCHAR,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
```
✅ Bảng models
```
CREATE TABLE models (
  id BIGSERIAL PRIMARY KEY,
  model_base_id BIGINT NOT NULL REFERENCES model_bases(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  release_date DATE,
  hero_image VARCHAR,
  tech_specs JSONB,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
```
✅ Indexes gợi ý thêm (tăng tốc search/filter theo slug):
```
CREATE INDEX index_model_bases_on_slug ON model_bases(slug);
CREATE INDEX index_models_on_slug ON models(slug);
```
Nếu bạn cần gắn product vào model, thì sau đó bảng products nên có thêm:

```
ALTER TABLE products ADD COLUMN model_id BIGINT REFERENCES models(id) ON DELETE SET NULL;
```
[[ Bạn cần mình viết tiếp bảng product_images, product_suggestions, badges hay features không? ]]

✅ jan_code bằng một field mới trong bảng products bằng SQL thuần, bạn cần xác định:

✅ 1. Bạn muốn thay thế bằng cái gì?
Giả sử bạn muốn đổi jan_code → model_number để dùng đúng cách gọi phổ biến hơn (như adidas dùng VC93-BL-b8e2, IE4073, v.v.)

✅ 2. Các bước thao tác SQL thuần (PostgreSQL)
🔸 Nếu bạn chỉ đổi tên cột:
```
ALTER TABLE products RENAME COLUMN jan_code TO model_number;
```
✅ Giữ nguyên kiểu dữ liệu VARCHAR, không mất dữ liệu.

🔸 Nếu bạn muốn đổi tên cột và đảm bảo định dạng chuẩn (ví dụ: luôn viết hoa, không chứa ký tự lạ), thì có thể tạo trigger sau.
(Optional) Bổ sung constraint:
```
ALTER TABLE products
  ALTER COLUMN model_number SET NOT NULL;
```

-- Chặn giá trị trống hoặc quá dài (nếu cần)
```
ALTER TABLE products
  ADD CONSTRAINT chk_model_number_format CHECK (model_number ~ '^[A-Z0-9]+$');
```
🔸 Nếu muốn xóa jan_code và tạo mới model_number (mất dữ liệu cũ):
```
ALTER TABLE products DROP COLUMN jan_code;

ALTER TABLE products ADD COLUMN model_number VARCHAR;
```
Hay tạo index để truy vấn nhanh theo model_number như:
```
CREATE UNIQUE INDEX index_products_on_model_number ON products(model_number);
```
✅ trigger để auto-upcase hoặc generate model_number từ tên sản phẩm?
Dưới đây là cách viết SQL thuần PostgreSQL để đảm bảo giá trị model_number trong bảng products luôn tự động viết hoa (auto-upcase) mỗi khi INSERT hoặc UPDATE.
✅ Bước 1: Đảm bảo cột model_number tồn tại
Nếu chưa có:
```
ALTER TABLE products ADD COLUMN model_number VARCHAR;
```
✅ Bước 2: Tạo trigger function để upcase
```
CREATE OR REPLACE FUNCTION upcase_model_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.model_number IS NOT NULL THEN
    NEW.model_number := UPPER(NEW.model_number);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
✅ Bước 3: Gắn trigger vào bảng products
```
CREATE TRIGGER trigger_upcase_model_number
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION upcase_model_number();
```
✅ Test
```
INSERT INTO products (name, model_number) VALUES ('Test Shoe', 'VC93-BL-b8e2');
```
-- → sẽ tự lưu thành 'VC93-BL-b8e2'
✅ Gợi ý bổ sung
Đảm bảo không có model trùng bằng cách thêm unique index:
```
CREATE UNIQUE INDEX index_products_on_model_number ON products(model_number);
```
✅ Đây là file db/seeds.rb hoàn chỉnh để đáp ứng toàn bộ các menu bạn đã gửi (menMenuData, womenMenuData, kidsMenuData, backToSchoolMenuData, saleMenuData, trendingMenuData, ...). File này:

Reset toàn bộ dữ liệu liên quan (Product, Variant, Size, ModelBase, Collaboration, Tag, ...).

Tạo đủ các loại size (alpha, numeric, one_size) cho từng location.

Seed các Tag, ModelBase, Collaboration phù hợp theo menu bạn cung cấp.

Sinh ngẫu nhiên 93 sản phẩm mẫu, với nhiều biến thể màu, size, gán tag/modelbase/collab phù hợp.

Bạn có thể chạy bằng:
```
CREATE TABLE collaborations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Bảng nối: 1 product có thể có nhiều collaboration
CREATE TABLE collaborations_products (
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collaboration_id INTEGER NOT NULL REFERENCES collaborations(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collaboration_id)
);

```

```
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
```
CREATE UNIQUE INDEX index_tags_on_slug ON tags(slug);

```
✅ 3. Seed dữ liệu tags (được dùng trong menu các category)
```
INSERT INTO tags (name, slug)
VALUES
  ('New Arrivals', 'new_arrivals'),
  ('Best Sellers', 'best_sellers'),
  ('Prime Delivery', 'prime_delivery'),
  ('Liberty London Florals', 'liberty_london_florals'),
  ('Fast Delivery', 'fast_delivery'),
  ('Soft Lux', 'soft_lux'),
  ('Must Have', 'must_have'),
  ('Summer Savings', 'summer_savings'),
  ('Trending Now', 'trending_now'),
  ('Disney Collection', 'disney_collection'),
  ('Premium Collaborations', 'premium_collaborations'),
  ('Release Dates', 'release_dates'),
  ('Track Pants', 'track_pants');

```
✅ Nếu dùng trong quan hệ nhiều-nhiều (products ↔ tags)
```
CREATE TABLE products_tags (
  id SERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```
```
ALTER TABLE variants 
ALTER COLUMN price SET NOT NULL,
ALTER COLUMN price TYPE double precision;
ALTER TABLE variants RENAME COLUMN originalprice TO compare_at_price;
```
✅ Run seed in Ubuntu Linux
```
 cd /mnt/c/Users/manhn/code/shop-php
 markm@MarkM:/mnt/c/Users/manhn/code/shop-php/apps/ruby-rails-boilerplate$
  bin/rails db:schema:dump
   bin/rails db:seed
```
📌 Tổng kết:
✅ 95 Product

✅ Mỗi product có 4 Variant → 93 × 4 + 4 + 4 = 380 Variant

✅ Mỗi variant có nhiều VariantSize tùy theo loại size

Nếu bạn cần tính tổng số VariantSize hay ảnh được attach, mình cũng có thể thống kê.

```
ALTER TABLE products
ADD COLUMN model_base_id BIGINT;

-- Tùy chọn: thêm ràng buộc khóa ngoại nếu bạn muốn liên kết với bảng model_bases
ALTER TABLE products
ADD CONSTRAINT fk_products_model_base
FOREIGN KEY (model_base_id)
REFERENCES model_bases(id)
ON DELETE SET NULL;

```

```


ALTER TABLE products
ADD COLUMN model_id BIGINT;

ALTER TABLE products
ADD CONSTRAINT fk_products_models
FOREIGN KEY (model_id)
REFERENCES models(id)
ON DELETE SET NULL;
```

```
ALTER TABLE products
ADD COLUMN collaboration_id BIGINT;

ALTER TABLE products
ADD CONSTRAINT fk_products_collaborations
FOREIGN KEY (collaboration_id)
REFERENCES collaborations(id)
ON DELETE SET NULL;
```

```
ALTER TABLE variants RENAME COLUMN sku TO variant_code;
```

```
ALTER TABLE products ADD COLUMN activity VARCHAR;
ALTER TABLE products ADD COLUMN material VARCHAR;
ALTER TABLE products ADD COLUMN collection VARCHAR;

```
