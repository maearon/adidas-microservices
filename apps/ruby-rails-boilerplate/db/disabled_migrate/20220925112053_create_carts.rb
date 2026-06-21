class CreateCarts < ActiveRecord::Migration[6.0]
  def change
    create_table :carts, id: :text, default: -> { "gen_random_uuid()" } do |t|
      # Better Auth / Drizzle user UUID — no FK to local users table
      t.text :user_id, null: false

      t.timestamptz :created_at, precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
      t.timestamptz :updated_at, precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    end

    add_index :carts, :user_id, name: "idx_carts_user_id"
  end
end
