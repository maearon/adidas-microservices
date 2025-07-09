# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_06_29_054502) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "GameType", ["mcq", "open_ended"]
  create_enum "MediaType", ["IMAGE", "VIDEO"]
  create_enum "MessageType", ["TEXT", "IMAGE", "FILE"]
  create_enum "NotificationType", ["LIKE", "FOLLOW", "COMMENT"]

  create_table "Account", id: :text, force: :cascade do |t|
    t.text "userId", null: false
    t.text "type", null: false
    t.text "provider", null: false
    t.text "providerAccountId", null: false
    t.text "refresh_token"
    t.text "access_token"
    t.integer "expires_at"
    t.text "token_type"
    t.text "scope"
    t.text "id_token"
    t.text "session_state"
    t.index ["provider", "providerAccountId"], name: "Account_provider_providerAccountId_key", unique: true
    t.index ["userId"], name: "Account_userId_idx"
  end

  create_table "AspNetRoleClaims", primary_key: "Id", id: :integer, default: nil, force: :cascade do |t|
    t.text "RoleId", null: false
    t.text "ClaimType"
    t.text "ClaimValue"
    t.index ["RoleId"], name: "IX_AspNetRoleClaims_RoleId"
  end

  create_table "AspNetRoles", primary_key: "Id", id: :text, force: :cascade do |t|
    t.string "Name", limit: 256
    t.string "NormalizedName", limit: 256
    t.text "ConcurrencyStamp"
    t.index ["NormalizedName"], name: "RoleNameIndex", unique: true
  end

  create_table "AspNetUserClaims", primary_key: "Id", id: :integer, default: nil, force: :cascade do |t|
    t.text "UserId", null: false
    t.text "ClaimType"
    t.text "ClaimValue"
    t.index ["UserId"], name: "IX_AspNetUserClaims_UserId"
  end

  create_table "AspNetUserLogins", primary_key: ["LoginProvider", "ProviderKey"], force: :cascade do |t|
    t.text "LoginProvider", null: false
    t.text "ProviderKey", null: false
    t.text "ProviderDisplayName"
    t.text "UserId", null: false
    t.index ["UserId"], name: "IX_AspNetUserLogins_UserId"
  end

  create_table "AspNetUserRoles", primary_key: ["UserId", "RoleId"], force: :cascade do |t|
    t.text "UserId", null: false
    t.text "RoleId", null: false
    t.index ["RoleId"], name: "IX_AspNetUserRoles_RoleId"
  end

  create_table "AspNetUserTokens", primary_key: ["UserId", "LoginProvider", "Name"], force: :cascade do |t|
    t.text "UserId", null: false
    t.text "LoginProvider", null: false
    t.text "Name", null: false
    t.text "Value"
  end

  create_table "AspNetUsers", primary_key: "Id", id: :text, force: :cascade do |t|
    t.string "Name", limit: 50, null: false
    t.text "ActivationDigest"
    t.boolean "Activated", null: false
    t.timestamptz "ActivatedAt"
    t.text "RememberDigest"
    t.text "ResetDigest"
    t.timestamptz "ResetSentAt"
    t.timestamptz "CreatedAt", null: false
    t.timestamptz "UpdatedAt", null: false
    t.boolean "Admin", null: false
    t.string "UserName", limit: 256
    t.string "NormalizedUserName", limit: 256
    t.string "Email", limit: 256
    t.string "NormalizedEmail", limit: 256
    t.boolean "EmailConfirmed", null: false
    t.text "PasswordHash"
    t.text "SecurityStamp"
    t.text "ConcurrencyStamp"
    t.text "PhoneNumber"
    t.boolean "PhoneNumberConfirmed", null: false
    t.boolean "TwoFactorEnabled", null: false
    t.timestamptz "LockoutEnd"
    t.boolean "LockoutEnabled", null: false
    t.integer "AccessFailedCount", null: false
    t.index ["NormalizedEmail"], name: "EmailIndex"
    t.index ["NormalizedUserName"], name: "UserNameIndex", unique: true
  end

  create_table "Game", id: :text, force: :cascade do |t|
    t.text "userId", null: false
    t.datetime "timeStarted", precision: 3, null: false
    t.text "topic", null: false
    t.datetime "timeEnded", precision: 3
    t.enum "gameType", null: false, enum_type: "\"GameType\""
    t.index ["userId"], name: "Game_userId_idx"
  end

  create_table "Microposts", primary_key: "Id", id: :bigint, default: nil, force: :cascade do |t|
    t.string "Content", limit: 140, null: false
    t.text "UserId", null: false
    t.text "ImagePath"
    t.timestamptz "CreatedAt", null: false
    t.timestamptz "UpdatedAt", null: false
    t.index ["UserId"], name: "IX_Microposts_UserId"
  end

  create_table "Question", id: :text, force: :cascade do |t|
    t.text "question", null: false
    t.text "answer", null: false
    t.text "gameId", null: false
    t.jsonb "options"
    t.float "percentageCorrect"
    t.boolean "isCorrect"
    t.enum "questionType", null: false, enum_type: "\"GameType\""
    t.text "userAnswer"
    t.index ["gameId"], name: "Question_gameId_idx"
  end

  create_table "Relationships", primary_key: ["FollowerId", "FollowedId"], force: :cascade do |t|
    t.text "FollowerId", null: false
    t.text "FollowedId", null: false
    t.timestamptz "CreatedAt", null: false
    t.timestamptz "UpdatedAt", null: false
    t.index ["FollowedId"], name: "IX_Relationships_FollowedId"
  end

  create_table "__EFMigrationsHistory", primary_key: "MigrationId", id: { type: :string, limit: 150 }, force: :cascade do |t|
    t.string "ProductVersion", limit: 32, null: false
  end

  create_table "_prisma_migrations", id: { type: :string, limit: 36 }, force: :cascade do |t|
    t.string "checksum", limit: 64, null: false
    t.timestamptz "finished_at"
    t.string "migration_name", limit: 255, null: false
    t.text "logs"
    t.timestamptz "rolled_back_at"
    t.timestamptz "started_at", default: -> { "now()" }, null: false
    t.integer "applied_steps_count", default: 0, null: false
  end

  create_table "account_emailaddress", id: :integer, default: nil, force: :cascade do |t|
    t.string "email", limit: 254, null: false
    t.boolean "verified", null: false
    t.boolean "primary", null: false
    t.bigint "user_id", null: false
    t.index ["email"], name: "account_emailaddress_email_03be32b2"
    t.index ["email"], name: "account_emailaddress_email_03be32b2_like", opclass: :varchar_pattern_ops
    t.index ["email"], name: "unique_verified_email", unique: true, where: "verified"
    t.index ["user_id", "primary"], name: "unique_primary_email", unique: true, where: "\"primary\""
    t.index ["user_id"], name: "account_emailaddress_user_id_2c513194"
    t.unique_constraint ["user_id", "email"], name: "account_emailaddress_user_id_email_987c8728_uniq"
  end

  create_table "account_emailconfirmation", id: :integer, default: nil, force: :cascade do |t|
    t.timestamptz "created", null: false
    t.timestamptz "sent"
    t.string "key", limit: 64, null: false
    t.integer "email_address_id", null: false
    t.index ["email_address_id"], name: "account_emailconfirmation_email_address_id_5b7f8c58"
    t.index ["key"], name: "account_emailconfirmation_key_f43612bd_like", opclass: :varchar_pattern_ops
    t.unique_constraint ["key"], name: "account_emailconfirmation_key_key"
  end

  create_table "accounts_user", id: :bigint, default: nil, force: :cascade do |t|
    t.string "password", limit: 128, null: false
    t.timestamptz "last_login"
    t.boolean "is_superuser", null: false
    t.string "username", limit: 150, null: false
    t.string "first_name", limit: 150, null: false
    t.string "last_name", limit: 150, null: false
    t.boolean "is_staff", null: false
    t.boolean "is_active", null: false
    t.timestamptz "date_joined", null: false
    t.string "email", limit: 254, null: false
    t.string "name", limit: 50, null: false
    t.boolean "admin"
    t.boolean "activated", null: false
    t.timestamptz "activated_at"
    t.string "remember_digest", limit: 255
    t.string "activation_digest", limit: 255
    t.string "reset_digest", limit: 255
    t.timestamptz "reset_sent_at"
    t.timestamptz "created_at", null: false
    t.timestamptz "updated_at", null: false
    t.index ["email"], name: "accounts_user_email_b2644a56_like", opclass: :varchar_pattern_ops
    t.index ["username"], name: "accounts_user_username_6088629e_like", opclass: :varchar_pattern_ops
    t.unique_constraint ["email"], name: "accounts_user_email_key"
    t.unique_constraint ["username"], name: "accounts_user_username_key"
  end

  create_table "accounts_user_groups", id: :bigint, default: nil, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "group_id", null: false
    t.index ["group_id"], name: "accounts_user_groups_group_id_bd11a704"
    t.index ["user_id"], name: "accounts_user_groups_user_id_52b62117"
    t.unique_constraint ["user_id", "group_id"], name: "accounts_user_groups_user_id_group_id_59c0b32f_uniq"
  end

  create_table "accounts_user_user_permissions", id: :bigint, default: nil, force: :cascade do |t|
    t.bigint "user_id", null: false
    t.integer "permission_id", null: false
    t.index ["permission_id"], name: "accounts_user_user_permissions_permission_id_113bb443"
    t.index ["user_id"], name: "accounts_user_user_permissions_user_id_e4f0a161"
    t.unique_constraint ["user_id", "permission_id"], name: "accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq"
  end

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "auth_group", id: :integer, default: nil, force: :cascade do |t|
    t.string "name", limit: 150, null: false
    t.index ["name"], name: "auth_group_name_a6ea08ec_like", opclass: :varchar_pattern_ops
    t.unique_constraint ["name"], name: "auth_group_name_key"
  end

  create_table "auth_group_permissions", id: :bigint, default: nil, force: :cascade do |t|
    t.integer "group_id", null: false
    t.integer "permission_id", null: false
    t.index ["group_id"], name: "auth_group_permissions_group_id_b120cbf9"
    t.index ["permission_id"], name: "auth_group_permissions_permission_id_84c5c92e"
    t.unique_constraint ["group_id", "permission_id"], name: "auth_group_permissions_group_id_permission_id_0cd325b0_uniq"
  end

  create_table "auth_permission", id: :integer, default: nil, force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.integer "content_type_id", null: false
    t.string "codename", limit: 100, null: false
    t.index ["content_type_id"], name: "auth_permission_content_type_id_2f476e4b"
    t.unique_constraint ["content_type_id", "codename"], name: "auth_permission_content_type_id_codename_01ab375a_uniq"
  end

  create_table "bookmarks", id: :text, force: :cascade do |t|
    t.text "userId", null: false
    t.text "postId", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.index ["userId", "postId"], name: "bookmarks_userId_postId_key", unique: true
  end

  create_table "cart_items", force: :cascade do |t|
    t.integer "quantity"
    t.bigint "cart_id", null: false
    t.bigint "product_id", null: false
    t.bigint "variant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "size", limit: 255
    t.index ["cart_id"], name: "index_cart_items_on_cart_id"
    t.index ["product_id"], name: "index_cart_items_on_product_id"
    t.index ["size"], name: "idx_cart_items_size"
    t.index ["variant_id"], name: "index_cart_items_on_variant_id"
  end

  create_table "carts", id: :text, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "user_id", null: false
    t.timestamptz "created_at", default: -> { "now()" }, null: false
    t.timestamptz "updated_at", default: -> { "now()" }, null: false
    t.index ["user_id"], name: "idx_carts_user_id"
  end

  create_table "categories", id: :serial, force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.integer "parent_id"
    t.datetime "created_at", default: -> { "now()" }
    t.datetime "updated_at", default: -> { "now()" }

    t.unique_constraint ["slug"], name: "categories_slug_key"
  end

  create_table "collaborations", id: :serial, force: :cascade do |t|
    t.string "name", limit: 100, null: false
    t.string "slug", limit: 100, null: false
    t.text "description"
    t.datetime "created_at", precision: nil, default: -> { "now()" }
    t.datetime "updated_at", precision: nil, default: -> { "now()" }

    t.unique_constraint ["name"], name: "collaborations_name_key"
    t.unique_constraint ["slug"], name: "collaborations_slug_key"
  end

  create_table "collaborations_products", primary_key: ["product_id", "collaboration_id"], force: :cascade do |t|
    t.bigint "product_id", null: false
    t.integer "collaboration_id", null: false
  end

  create_table "comments", id: :text, force: :cascade do |t|
    t.text "content", null: false
    t.text "userId", null: false
    t.text "postId", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "django_admin_log", id: :integer, default: nil, force: :cascade do |t|
    t.timestamptz "action_time", null: false
    t.text "object_id"
    t.string "object_repr", limit: 200, null: false
    t.integer "action_flag", limit: 2, null: false
    t.text "change_message", null: false
    t.integer "content_type_id"
    t.bigint "user_id", null: false
    t.index ["content_type_id"], name: "django_admin_log_content_type_id_c4bce8eb"
    t.index ["user_id"], name: "django_admin_log_user_id_c564eba6"
    t.check_constraint "action_flag >= 0", name: "django_admin_log_action_flag_check"
  end

  create_table "django_content_type", id: :integer, default: nil, force: :cascade do |t|
    t.string "app_label", limit: 100, null: false
    t.string "model", limit: 100, null: false

    t.unique_constraint ["app_label", "model"], name: "django_content_type_app_label_model_76bd3d3b_uniq"
  end

  create_table "django_migrations", id: :bigint, default: nil, force: :cascade do |t|
    t.string "app", limit: 255, null: false
    t.string "name", limit: 255, null: false
    t.timestamptz "applied", null: false
  end

  create_table "django_session", primary_key: "session_key", id: { type: :string, limit: 40 }, force: :cascade do |t|
    t.text "session_data", null: false
    t.timestamptz "expire_date", null: false
    t.index ["expire_date"], name: "django_session_expire_date_a5c62663"
    t.index ["session_key"], name: "django_session_session_key_c0390e0f_like", opclass: :varchar_pattern_ops
  end

  create_table "django_site", id: :integer, default: nil, force: :cascade do |t|
    t.string "domain", limit: 100, null: false
    t.string "name", limit: 50, null: false
    t.index ["domain"], name: "django_site_domain_a2e37b91_like", opclass: :varchar_pattern_ops
    t.unique_constraint ["domain"], name: "django_site_domain_a2e37b91_uniq"
  end

  create_table "events_event", id: :bigint, default: nil, force: :cascade do |t|
    t.string "title", limit: 200, null: false
    t.text "description", null: false
    t.string "location", limit: 255, null: false
    t.float "latitude", null: false
    t.float "longitude", null: false
    t.timestamptz "timestamp", null: false
  end

  create_table "follows", id: false, force: :cascade do |t|
    t.text "followerId", null: false
    t.text "followingId", null: false
    t.index ["followerId", "followingId"], name: "follows_followerId_followingId_key", unique: true
  end

  create_table "guest_cart_items", force: :cascade do |t|
    t.integer "quantity"
    t.bigint "guest_cart_id", null: false
    t.bigint "product_id", null: false
    t.bigint "variant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "size", limit: 255
    t.index ["guest_cart_id"], name: "index_guest_cart_items_on_guest_cart_id"
    t.index ["product_id"], name: "index_guest_cart_items_on_product_id"
    t.index ["size"], name: "idx_guest_cart_items_size"
    t.index ["variant_id"], name: "index_guest_cart_items_on_variant_id"
  end

  create_table "guest_carts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "guest_wish_items", force: :cascade do |t|
    t.bigint "guest_wish_id", null: false
    t.bigint "product_id", null: false
    t.bigint "variant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["guest_wish_id"], name: "index_guest_wish_items_on_guest_wish_id"
    t.index ["product_id"], name: "index_guest_wish_items_on_product_id"
    t.index ["variant_id"], name: "index_guest_wish_items_on_variant_id"
  end

  create_table "guest_wishes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "likes", id: false, force: :cascade do |t|
    t.text "userId", null: false
    t.text "postId", null: false
    t.index ["userId", "postId"], name: "likes_userId_postId_key", unique: true
  end

  create_table "messages", id: :text, force: :cascade do |t|
    t.text "content", null: false
    t.enum "type", default: "TEXT", enum_type: "\"MessageType\""
    t.text "room_id", null: false
    t.text "user_id", null: false
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
    t.index ["room_id", "created_at"], name: "index_messages_on_room_id_and_created_at"
    t.index ["room_id"], name: "index_messages_on_room_id"
    t.index ["user_id", "created_at"], name: "index_messages_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "microposts", force: :cascade do |t|
    t.text "content"
    t.text "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "created_at"], name: "index_microposts_on_user_id_and_created_at"
    t.index ["user_id"], name: "index_microposts_on_user_id"
  end

  create_table "microposts_micropost", id: :bigint, default: nil, force: :cascade do |t|
    t.text "content", null: false
    t.string "picture", limit: 100
    t.timestamptz "created_at", null: false
    t.timestamptz "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "microposts_micropost_user_id_e146449e"
  end

  create_table "model_bases", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.string "image_url"
    t.datetime "created_at", precision: nil, default: -> { "now()" }
    t.datetime "updated_at", precision: nil, default: -> { "now()" }
    t.index ["slug"], name: "index_model_bases_on_slug"
    t.unique_constraint ["slug"], name: "model_bases_slug_key"
  end

  create_table "models", force: :cascade do |t|
    t.bigint "model_base_id", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.text "description"
    t.date "release_date"
    t.string "hero_image"
    t.jsonb "tech_specs"
    t.datetime "created_at", precision: nil, default: -> { "now()" }
    t.datetime "updated_at", precision: nil, default: -> { "now()" }
    t.index ["slug"], name: "index_models_on_slug"
    t.unique_constraint ["slug"], name: "models_slug_key"
  end

  create_table "notifications", id: :text, force: :cascade do |t|
    t.text "recipientId", null: false
    t.text "issuerId", null: false
    t.text "postId"
    t.enum "type", null: false, enum_type: "\"NotificationType\""
    t.boolean "read", default: false, null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "order_items", force: :cascade do |t|
    t.integer "quantity"
    t.bigint "order_id", null: false
    t.bigint "product_id", null: false
    t.bigint "variant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["order_id"], name: "index_order_items_on_order_id"
    t.index ["product_id"], name: "index_order_items_on_product_id"
    t.index ["variant_id"], name: "index_order_items_on_variant_id"
  end

  create_table "orders", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_orders_on_user_id"
  end

  create_table "post_media", id: :text, force: :cascade do |t|
    t.text "postId"
    t.enum "media_type", null: false, enum_type: "\"MediaType\""
    t.text "url", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "posts", id: :text, force: :cascade do |t|
    t.text "content", null: false
    t.text "userId", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "expiresAt", precision: nil, default: -> { "CURRENT_TIMESTAMP" }
  end

  create_table "products", force: :cascade do |t|
    t.string "name"
    t.string "model_number", null: false
    t.string "gender"
    t.string "franchise"
    t.string "product_type"
    t.string "brand"
    t.string "category"
    t.string "sport"
    t.text "description_h5"
    t.text "description_p"
    t.text "specifications"
    t.text "care"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "category_id"
    t.string "slug"
    t.string "status", default: "active"
    t.boolean "is_featured", default: false
    t.string "badge"
    t.bigint "model_base_id"
    t.bigint "model_id"
    t.bigint "collaboration_id"
    t.string "activity"
    t.string "material"
    t.string "collection"
    t.index ["category_id"], name: "index_products_on_category_id"
    t.index ["model_number"], name: "index_products_on_model_number", unique: true
    t.index ["slug"], name: "index_products_on_slug", unique: true
    t.check_constraint "model_number::text ~ '^[A-Z0-9]+$'::text", name: "chk_model_number_format"
    t.unique_constraint ["slug"], name: "products_slug_key"
  end

  create_table "products_tags", id: :serial, force: :cascade do |t|
    t.bigint "product_id", null: false
    t.integer "tag_id", null: false
    t.datetime "created_at", precision: nil, default: -> { "CURRENT_TIMESTAMP" }
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "relationships", force: :cascade do |t|
    t.text "follower_id"
    t.text "followed_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["followed_id"], name: "index_relationships_on_followed_id"
    t.index ["follower_id", "followed_id"], name: "index_relationships_on_follower_id_and_followed_id", unique: true
    t.index ["follower_id"], name: "index_relationships_on_follower_id"
  end

  create_table "relationships_relationship", id: :bigint, default: nil, force: :cascade do |t|
    t.timestamptz "created_at", null: false
    t.bigint "followed_id", null: false
    t.bigint "follower_id", null: false
    t.index ["followed_id"], name: "relationships_relationship_followed_id_571ba2f9"
    t.index ["follower_id"], name: "relationships_relationship_follower_id_2f35aab6"
    t.unique_constraint ["follower_id", "followed_id"], name: "relationships_relationsh_follower_id_followed_id_1b8dba39_uniq"
  end

  create_table "reviews", force: :cascade do |t|
    t.text "content"
    t.bigint "product_id", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "rating"
    t.string "status", default: "approved"
    t.string "title"
    t.index ["product_id"], name: "index_reviews_on_product_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
    t.check_constraint "rating >= 1 AND rating <= 5", name: "reviews_rating_check"
  end

  create_table "rooms", id: :text, force: :cascade do |t|
    t.text "name", null: false
    t.text "type", default: "public", null: false
    t.text "last_message"
    t.timestamptz "last_message_at"
    t.timestamptz "created_at", default: -> { "CURRENT_TIMESTAMP" }
    t.timestamptz "updated_at", default: -> { "CURRENT_TIMESTAMP" }
  end

  create_table "sessions", id: :text, force: :cascade do |t|
    t.text "userId", null: false
    t.datetime "expiresAt", precision: 3, null: false
    t.jsonb "payload"
  end

  create_table "sizes", id: :serial, force: :cascade do |t|
    t.string "label", limit: 10, null: false
    t.string "system", limit: 20, null: false
    t.string "location", limit: 10, null: false
    t.datetime "created_at", precision: nil, default: -> { "CURRENT_TIMESTAMP" }
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP" }
  end

  create_table "socialaccount_socialaccount", id: :integer, default: nil, force: :cascade do |t|
    t.string "provider", limit: 200, null: false
    t.string "uid", limit: 191, null: false
    t.timestamptz "last_login", null: false
    t.timestamptz "date_joined", null: false
    t.jsonb "extra_data", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "socialaccount_socialaccount_user_id_8146e70c"
    t.unique_constraint ["provider", "uid"], name: "socialaccount_socialaccount_provider_uid_fc810c6e_uniq"
  end

  create_table "socialaccount_socialapp", id: :integer, default: nil, force: :cascade do |t|
    t.string "provider", limit: 30, null: false
    t.string "name", limit: 40, null: false
    t.string "client_id", limit: 191, null: false
    t.string "secret", limit: 191, null: false
    t.string "key", limit: 191, null: false
    t.string "provider_id", limit: 200, null: false
    t.jsonb "settings", null: false
  end

  create_table "socialaccount_socialapp_sites", id: :bigint, default: nil, force: :cascade do |t|
    t.integer "socialapp_id", null: false
    t.integer "site_id", null: false
    t.index ["site_id"], name: "socialaccount_socialapp_sites_site_id_2579dee5"
    t.index ["socialapp_id"], name: "socialaccount_socialapp_sites_socialapp_id_97fb6e7d"
    t.unique_constraint ["socialapp_id", "site_id"], name: "socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq"
  end

  create_table "socialaccount_socialtoken", id: :integer, default: nil, force: :cascade do |t|
    t.text "token", null: false
    t.text "token_secret", null: false
    t.timestamptz "expires_at"
    t.integer "account_id", null: false
    t.integer "app_id"
    t.index ["account_id"], name: "socialaccount_socialtoken_account_id_951f210e"
    t.index ["app_id"], name: "socialaccount_socialtoken_app_id_636a42d7"
    t.unique_constraint ["app_id", "account_id"], name: "socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq"
  end

  create_table "tags", id: :serial, force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.string "slug", limit: 255, null: false
    t.datetime "created_at", precision: nil, default: -> { "CURRENT_TIMESTAMP" }
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP" }
    t.index ["slug"], name: "index_tags_on_slug", unique: true
    t.unique_constraint ["slug"], name: "tags_slug_key"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "description"
    t.boolean "done"
    t.bigint "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_tasks_on_project_id"
  end

  create_table "token_blacklist_blacklistedtoken", id: :bigint, default: nil, force: :cascade do |t|
    t.timestamptz "blacklisted_at", null: false
    t.bigint "token_id", null: false

    t.unique_constraint ["token_id"], name: "token_blacklist_blacklistedtoken_token_id_key"
  end

  create_table "token_blacklist_outstandingtoken", id: :bigint, default: nil, force: :cascade do |t|
    t.text "token", null: false
    t.timestamptz "created_at"
    t.timestamptz "expires_at", null: false
    t.bigint "user_id"
    t.string "jti", limit: 255, null: false
    t.index ["jti"], name: "token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like", opclass: :varchar_pattern_ops
    t.index ["user_id"], name: "token_blacklist_outstandingtoken_user_id_83bc629a"
    t.unique_constraint ["jti"], name: "token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq"
  end

  create_table "topic_count", id: :text, force: :cascade do |t|
    t.text "topic", null: false
    t.integer "count", null: false
    t.index ["topic"], name: "topic_count_topic_key", unique: true
  end

  create_table "user_providers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "user_id", null: false
    t.string "provider", limit: 50, null: false
    t.text "provider_user_id", null: false
    t.text "email"
    t.text "name"
    t.text "avatar_url"
    t.text "access_token"
    t.text "refresh_token"
    t.jsonb "raw_data"
    t.datetime "created_at", precision: nil, default: -> { "now()" }
    t.datetime "updated_at", precision: nil, default: -> { "now()" }

    t.unique_constraint ["provider", "provider_user_id"], name: "user_providers_provider_provider_user_id_key"
  end

  create_table "users", id: :text, force: :cascade do |t|
    t.string "name"
    t.text "username", null: false
    t.text "displayName", null: false
    t.string "email"
    t.string "refresh_token"
    t.datetime "refresh_token_expiration_at"
    t.datetime "created_at", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.text "passwordHash"
    t.text "googleId"
    t.text "avatarUrl"
    t.text "bio"
    t.string "remember_digest"
    t.boolean "admin", default: false
    t.string "activation_digest"
    t.boolean "activated", default: false
    t.datetime "activated_at"
    t.string "reset_digest"
    t.datetime "reset_sent_at"
    t.boolean "is_staff", default: false, null: false
    t.boolean "is_active", default: true, null: false
    t.timestamptz "date_joined", default: -> { "now()" }, null: false
    t.timestamptz "last_login"
    t.boolean "is_superuser", default: false, null: false
    t.string "password", default: "pbkdf2_sha256$720000$mf7gOJi6b6lcClmMxd0UaY$JEXwqKpSjnuNmBE42U9DFtjLO6x2fIPCnOQ9oA59iHo=", null: false
    t.string "first_name", default: "", null: false
    t.string "last_name", default: "", null: false
    t.string "provider", limit: 50
    t.text "avatar"
    t.timestamptz "updatedAt", default: -> { "now()" }
    t.index ["email"], name: "index_admin_users_email_uniqueness", unique: true
    t.index ["googleId"], name: "users_googleId_key", unique: true
    t.index ["refresh_token"], name: "index_admin_users_refresh_token_uniqueness", unique: true
    t.index ["username"], name: "users_username_key", unique: true
  end

  create_table "users_for_mailer_tests", id: :text, force: :cascade do |t|
    t.string "name"
    t.text "username", null: false
    t.text "displayName", null: false
    t.string "email"
    t.string "refresh_token"
    t.datetime "refresh_token_expiration_at"
    t.datetime "created_at", null: false
    t.datetime "createdAt", precision: 3, default: -> { "CURRENT_TIMESTAMP" }, null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
    t.text "passwordHash"
    t.text "googleId"
    t.text "avatarUrl"
    t.text "bio"
    t.string "remember_digest"
    t.boolean "admin", default: false
    t.string "activation_digest"
    t.boolean "activated", default: false
    t.datetime "activated_at"
    t.string "reset_digest"
    t.datetime "reset_sent_at"
    t.boolean "is_staff", default: false, null: false
    t.boolean "is_active", default: true, null: false
    t.datetime "date_joined", default: -> { "now()" }, null: false
    t.datetime "last_login"
    t.boolean "is_superuser", default: false, null: false
    t.string "password", default: "pbkdf2_sha256$720000$mf7gOJi6b6lcClmMxd0UaY$JEXwqKpSjnuNmBE42U9DFtjLO6x2fIPCnOQ9oA59iHo=", null: false
    t.string "first_name", default: "", null: false
    t.string "last_name", default: "", null: false
    t.string "provider", limit: 50
    t.index ["email"], name: "index_mailer_users_email_uniqueness", unique: true
    t.index ["googleId"], name: "mailer_users_googleId_key", unique: true
    t.index ["refresh_token"], name: "index_mailer_users_refresh_token_uniqueness", unique: true
    t.index ["username"], name: "mailer_users_username_key", unique: true
  end

  create_table "variant_sizes", id: :serial, force: :cascade do |t|
    t.bigint "variant_id", null: false
    t.integer "size_id", null: false
    t.integer "stock", default: 0
    t.datetime "created_at", precision: nil, default: -> { "CURRENT_TIMESTAMP" }
    t.datetime "updated_at", precision: nil, default: -> { "CURRENT_TIMESTAMP" }
  end

  create_table "variants", force: :cascade do |t|
    t.string "color"
    t.float "price", null: false
    t.float "compare_at_price"
    t.text "variant_code"
    t.integer "stock"
    t.bigint "product_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_variants_on_product_id"
    t.unique_constraint ["product_id", "color"], name: "unique_product_color"
  end

  create_table "wish_items", force: :cascade do |t|
    t.bigint "wish_id", null: false
    t.bigint "product_id", null: false
    t.bigint "variant_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["product_id"], name: "index_wish_items_on_product_id"
    t.index ["variant_id"], name: "index_wish_items_on_variant_id"
    t.index ["wish_id"], name: "index_wish_items_on_wish_id"
  end

  create_table "wishes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_wishes_on_user_id"
  end

  add_foreign_key "Account", "users", column: "userId", name: "Account_userId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "AspNetUserClaims", "AspNetUsers", column: "UserId", primary_key: "Id", name: "FK_AspNetUserClaims_AspNetUsers_UserId", on_delete: :cascade
  add_foreign_key "AspNetUserLogins", "AspNetUsers", column: "UserId", primary_key: "Id", name: "FK_AspNetUserLogins_AspNetUsers_UserId", on_delete: :cascade
  add_foreign_key "AspNetUserRoles", "AspNetRoles", column: "RoleId", primary_key: "Id", name: "FK_AspNetUserRoles_AspNetRoles_RoleId", on_delete: :cascade
  add_foreign_key "AspNetUserRoles", "AspNetUsers", column: "UserId", primary_key: "Id", name: "FK_AspNetUserRoles_AspNetUsers_UserId", on_delete: :cascade
  add_foreign_key "AspNetUserTokens", "AspNetUsers", column: "UserId", primary_key: "Id", name: "FK_AspNetUserTokens_AspNetUsers_UserId", on_delete: :cascade
  add_foreign_key "Game", "users", column: "userId", name: "Game_userId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "Microposts", "AspNetUsers", column: "UserId", primary_key: "Id", name: "FK_Microposts_AspNetUsers_UserId", on_delete: :cascade
  add_foreign_key "Question", "Game", column: "gameId", name: "Question_gameId_fkey", on_update: :cascade, on_delete: :restrict
  add_foreign_key "Relationships", "AspNetUsers", column: "FollowedId", primary_key: "Id", name: "FK_Relationships_AspNetUsers_FollowedId", on_delete: :restrict
  add_foreign_key "Relationships", "AspNetUsers", column: "FollowerId", primary_key: "Id", name: "FK_Relationships_AspNetUsers_FollowerId", on_delete: :restrict
  add_foreign_key "account_emailaddress", "accounts_user", column: "user_id", name: "account_emailaddress_user_id_2c513194_fk_accounts_user_id", deferrable: :deferred
  add_foreign_key "account_emailconfirmation", "account_emailaddress", column: "email_address_id", name: "account_emailconfirm_email_address_id_5b7f8c58_fk_account_e", deferrable: :deferred
  add_foreign_key "accounts_user_groups", "accounts_user", column: "user_id", name: "accounts_user_groups_user_id_52b62117_fk_accounts_user_id", deferrable: :deferred
  add_foreign_key "accounts_user_groups", "auth_group", column: "group_id", name: "accounts_user_groups_group_id_bd11a704_fk_auth_group_id", deferrable: :deferred
  add_foreign_key "accounts_user_user_permissions", "accounts_user", column: "user_id", name: "accounts_user_user_p_user_id_e4f0a161_fk_accounts_", deferrable: :deferred
  add_foreign_key "accounts_user_user_permissions", "auth_permission", column: "permission_id", name: "accounts_user_user_p_permission_id_113bb443_fk_auth_perm", deferrable: :deferred
  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "auth_group_permissions", "auth_group", column: "group_id", name: "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id", deferrable: :deferred
  add_foreign_key "auth_group_permissions", "auth_permission", column: "permission_id", name: "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm", deferrable: :deferred
  add_foreign_key "auth_permission", "django_content_type", column: "content_type_id", name: "auth_permission_content_type_id_2f476e4b_fk_django_co", deferrable: :deferred
  add_foreign_key "bookmarks", "posts", column: "postId", name: "bookmarks_postId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "bookmarks", "users", column: "userId", name: "bookmarks_userId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "cart_items", "products"
  add_foreign_key "cart_items", "variants"
  add_foreign_key "carts", "users", name: "fk_user", on_delete: :cascade
  add_foreign_key "categories", "categories", column: "parent_id", name: "categories_parent_id_fkey"
  add_foreign_key "collaborations_products", "collaborations", name: "collaborations_products_collaboration_id_fkey", on_delete: :cascade
  add_foreign_key "collaborations_products", "products", name: "collaborations_products_product_id_fkey", on_delete: :cascade
  add_foreign_key "comments", "posts", column: "postId", name: "comments_postId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "comments", "users", column: "userId", name: "comments_userId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "django_admin_log", "accounts_user", column: "user_id", name: "django_admin_log_user_id_c564eba6_fk_accounts_user_id", deferrable: :deferred
  add_foreign_key "django_admin_log", "django_content_type", column: "content_type_id", name: "django_admin_log_content_type_id_c4bce8eb_fk_django_co", deferrable: :deferred
  add_foreign_key "follows", "users", column: "followerId", name: "follows_followerId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "follows", "users", column: "followingId", name: "follows_followingId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "guest_cart_items", "guest_carts"
  add_foreign_key "guest_cart_items", "products"
  add_foreign_key "guest_cart_items", "variants"
  add_foreign_key "guest_wish_items", "guest_wishes"
  add_foreign_key "guest_wish_items", "products"
  add_foreign_key "guest_wish_items", "variants"
  add_foreign_key "likes", "posts", column: "postId", name: "likes_postId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "likes", "users", column: "userId", name: "likes_userId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "messages", "rooms", name: "fk_room", on_update: :cascade, on_delete: :cascade
  add_foreign_key "messages", "users", name: "fk_user", on_update: :cascade, on_delete: :cascade
  add_foreign_key "microposts", "users"
  add_foreign_key "microposts_micropost", "accounts_user", column: "user_id", name: "microposts_micropost_user_id_e146449e_fk_accounts_user_id", deferrable: :deferred
  add_foreign_key "models", "model_bases", column: "model_base_id", name: "models_model_base_id_fkey", on_delete: :cascade
  add_foreign_key "notifications", "posts", column: "postId", name: "notifications_postId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "notifications", "users", column: "issuerId", name: "notifications_issuerId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "notifications", "users", column: "recipientId", name: "notifications_recipientId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "order_items", "orders"
  add_foreign_key "order_items", "products"
  add_foreign_key "order_items", "variants"
  add_foreign_key "post_media", "posts", column: "postId", name: "post_media_postId_fkey", on_update: :cascade, on_delete: :nullify
  add_foreign_key "posts", "users", column: "userId", name: "posts_userId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "products", "categories", name: "fk_products_category"
  add_foreign_key "products", "collaborations", name: "fk_products_collaborations", on_delete: :nullify
  add_foreign_key "products", "models", name: "fk_products_models", on_delete: :nullify
  add_foreign_key "products_tags", "products", name: "products_tags_product_id_fkey", on_delete: :cascade
  add_foreign_key "products_tags", "tags", name: "products_tags_tag_id_fkey", on_delete: :cascade
  add_foreign_key "relationships_relationship", "accounts_user", column: "followed_id", name: "relationships_relati_followed_id_571ba2f9_fk_accounts_", deferrable: :deferred
  add_foreign_key "relationships_relationship", "accounts_user", column: "follower_id", name: "relationships_relati_follower_id_2f35aab6_fk_accounts_", deferrable: :deferred
  add_foreign_key "reviews", "products"
  add_foreign_key "sessions", "users", column: "userId", name: "sessions_userId_fkey", on_update: :cascade, on_delete: :cascade
  add_foreign_key "socialaccount_socialaccount", "accounts_user", column: "user_id", name: "socialaccount_social_user_id_8146e70c_fk_accounts_", deferrable: :deferred
  add_foreign_key "socialaccount_socialapp_sites", "django_site", column: "site_id", name: "socialaccount_social_site_id_2579dee5_fk_django_si", deferrable: :deferred
  add_foreign_key "socialaccount_socialapp_sites", "socialaccount_socialapp", column: "socialapp_id", name: "socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc", deferrable: :deferred
  add_foreign_key "socialaccount_socialtoken", "socialaccount_socialaccount", column: "account_id", name: "socialaccount_social_account_id_951f210e_fk_socialacc", deferrable: :deferred
  add_foreign_key "socialaccount_socialtoken", "socialaccount_socialapp", column: "app_id", name: "socialaccount_social_app_id_636a42d7_fk_socialacc", deferrable: :deferred
  add_foreign_key "tasks", "projects"
  add_foreign_key "token_blacklist_blacklistedtoken", "token_blacklist_outstandingtoken", column: "token_id", name: "token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk", deferrable: :deferred
  add_foreign_key "token_blacklist_outstandingtoken", "accounts_user", column: "user_id", name: "token_blacklist_outs_user_id_83bc629a_fk_accounts_", deferrable: :deferred
  add_foreign_key "user_providers", "users", name: "user_providers_user_id_fkey", on_delete: :cascade
  add_foreign_key "variant_sizes", "sizes", name: "fk_size", on_delete: :cascade
  add_foreign_key "variant_sizes", "variants", name: "fk_variant", on_delete: :cascade
  add_foreign_key "variants", "products"
  add_foreign_key "wish_items", "products"
  add_foreign_key "wish_items", "variants"
  add_foreign_key "wish_items", "wishes"
end
