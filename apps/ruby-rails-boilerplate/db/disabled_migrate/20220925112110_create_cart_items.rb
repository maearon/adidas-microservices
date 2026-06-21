class CreateCartItems < ActiveRecord::Migration[6.0]
  def change
    create_table :cart_items do |t|
      t.integer :quantity
      t.references :cart, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.references :variant, null: false, foreign_key: true
      t.string :size, limit: 255

      t.timestamps
    end

    add_index :cart_items, :size, name: "idx_cart_items_size"
  end
end
