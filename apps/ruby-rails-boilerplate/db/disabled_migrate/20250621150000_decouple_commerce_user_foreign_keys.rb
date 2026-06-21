# For existing Neon/Postgres DBs that still have legacy carts/wishes user FKs or bigint user_id.
# Safe to run when tables are empty (already truncated on Neon).
class DecoupleCommerceUserForeignKeys < ActiveRecord::Migration[6.0]
  def up
    execute <<~SQL.squish
      ALTER TABLE carts DROP CONSTRAINT IF EXISTS fk_user;
      ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
      ALTER TABLE wishes DROP CONSTRAINT IF EXISTS fk_user;
      ALTER TABLE wishes DROP CONSTRAINT IF EXISTS wishes_user_id_fkey;
    SQL

    change_column :carts, :user_id, :text, null: false, using: "user_id::text"
    change_column :wishes, :user_id, :text, null: false, using: "user_id::text"

    add_index :carts, :user_id, name: "idx_carts_user_id" unless index_exists?(:carts, :user_id, name: "idx_carts_user_id")
    add_index :wishes, :user_id, name: "index_wishes_on_user_id" unless index_exists?(:wishes, :user_id, name: "index_wishes_on_user_id")
  end

  def down
    remove_index :wishes, name: "index_wishes_on_user_id" if index_exists?(:wishes, :user_id, name: "index_wishes_on_user_id")
    remove_index :carts, name: "idx_carts_user_id" if index_exists?(:carts, :user_id, name: "idx_carts_user_id")

    change_column :wishes, :user_id, :bigint, null: false, using: "NULLIF(user_id, '')::bigint"
    change_column :carts, :user_id, :bigint, null: false, using: "NULLIF(user_id, '')::bigint"
  end
end
