class CreateGuestCartItems < ActiveRecord::Migration[6.0]
  def change
    create_table :guest_cart_items do |t|
      t.integer :quantity
      t.references :guest_cart, null: false, foreign_key: true
      t.references :product, null: false, foreign_key: true
      t.references :variant, null: false, foreign_key: true
      t.string :size, limit: 255

      t.timestamps
    end

    add_index :guest_cart_items, :size, name: "idx_guest_cart_items_size"
  end
end
