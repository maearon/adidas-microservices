-- CreateEnum
CREATE TYPE "public"."GameType" AS ENUM ('mcq', 'open_ended');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "public"."MessageType" AS ENUM ('TEXT', 'IMAGE', 'FILE');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('LIKE', 'FOLLOW', 'COMMENT');

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AspNetRoleClaims" (
    "Id" INTEGER NOT NULL,
    "RoleId" TEXT NOT NULL,
    "ClaimType" TEXT,
    "ClaimValue" TEXT,

    CONSTRAINT "AspNetRoleClaims_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."AspNetRoles" (
    "Id" TEXT NOT NULL,
    "Name" VARCHAR(256),
    "NormalizedName" VARCHAR(256),
    "ConcurrencyStamp" TEXT,

    CONSTRAINT "PK_AspNetRoles" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."AspNetUserClaims" (
    "Id" INTEGER NOT NULL,
    "UserId" TEXT NOT NULL,
    "ClaimType" TEXT,
    "ClaimValue" TEXT,

    CONSTRAINT "AspNetUserClaims_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."AspNetUserLogins" (
    "LoginProvider" TEXT NOT NULL,
    "ProviderKey" TEXT NOT NULL,
    "ProviderDisplayName" TEXT,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "AspNetUserLogins_pkey" PRIMARY KEY ("LoginProvider","ProviderKey")
);

-- CreateTable
CREATE TABLE "public"."AspNetUserRoles" (
    "UserId" TEXT NOT NULL,
    "RoleId" TEXT NOT NULL,

    CONSTRAINT "AspNetUserRoles_pkey" PRIMARY KEY ("UserId","RoleId")
);

-- CreateTable
CREATE TABLE "public"."AspNetUserTokens" (
    "UserId" TEXT NOT NULL,
    "LoginProvider" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Value" TEXT,

    CONSTRAINT "AspNetUserTokens_pkey" PRIMARY KEY ("UserId","LoginProvider","Name")
);

-- CreateTable
CREATE TABLE "public"."AspNetUsers" (
    "Id" TEXT NOT NULL,
    "Name" VARCHAR(50) NOT NULL,
    "ActivationDigest" TEXT,
    "Activated" BOOLEAN NOT NULL,
    "ActivatedAt" TIMESTAMPTZ(6),
    "RememberDigest" TEXT,
    "ResetDigest" TEXT,
    "ResetSentAt" TIMESTAMPTZ(6),
    "CreatedAt" TIMESTAMPTZ(6) NOT NULL,
    "UpdatedAt" TIMESTAMPTZ(6) NOT NULL,
    "Admin" BOOLEAN NOT NULL,
    "UserName" VARCHAR(256),
    "NormalizedUserName" VARCHAR(256),
    "Email" VARCHAR(256),
    "NormalizedEmail" VARCHAR(256),
    "EmailConfirmed" BOOLEAN NOT NULL,
    "PasswordHash" TEXT,
    "SecurityStamp" TEXT,
    "ConcurrencyStamp" TEXT,
    "PhoneNumber" TEXT,
    "PhoneNumberConfirmed" BOOLEAN NOT NULL,
    "TwoFactorEnabled" BOOLEAN NOT NULL,
    "LockoutEnd" TIMESTAMPTZ(6),
    "LockoutEnabled" BOOLEAN NOT NULL,
    "AccessFailedCount" INTEGER NOT NULL,

    CONSTRAINT "AspNetUsers_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Game" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timeStarted" TIMESTAMP(3) NOT NULL,
    "topic" TEXT NOT NULL,
    "timeEnded" TIMESTAMP(3),
    "gameType" "public"."GameType" NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Microposts" (
    "Id" BIGINT NOT NULL,
    "Content" VARCHAR(140) NOT NULL,
    "UserId" TEXT NOT NULL,
    "ImagePath" TEXT,
    "CreatedAt" TIMESTAMPTZ(6) NOT NULL,
    "UpdatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Microposts_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "options" JSONB,
    "percentageCorrect" DOUBLE PRECISION,
    "isCorrect" BOOLEAN,
    "questionType" "public"."GameType" NOT NULL,
    "userAnswer" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Relationships" (
    "FollowerId" TEXT NOT NULL,
    "FollowedId" TEXT NOT NULL,
    "CreatedAt" TIMESTAMPTZ(6) NOT NULL,
    "UpdatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Relationships_pkey" PRIMARY KEY ("FollowerId","FollowedId")
);

