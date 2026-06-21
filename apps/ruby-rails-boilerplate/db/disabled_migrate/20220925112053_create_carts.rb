class CreateCarts < ActiveRecord::Migration[6.0]
  def change
    create_table :carts do |t|
      # Better Auth user id (text). Same pattern as wishes — no FK to local users table.
      t.text :user_id, null: false

      t.timestamps
    end

    add_index :carts, :user_id, name: "idx_carts_user_id"
  end
end
