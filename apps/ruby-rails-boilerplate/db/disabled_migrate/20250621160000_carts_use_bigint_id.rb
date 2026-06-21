class CartsUseBigintId < ActiveRecord::Migration[6.0]
  def up
    execute "DELETE FROM cart_items"
    execute "DELETE FROM carts"

    drop_table :carts

    create_table :carts do |t|
      t.text :user_id, null: false
      t.timestamps
    end

    add_index :carts, :user_id, name: "idx_carts_user_id"
    add_foreign_key :cart_items, :carts, column: :cart_id
  end

  def down
    remove_foreign_key :cart_items, :carts, column: :cart_id

    drop_table :carts

    create_table :carts, id: :text, default: -> { "gen_random_uuid()" } do |t|
      t.text :user_id, null: false
      t.timestamptz :created_at, precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
      t.timestamptz :updated_at, precision: 6, default: -> { "CURRENT_TIMESTAMP" }, null: false
    end

    add_index :carts, :user_id, name: "idx_carts_user_id"
  end
end