-- CreateTable
CREATE TABLE "public"."__EFMigrationsHistory" (
    "MigrationId" VARCHAR(150) NOT NULL,
    "ProductVersion" VARCHAR(32) NOT NULL,

    CONSTRAINT "__EFMigrationsHistory_pkey" PRIMARY KEY ("MigrationId")
);

-- CreateTable
CREATE TABLE "public"."account_emailaddress" (
    "id" INTEGER NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "primary" BOOLEAN NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "account_emailaddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account_emailconfirmation" (
    "id" INTEGER NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL,
    "sent" TIMESTAMPTZ(6),
    "key" VARCHAR(64) NOT NULL,
    "email_address_id" INTEGER NOT NULL,

    CONSTRAINT "account_emailconfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts_user" (
    "id" BIGINT NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "last_login" TIMESTAMPTZ(6),
    "is_superuser" BOOLEAN NOT NULL,
    "username" VARCHAR(150) NOT NULL,
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "is_staff" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "date_joined" TIMESTAMPTZ(6) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "admin" BOOLEAN,
    "activated" BOOLEAN NOT NULL,
    "activated_at" TIMESTAMPTZ(6),
    "remember_digest" VARCHAR(255),
    "activation_digest" VARCHAR(255),
    "reset_digest" VARCHAR(255),
    "reset_sent_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "accounts_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts_user_groups" (
    "id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "accounts_user_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts_user_user_permissions" (
    "id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "accounts_user_user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."active_storage_attachments" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "record_type" VARCHAR NOT NULL,
    "record_id" BIGINT NOT NULL,
    "blob_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "active_storage_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."active_storage_blobs" (
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
CREATE TABLE "public"."active_storage_variant_records" (
    "id" BIGSERIAL NOT NULL,
    "blob_id" BIGINT NOT NULL,
    "variation_digest" VARCHAR NOT NULL,

    CONSTRAINT "active_storage_variant_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ar_internal_metadata" (
    "key" VARCHAR NOT NULL,
    "value" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "ar_internal_metadata_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."auth_group" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "auth_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_group_permissions" (
    "id" BIGINT NOT NULL,
    "group_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "auth_group_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_permission" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "content_type_id" INTEGER NOT NULL,
    "codename" VARCHAR(100) NOT NULL,

    CONSTRAINT "auth_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cart_items" (
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
CREATE TABLE "public"."carts" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "slug" VARCHAR NOT NULL,
    "parent_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."collaborations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collaborations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."collaborations_products" (
    "product_id" BIGINT NOT NULL,
    "collaboration_id" INTEGER NOT NULL,

    CONSTRAINT "collaborations_products_pkey" PRIMARY KEY ("product_id","collaboration_id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."django_admin_log" (
    "id" INTEGER NOT NULL,
    "action_time" TIMESTAMPTZ(6) NOT NULL,
    "object_id" TEXT,
    "object_repr" VARCHAR(200) NOT NULL,
    "action_flag" SMALLINT NOT NULL,
    "change_message" TEXT NOT NULL,
    "content_type_id" INTEGER,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "django_admin_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."django_content_type" (
    "id" INTEGER NOT NULL,
    "app_label" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,

    CONSTRAINT "django_content_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."django_migrations" (
    "id" BIGINT NOT NULL,
    "app" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "applied" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "django_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."django_session" (
    "session_key" VARCHAR(40) NOT NULL,
    "session_data" TEXT NOT NULL,
    "expire_date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "django_session_pkey" PRIMARY KEY ("session_key")
);

-- CreateTable
CREATE TABLE "public"."django_site" (
    "id" INTEGER NOT NULL,
    "domain" VARCHAR(100) NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "django_site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events_event" (
    "id" BIGINT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "events_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."follows" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."guest_cart_items" (
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
CREATE TABLE "public"."guest_carts" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "guest_carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guest_wish_items" (
    "id" BIGSERIAL NOT NULL,
    "guest_wish_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "guest_wish_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."guest_wishes" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "guest_wishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."likes" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."messages" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "public"."MessageType" DEFAULT 'TEXT',
    "room_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."microposts" (
    "id" BIGSERIAL NOT NULL,
    "content" TEXT,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "microposts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."microposts_micropost" (
    "id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "picture" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "microposts_micropost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."model_bases" (
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
CREATE TABLE "public"."models" (
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
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "postId" TEXT,
    "type" "public"."NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."order_items" (
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
CREATE TABLE "public"."orders" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."post_media" (
    "id" TEXT NOT NULL,
    "postId" TEXT,
    "media_type" "public"."MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."products" (
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
CREATE TABLE "public"."products_tags" (
    "id" SERIAL NOT NULL,
    "product_id" BIGINT NOT NULL,
    "tag_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR,
    "description" VARCHAR,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."relationships" (
    "id" BIGSERIAL NOT NULL,
    "follower_id" TEXT,
    "followed_id" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."relationships_relationship" (
    "id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "followed_id" BIGINT NOT NULL,
    "follower_id" BIGINT NOT NULL,

    CONSTRAINT "relationships_relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reviews" (
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
CREATE TABLE "public"."rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'public',
    "last_message" TEXT,
    "last_message_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."schema_migrations" (
    "version" VARCHAR NOT NULL,

    CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sizes" (
    "id" SERIAL NOT NULL,
    "label" VARCHAR(10) NOT NULL,
    "system" VARCHAR(20) NOT NULL,
    "location" VARCHAR(10) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."socialaccount_socialaccount" (
    "id" INTEGER NOT NULL,
    "provider" VARCHAR(200) NOT NULL,
    "uid" VARCHAR(191) NOT NULL,
    "last_login" TIMESTAMPTZ(6) NOT NULL,
    "date_joined" TIMESTAMPTZ(6) NOT NULL,
    "extra_data" JSONB NOT NULL,
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "socialaccount_socialaccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."socialaccount_socialapp" (
    "id" INTEGER NOT NULL,
    "provider" VARCHAR(30) NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "client_id" VARCHAR(191) NOT NULL,
    "secret" VARCHAR(191) NOT NULL,
    "key" VARCHAR(191) NOT NULL,
    "provider_id" VARCHAR(200) NOT NULL,
    "settings" JSONB NOT NULL,

    CONSTRAINT "socialaccount_socialapp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."socialaccount_socialapp_sites" (
    "id" BIGINT NOT NULL,
    "socialapp_id" INTEGER NOT NULL,
    "site_id" INTEGER NOT NULL,

    CONSTRAINT "socialaccount_socialapp_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."socialaccount_socialtoken" (
    "id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "token_secret" TEXT NOT NULL,
    "expires_at" TIMESTAMPTZ(6),
    "account_id" INTEGER NOT NULL,
    "app_id" INTEGER,

    CONSTRAINT "socialaccount_socialtoken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" BIGSERIAL NOT NULL,
    "description" VARCHAR,
    "done" BOOLEAN,
    "project_id" BIGINT,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."token_blacklist_blacklistedtoken" (
    "id" BIGINT NOT NULL,
    "blacklisted_at" TIMESTAMPTZ(6) NOT NULL,
    "token_id" BIGINT NOT NULL,

    CONSTRAINT "token_blacklist_blacklistedtoken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."token_blacklist_outstandingtoken" (
    "id" BIGINT NOT NULL,
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "user_id" BIGINT,
    "jti" VARCHAR(255) NOT NULL,

    CONSTRAINT "token_blacklist_outstandingtoken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."topic_count" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "topic_count_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_providers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "provider" VARCHAR(50) NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "email" TEXT,
    "name" TEXT,
    "avatar_url" TEXT,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "raw_data" JSONB,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" VARCHAR,
    "refresh_token" VARCHAR,
    "refresh_token_expiration_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "password_digest" VARCHAR,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "remember_digest" VARCHAR,
    "admin" BOOLEAN DEFAULT false,
    "activation_digest" VARCHAR,
    "activated" BOOLEAN DEFAULT false,
    "activated_at" TIMESTAMP(6),
    "reset_digest" VARCHAR,
    "reset_sent_at" TIMESTAMP(6),
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "date_joined" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ(6),
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR NOT NULL DEFAULT 'pbkdf2_sha256$720000$mf7gOJi6b6lcClmMxd0UaY$JEXwqKpSjnuNmBE42U9DFtjLO6x2fIPCnOQ9oA59iHo=',
    "first_name" VARCHAR NOT NULL DEFAULT '',
    "last_name" VARCHAR NOT NULL DEFAULT '',
    "provider" VARCHAR(50),
    "avatar" TEXT,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users_for_mailer_tests" (
    "id" TEXT NOT NULL,
    "name" VARCHAR,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" VARCHAR,
    "refresh_token" VARCHAR,
    "refresh_token_expiration_at" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,
    "password_digest" VARCHAR,
    "passwordHash" TEXT,
    "googleId" TEXT,
    "avatarUrl" TEXT,
    "bio" TEXT,
    "remember_digest" VARCHAR,
    "admin" BOOLEAN DEFAULT false,
    "activation_digest" VARCHAR,
    "activated" BOOLEAN DEFAULT false,
    "activated_at" TIMESTAMP(6),
    "reset_digest" VARCHAR,
    "reset_sent_at" TIMESTAMP(6),
    "is_staff" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "date_joined" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(6),
    "is_superuser" BOOLEAN NOT NULL DEFAULT false,
    "password" VARCHAR NOT NULL DEFAULT 'pbkdf2_sha256$720000$mf7gOJi6b6lcClmMxd0UaY$JEXwqKpSjnuNmBE42U9DFtjLO6x2fIPCnOQ9oA59iHo=',
    "first_name" VARCHAR NOT NULL DEFAULT '',
    "last_name" VARCHAR NOT NULL DEFAULT '',
    "provider" VARCHAR(50),

    CONSTRAINT "users_for_mailer_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."variant_sizes" (
    "id" SERIAL NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "size_id" INTEGER NOT NULL,
    "stock" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "variant_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."variants" (
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
CREATE TABLE "public"."wish_items" (
    "id" BIGSERIAL NOT NULL,
    "wish_id" BIGINT NOT NULL,
    "product_id" BIGINT NOT NULL,
    "variant_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "wish_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."wishes" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "wishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "public"."Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE INDEX "IX_AspNetRoleClaims_RoleId" ON "public"."AspNetRoleClaims"("RoleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleNameIndex" ON "public"."AspNetRoles"("NormalizedName");

-- CreateIndex
CREATE INDEX "IX_AspNetUserClaims_UserId" ON "public"."AspNetUserClaims"("UserId");

-- CreateIndex
CREATE INDEX "IX_AspNetUserLogins_UserId" ON "public"."AspNetUserLogins"("UserId");

-- CreateIndex
CREATE INDEX "IX_AspNetUserRoles_RoleId" ON "public"."AspNetUserRoles"("RoleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNameIndex" ON "public"."AspNetUsers"("NormalizedUserName");

-- CreateIndex
CREATE INDEX "EmailIndex" ON "public"."AspNetUsers"("NormalizedEmail");

-- CreateIndex
CREATE INDEX "Game_userId_idx" ON "public"."Game"("userId");

-- CreateIndex
CREATE INDEX "IX_Microposts_UserId" ON "public"."Microposts"("UserId");

-- CreateIndex
CREATE INDEX "Question_gameId_idx" ON "public"."Question"("gameId");

-- CreateIndex
CREATE INDEX "IX_Relationships_FollowedId" ON "public"."Relationships"("FollowedId");

-- CreateIndex
CREATE INDEX "account_emailaddress_email_03be32b2" ON "public"."account_emailaddress"("email");

-- CreateIndex
CREATE INDEX "account_emailaddress_email_03be32b2_like" ON "public"."account_emailaddress"("email");

-- CreateIndex
CREATE INDEX "account_emailaddress_user_id_2c513194" ON "public"."account_emailaddress"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_emailaddress_user_id_email_987c8728_uniq" ON "public"."account_emailaddress"("user_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "account_emailconfirmation_key_key" ON "public"."account_emailconfirmation"("key");

-- CreateIndex
CREATE INDEX "account_emailconfirmation_email_address_id_5b7f8c58" ON "public"."account_emailconfirmation"("email_address_id");

-- CreateIndex
CREATE INDEX "account_emailconfirmation_key_f43612bd_like" ON "public"."account_emailconfirmation"("key");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_username_key" ON "public"."accounts_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_email_key" ON "public"."accounts_user"("email");

-- CreateIndex
CREATE INDEX "accounts_user_email_b2644a56_like" ON "public"."accounts_user"("email");

-- CreateIndex
CREATE INDEX "accounts_user_username_6088629e_like" ON "public"."accounts_user"("username");

-- CreateIndex
CREATE INDEX "accounts_user_groups_group_id_bd11a704" ON "public"."accounts_user_groups"("group_id");

-- CreateIndex
CREATE INDEX "accounts_user_groups_user_id_52b62117" ON "public"."accounts_user_groups"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_groups_user_id_group_id_59c0b32f_uniq" ON "public"."accounts_user_groups"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "accounts_user_user_permissions_permission_id_113bb443" ON "public"."accounts_user_user_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "accounts_user_user_permissions_user_id_e4f0a161" ON "public"."accounts_user_user_permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq" ON "public"."accounts_user_user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE INDEX "index_active_storage_attachments_on_blob_id" ON "public"."active_storage_attachments"("blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_attachments_uniqueness" ON "public"."active_storage_attachments"("record_type", "record_id", "name", "blob_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_blobs_on_key" ON "public"."active_storage_blobs"("key");

-- CreateIndex
CREATE UNIQUE INDEX "index_active_storage_variant_records_uniqueness" ON "public"."active_storage_variant_records"("blob_id", "variation_digest");

-- CreateIndex
CREATE UNIQUE INDEX "auth_group_name_key" ON "public"."auth_group"("name");

-- CreateIndex
CREATE INDEX "auth_group_name_a6ea08ec_like" ON "public"."auth_group"("name");

-- CreateIndex
CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "public"."auth_group_permissions"("group_id");

-- CreateIndex
CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "public"."auth_group_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" ON "public"."auth_group_permissions"("group_id", "permission_id");

-- CreateIndex
CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "public"."auth_permission"("content_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_permission_content_type_id_codename_01ab375a_uniq" ON "public"."auth_permission"("content_type_id", "codename");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_postId_key" ON "public"."bookmarks"("userId", "postId");

-- CreateIndex
CREATE INDEX "idx_cart_items_size" ON "public"."cart_items"("size");

-- CreateIndex
CREATE INDEX "index_cart_items_on_cart_id" ON "public"."cart_items"("cart_id");

-- CreateIndex
CREATE INDEX "index_cart_items_on_product_id" ON "public"."cart_items"("product_id");

-- CreateIndex
CREATE INDEX "index_cart_items_on_variant_id" ON "public"."cart_items"("variant_id");

-- CreateIndex
CREATE INDEX "idx_carts_user_id" ON "public"."carts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "collaborations_name_key" ON "public"."collaborations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "collaborations_slug_key" ON "public"."collaborations"("slug");

-- CreateIndex
CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "public"."django_admin_log"("content_type_id");

-- CreateIndex
CREATE INDEX "django_admin_log_user_id_c564eba6" ON "public"."django_admin_log"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "django_content_type_app_label_model_76bd3d3b_uniq" ON "public"."django_content_type"("app_label", "model");

-- CreateIndex
CREATE INDEX "django_session_expire_date_a5c62663" ON "public"."django_session"("expire_date");

-- CreateIndex
CREATE INDEX "django_session_session_key_c0390e0f_like" ON "public"."django_session"("session_key");

-- CreateIndex
CREATE UNIQUE INDEX "django_site_domain_a2e37b91_uniq" ON "public"."django_site"("domain");

-- CreateIndex
CREATE INDEX "django_site_domain_a2e37b91_like" ON "public"."django_site"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "follows_followerId_followingId_key" ON "public"."follows"("followerId", "followingId");

-- CreateIndex
CREATE INDEX "idx_guest_cart_items_size" ON "public"."guest_cart_items"("size");

-- CreateIndex
CREATE INDEX "index_guest_cart_items_on_guest_cart_id" ON "public"."guest_cart_items"("guest_cart_id");

-- CreateIndex
CREATE INDEX "index_guest_cart_items_on_product_id" ON "public"."guest_cart_items"("product_id");

-- CreateIndex
CREATE INDEX "index_guest_cart_items_on_variant_id" ON "public"."guest_cart_items"("variant_id");

-- CreateIndex
CREATE INDEX "index_guest_wish_items_on_guest_wish_id" ON "public"."guest_wish_items"("guest_wish_id");

-- CreateIndex
CREATE INDEX "index_guest_wish_items_on_product_id" ON "public"."guest_wish_items"("product_id");

-- CreateIndex
CREATE INDEX "index_guest_wish_items_on_variant_id" ON "public"."guest_wish_items"("variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_postId_key" ON "public"."likes"("userId", "postId");

-- CreateIndex
CREATE INDEX "index_messages_on_room_id" ON "public"."messages"("room_id");

-- CreateIndex
CREATE INDEX "index_messages_on_room_id_and_created_at" ON "public"."messages"("room_id", "created_at");

-- CreateIndex
CREATE INDEX "index_messages_on_user_id" ON "public"."messages"("user_id");

-- CreateIndex
CREATE INDEX "index_messages_on_user_id_and_created_at" ON "public"."messages"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "index_microposts_on_user_id" ON "public"."microposts"("user_id");

-- CreateIndex
CREATE INDEX "index_microposts_on_user_id_and_created_at" ON "public"."microposts"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "microposts_micropost_user_id_e146449e" ON "public"."microposts_micropost"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "model_bases_slug_key" ON "public"."model_bases"("slug");

-- CreateIndex
CREATE INDEX "index_model_bases_on_slug" ON "public"."model_bases"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "models_slug_key" ON "public"."models"("slug");

-- CreateIndex
CREATE INDEX "index_models_on_slug" ON "public"."models"("slug");

-- CreateIndex
CREATE INDEX "index_order_items_on_order_id" ON "public"."order_items"("order_id");

-- CreateIndex
CREATE INDEX "index_order_items_on_product_id" ON "public"."order_items"("product_id");

-- CreateIndex
CREATE INDEX "index_order_items_on_variant_id" ON "public"."order_items"("variant_id");

-- CreateIndex
CREATE INDEX "index_orders_on_user_id" ON "public"."orders"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_products_on_model_number" ON "public"."products"("model_number");

-- CreateIndex
CREATE UNIQUE INDEX "index_products_on_slug" ON "public"."products"("slug");

-- CreateIndex
CREATE INDEX "index_products_on_category_id" ON "public"."products"("category_id");

-- CreateIndex
CREATE INDEX "index_relationships_on_followed_id" ON "public"."relationships"("followed_id");

-- CreateIndex
CREATE INDEX "index_relationships_on_follower_id" ON "public"."relationships"("follower_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_relationships_on_follower_id_and_followed_id" ON "public"."relationships"("follower_id", "followed_id");

-- CreateIndex
CREATE INDEX "relationships_relationship_followed_id_571ba2f9" ON "public"."relationships_relationship"("followed_id");

-- CreateIndex
CREATE INDEX "relationships_relationship_follower_id_2f35aab6" ON "public"."relationships_relationship"("follower_id");

-- CreateIndex
CREATE UNIQUE INDEX "relationships_relationsh_follower_id_followed_id_1b8dba39_uniq" ON "public"."relationships_relationship"("follower_id", "followed_id");

-- CreateIndex
CREATE INDEX "index_reviews_on_product_id" ON "public"."reviews"("product_id");

-- CreateIndex
CREATE INDEX "index_reviews_on_user_id" ON "public"."reviews"("user_id");

-- CreateIndex
CREATE INDEX "socialaccount_socialaccount_user_id_8146e70c" ON "public"."socialaccount_socialaccount"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "socialaccount_socialaccount_provider_uid_fc810c6e_uniq" ON "public"."socialaccount_socialaccount"("provider", "uid");

-- CreateIndex
CREATE INDEX "socialaccount_socialapp_sites_site_id_2579dee5" ON "public"."socialaccount_socialapp_sites"("site_id");

-- CreateIndex
CREATE INDEX "socialaccount_socialapp_sites_socialapp_id_97fb6e7d" ON "public"."socialaccount_socialapp_sites"("socialapp_id");

-- CreateIndex
CREATE UNIQUE INDEX "socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq" ON "public"."socialaccount_socialapp_sites"("socialapp_id", "site_id");

-- CreateIndex
CREATE INDEX "socialaccount_socialtoken_account_id_951f210e" ON "public"."socialaccount_socialtoken"("account_id");

-- CreateIndex
CREATE INDEX "socialaccount_socialtoken_app_id_636a42d7" ON "public"."socialaccount_socialtoken"("app_id");

-- CreateIndex
CREATE UNIQUE INDEX "socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq" ON "public"."socialaccount_socialtoken"("app_id", "account_id");

-- CreateIndex
CREATE UNIQUE INDEX "index_tags_on_slug" ON "public"."tags"("slug");

-- CreateIndex
CREATE INDEX "index_tasks_on_project_id" ON "public"."tasks"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_blacklist_blacklistedtoken_token_id_key" ON "public"."token_blacklist_blacklistedtoken"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq" ON "public"."token_blacklist_outstandingtoken"("jti");

-- CreateIndex
CREATE INDEX "token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like" ON "public"."token_blacklist_outstandingtoken"("jti");

-- CreateIndex
CREATE INDEX "token_blacklist_outstandingtoken_user_id_83bc629a" ON "public"."token_blacklist_outstandingtoken"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "topic_count_topic_key" ON "public"."topic_count"("topic");

-- CreateIndex
CREATE UNIQUE INDEX "user_providers_provider_provider_user_id_key" ON "public"."user_providers"("provider", "provider_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "index_admin_users_email_uniqueness" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "index_admin_users_refresh_token_uniqueness" ON "public"."users"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_googleId_key" ON "public"."users"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "mailer_users_username_key" ON "public"."users_for_mailer_tests"("username");

-- CreateIndex
CREATE UNIQUE INDEX "index_mailer_users_email_uniqueness" ON "public"."users_for_mailer_tests"("email");

-- CreateIndex
CREATE UNIQUE INDEX "index_mailer_users_refresh_token_uniqueness" ON "public"."users_for_mailer_tests"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "mailer_users_googleId_key" ON "public"."users_for_mailer_tests"("googleId");

-- CreateIndex
CREATE INDEX "index_variants_on_product_id" ON "public"."variants"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_product_color" ON "public"."variants"("product_id", "color");

-- CreateIndex
CREATE INDEX "index_wish_items_on_product_id" ON "public"."wish_items"("product_id");

-- CreateIndex
CREATE INDEX "index_wish_items_on_variant_id" ON "public"."wish_items"("variant_id");

-- CreateIndex
CREATE INDEX "index_wish_items_on_wish_id" ON "public"."wish_items"("wish_id");

-- CreateIndex
CREATE INDEX "index_wishes_on_user_id" ON "public"."wishes"("user_id");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserClaims" ADD CONSTRAINT "FK_AspNetUserClaims_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserLogins" ADD CONSTRAINT "FK_AspNetUserLogins_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserRoles" ADD CONSTRAINT "FK_AspNetUserRoles_AspNetRoles_RoleId" FOREIGN KEY ("RoleId") REFERENCES "public"."AspNetRoles"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserRoles" ADD CONSTRAINT "FK_AspNetUserRoles_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."AspNetUserTokens" ADD CONSTRAINT "FK_AspNetUserTokens_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Game" ADD CONSTRAINT "Game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Microposts" ADD CONSTRAINT "FK_Microposts_AspNetUsers_UserId" FOREIGN KEY ("UserId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Relationships" ADD CONSTRAINT "FK_Relationships_AspNetUsers_FollowedId" FOREIGN KEY ("FollowedId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."Relationships" ADD CONSTRAINT "FK_Relationships_AspNetUsers_FollowerId" FOREIGN KEY ("FollowerId") REFERENCES "public"."AspNetUsers"("Id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."account_emailaddress" ADD CONSTRAINT "account_emailaddress_user_id_2c513194_fk_accounts_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."accounts_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."account_emailconfirmation" ADD CONSTRAINT "account_emailconfirm_email_address_id_5b7f8c58_fk_account_e" FOREIGN KEY ("email_address_id") REFERENCES "public"."account_emailaddress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."accounts_user_groups" ADD CONSTRAINT "accounts_user_groups_group_id_bd11a704_fk_auth_group_id" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."accounts_user_groups" ADD CONSTRAINT "accounts_user_groups_user_id_52b62117_fk_accounts_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."accounts_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."accounts_user_user_permissions" ADD CONSTRAINT "accounts_user_user_p_permission_id_113bb443_fk_auth_perm" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."accounts_user_user_permissions" ADD CONSTRAINT "accounts_user_user_p_user_id_e4f0a161_fk_accounts_" FOREIGN KEY ("user_id") REFERENCES "public"."accounts_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."active_storage_attachments" ADD CONSTRAINT "fk_rails_c3b3935057" FOREIGN KEY ("blob_id") REFERENCES "public"."active_storage_blobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."active_storage_variant_records" ADD CONSTRAINT "fk_rails_993965df05" FOREIGN KEY ("blob_id") REFERENCES "public"."active_storage_blobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auth_group_permissions" ADD CONSTRAINT "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."auth_permission" ADD CONSTRAINT "auth_permission_content_type_id_2f476e4b_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bookmarks" ADD CONSTRAINT "bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "fk_rails_5e1fd37f08" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."cart_items" ADD CONSTRAINT "fk_rails_681a180e84" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."carts" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."collaborations_products" ADD CONSTRAINT "collaborations_products_collaboration_id_fkey" FOREIGN KEY ("collaboration_id") REFERENCES "public"."collaborations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."collaborations_products" ADD CONSTRAINT "collaborations_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."django_admin_log" ADD CONSTRAINT "django_admin_log_content_type_id_c4bce8eb_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."django_admin_log" ADD CONSTRAINT "django_admin_log_user_id_c564eba6_fk_accounts_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."accounts_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."guest_cart_items" ADD CONSTRAINT "fk_rails_3bdfea312e" FOREIGN KEY ("guest_cart_id") REFERENCES "public"."guest_carts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."guest_cart_items" ADD CONSTRAINT "fk_rails_4ba9457f5f" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."guest_cart_items" ADD CONSTRAINT "fk_rails_603cdced22" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."guest_wish_items" ADD CONSTRAINT "fk_rails_5004853ca5" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."guest_wish_items" ADD CONSTRAINT "fk_rails_df1d3a30db" FOREIGN KEY ("guest_wish_id") REFERENCES "public"."guest_wishes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."guest_wish_items" ADD CONSTRAINT "fk_rails_ed1f2f0948" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "fk_room" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."messages" ADD CONSTRAINT "fk_user" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."microposts" ADD CONSTRAINT "fk_rails_558c81314b" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."microposts_micropost" ADD CONSTRAINT "microposts_micropost_user_id_e146449e_fk_accounts_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."accounts_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."models" ADD CONSTRAINT "models_model_base_id_fkey" FOREIGN KEY ("model_base_id") REFERENCES "public"."model_bases"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "fk_rails_476172d337" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "fk_rails_e3cb28f071" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "fk_rails_f1a29ddd47" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."post_media" ADD CONSTRAINT "post_media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "fk_products_category" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "fk_products_collaborations" FOREIGN KEY ("collaboration_id") REFERENCES "public"."collaborations"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "fk_products_models" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."products_tags" ADD CONSTRAINT "products_tags_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."products_tags" ADD CONSTRAINT "products_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."relationships_relationship" ADD CONSTRAINT "relationships_relati_followed_id_571ba2f9_fk_accounts_" FOREIGN KEY ("followed_id") REFERENCES "public"."accounts_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."relationships_relationship" ADD CONSTRAINT "relationships_relati_follower_id_2f35aab6_fk_accounts_" FOREIGN KEY ("follower_id") REFERENCES "public"."accounts_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."reviews" ADD CONSTRAINT "fk_rails_bedd9094d4" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."socialaccount_socialaccount" ADD CONSTRAINT "socialaccount_social_user_id_8146e70c_fk_accounts_" FOREIGN KEY ("user_id") REFERENCES "public"."accounts_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."socialaccount_socialapp_sites" ADD CONSTRAINT "socialaccount_social_site_id_2579dee5_fk_django_si" FOREIGN KEY ("site_id") REFERENCES "public"."django_site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."socialaccount_socialapp_sites" ADD CONSTRAINT "socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc" FOREIGN KEY ("socialapp_id") REFERENCES "public"."socialaccount_socialapp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."socialaccount_socialtoken" ADD CONSTRAINT "socialaccount_social_account_id_951f210e_fk_socialacc" FOREIGN KEY ("account_id") REFERENCES "public"."socialaccount_socialaccount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."socialaccount_socialtoken" ADD CONSTRAINT "socialaccount_social_app_id_636a42d7_fk_socialacc" FOREIGN KEY ("app_id") REFERENCES "public"."socialaccount_socialapp"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "fk_rails_02e851e3b7" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."token_blacklist_blacklistedtoken" ADD CONSTRAINT "token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk" FOREIGN KEY ("token_id") REFERENCES "public"."token_blacklist_outstandingtoken"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."token_blacklist_outstandingtoken" ADD CONSTRAINT "token_blacklist_outs_user_id_83bc629a_fk_accounts_" FOREIGN KEY ("user_id") REFERENCES "public"."accounts_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."user_providers" ADD CONSTRAINT "user_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."variant_sizes" ADD CONSTRAINT "fk_size" FOREIGN KEY ("size_id") REFERENCES "public"."sizes"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."variant_sizes" ADD CONSTRAINT "fk_variant" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."variants" ADD CONSTRAINT "fk_rails_19f8efee69" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wish_items" ADD CONSTRAINT "fk_rails_5fe4dae293" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wish_items" ADD CONSTRAINT "fk_rails_6357d5ef81" FOREIGN KEY ("wish_id") REFERENCES "public"."wishes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."wish_items" ADD CONSTRAINT "fk_rails_f4c6b03fcc" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
