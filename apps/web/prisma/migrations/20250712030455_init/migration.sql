-- CreateTable
CREATE TABLE "active_storage_attachments" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "record_type" VARCHAR NOT NULL,
    "record_id" BIGINT NOT NULL,
    "blob_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "active_storage_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_storage_blobs" (
    "id" BIGSERIAL NOT NULL,
    "key" VARCHAR NOT NULL,
    "filename" VARCHAR NOT NULL,
    "content_type" VARCHAR,
    "metadata" TEXT,
    "service_name" VARCHAR NOT NULL,
    "byte_size" BIGINT NOT NULL,
    "checksum" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "active_storage_blobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "active_storage_variant_records" (
    "id" BIGSERIAL NOT NULL,
    "blob_id" BIGINT NOT NULL,
    "variation_digest" VARCHAR NOT NULL,

    CONSTRAINT "active_storage_variant_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ar_internal_metadata" (
    "key" VARCHAR NOT NULL,
    "value" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ar_internal_metadata_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" BIGSERIAL NOT NULL,
    "quantity" INTEGER,
    "cart_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "size" VARCHAR(255),

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "parent_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaborations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collaborations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collaborations_products" (
    "product_id" BIGINT NOT NULL,
    "collaboration_id" INTEGER NOT NULL,

    CONSTRAINT "collaborations_products_pkey" PRIMARY KEY ("product_id","collaboration_id")
);

-- CreateTable
CREATE TABLE "guest_cart_items" (
    "id" BIGSERIAL NOT NULL,
    "quantity" INTEGER,
    "guest_cart_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "size" VARCHAR(255),

    CONSTRAINT "guest_cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_carts" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "guest_carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_wish_items" (
    "id" BIGSERIAL NOT NULL,
    "guest_wish_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "guest_wish_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guest_wishes" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "guest_wishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "model_bases" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "description" TEXT,
    "image_url" VARCHAR,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_bases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" BIGSERIAL NOT NULL,
    "model_base_id" BIGINT NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "description" TEXT,
    "release_date" DATE,
    "hero_image" VARCHAR,
    "tech_specs" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" BIGSERIAL NOT NULL,
    "quantity" INTEGER,
    "order_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR,
    "model_number" VARCHAR NOT NULL,
    "gender" VARCHAR,
    "franchise" VARCHAR,
    "product_type" VARCHAR,
    "brand" VARCHAR,
    "category" VARCHAR,
    "sport" VARCHAR,
    "description_h5" TEXT,
    "description_p" TEXT,
    "specifications" TEXT,
    "care" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "category_id" INTEGER,
    "slug" VARCHAR,
    "status" VARCHAR DEFAULT 'active',
    "is_featured" BOOLEAN DEFAULT false,
    "badge" VARCHAR,
    "model_base_id" BIGINT,
    "model_id" BIGINT,
    "collaboration_id" INTEGER,
    "activity" VARCHAR,
    "material" VARCHAR,
    "collection" VARCHAR,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products_tags" (
    "id" SERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT,
    "product_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "rating" INTEGER,
    "status" VARCHAR DEFAULT 'approved',
    "title" VARCHAR,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schema_migrations" (
    "version" VARCHAR NOT NULL,

    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "sizes" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(10) NOT NULL,
    "system" VARCHAR(20) NOT NULL,
    "location" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_sizes" (
    "id" SERIAL NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "size_id" INTEGER NOT NULL,
    "stock" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "variant_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variants" (
    "id" BIGSERIAL NOT NULL,
    "color" VARCHAR,
    "price" DOUBLE PRECISION NOT NULL,
    "compare_at_price" DOUBLE PRECISION,
    "variant_code" TEXT,
    "stock" INTEGER,
    "product_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wish_items" (
    "id" BIGSERIAL NOT NULL,
    "wish_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "wish_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishes" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "wishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "index_active_storage_attachments_on_blob_id" ON "active_storage_attachments"("blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_attachments_uniqueness" ON "active_storage_attachments"("record_type", "record_id", "name", "blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_blobs_on_key" ON "active_storage_blobs"("key");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_variant_records_uniqueness" ON "active_storage_variant_records"("blob_id", "variation_digest");

-- CreateIndex
CREATE INDEX "idx_cart_items_size" ON "cart_items"("size");

-- CreateIndex
CREATE INDEX "index_cart_items_on_cart_id" ON "cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "index_cart_items_on_product_id" ON "cart_items"("product_id");

-- CreateIndex
CREATE INDEX "index_cart_items_on_variant_id" ON "cart_items"("variant_id");

-- CreateIndex
CREATE INDEX "idx_carts_user_id" ON "carts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collaborations_name_key" ON "collaborations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "collaborations_slug_key" ON "collaborations"("slug");

-- CreateIndex
CREATE INDEX "idx_guest_cart_items_size" ON "guest_cart_items"("size");

-- CreateIndex
CREATE INDEX "index_guest_cart_items_on_guest_cart_id" ON "guest_cart_items"("guest_cart_id");

-- CreateIndex
CREATE INDEX "index_guest_cart_items_on_product_id" ON "guest_cart_items"("product_id");

-- CreateIndex
CREATE INDEX "index_guest_cart_items_on_variant_id" ON "guest_cart_items"("variant_id");

-- CreateIndex
CREATE INDEX "index_guest_wish_items_on_guest_wish_id" ON "guest_wish_items"("guest_wish_id");

-- CreateIndex
CREATE INDEX "index_guest_wish_items_on_product_id" ON "guest_wish_items"("product_id");

-- CreateIndex
CREATE INDEX "index_guest_wish_items_on_variant_id" ON "guest_wish_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "model_bases_slug_key" ON "model_bases"("slug");

-- CreateIndex
CREATE INDEX "index_model_bases_on_slug" ON "model_bases"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "models_slug_key" ON "models"("slug");

-- CreateIndex
CREATE INDEX "index_models_on_slug" ON "models"("slug");

-- CreateIndex
CREATE INDEX "index_order_items_on_order_id" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "index_order_items_on_product_id" ON "order_items"("product_id");

-- CreateIndex
CREATE INDEX "index_order_items_on_variant_id" ON "order_items"("variant_id");

-- CreateIndex
CREATE INDEX "index_orders_on_user_id" ON "orders"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_products_on_model_number" ON "products"("model_number");

-- CreateIndex
CREATE UNIQUE INDEX "index_products_on_slug" ON "products"("slug");

-- CreateIndex
CREATE INDEX "index_products_on_category_id" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "index_reviews_on_product_id" ON "reviews"("product_id");

-- CreateIndex
CREATE INDEX "index_reviews_on_user_id" ON "reviews"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_tags_on_slug" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "index_variants_on_product_id" ON "variants"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_product_color" ON "variants"("product_id", "color");

-- CreateIndex
CREATE INDEX "index_wish_items_on_product_id" ON "wish_items"("product_id");

-- CreateIndex
CREATE INDEX "index_wish_items_on_variant_id" ON "wish_items"("variant_id");

-- CreateIndex
CREATE INDEX "index_wish_items_on_wish_id" ON "wish_items"("wish_id");

-- CreateIndex
CREATE INDEX "index_wishes_on_user_id" ON "wishes"("user_id");

-- AddForeignKey
ALTER TABLE "active_storage_attachments" ADD CONSTRAINT "fk_rails_c3b3935057" FOREIGN KEY ("blob_id") REFERENCES "active_storage_blobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "active_storage_variant_records" ADD CONSTRAINT "fk_rails_993965df05" FOREIGN KEY ("blob_id") REFERENCES "active_storage_blobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "fk_rails_5e1fd37f08" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "fk_rails_681a180e84" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "collaborations_products" ADD CONSTRAINT "collaborations_products_collaboration_id_fkey" FOREIGN KEY ("collaboration_id") REFERENCES "collaborations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "collaborations_products" ADD CONSTRAINT "collaborations_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guest_cart_items" ADD CONSTRAINT "fk_rails_3bdfea312e" FOREIGN KEY ("guest_cart_id") REFERENCES "guest_carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guest_cart_items" ADD CONSTRAINT "fk_rails_4ba9457f5f" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guest_cart_items" ADD CONSTRAINT "fk_rails_603cdced22" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guest_wish_items" ADD CONSTRAINT "fk_rails_5004853ca5" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guest_wish_items" ADD CONSTRAINT "fk_rails_df1d3a30db" FOREIGN KEY ("guest_wish_id") REFERENCES "guest_wishes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "guest_wish_items" ADD CONSTRAINT "fk_rails_ed1f2f0948" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_model_base_id_fkey" FOREIGN KEY ("model_base_id") REFERENCES "model_bases"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "fk_rails_476172d337" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "fk_rails_e3cb28f071" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "fk_rails_f1a29ddd47" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "fk_products_category" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "fk_products_collaborations" FOREIGN KEY ("collaboration_id") REFERENCES "collaborations"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "fk_products_models" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products_tags" ADD CONSTRAINT "products_tags_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products_tags" ADD CONSTRAINT "products_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "fk_rails_bedd9094d4" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "variant_sizes" ADD CONSTRAINT "fk_size" FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "variant_sizes" ADD CONSTRAINT "fk_variant" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "variants" ADD CONSTRAINT "fk_rails_19f8efee69" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wish_items" ADD CONSTRAINT "fk_rails_5fe4dae293" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wish_items" ADD CONSTRAINT "fk_rails_6357d5ef81" FOREIGN KEY ("wish_id") REFERENCES "wishes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wish_items" ADD CONSTRAINT "fk_rails_f4c6b03fcc" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
