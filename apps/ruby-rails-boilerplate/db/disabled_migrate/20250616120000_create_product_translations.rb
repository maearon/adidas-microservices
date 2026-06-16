class CreateProductTranslations < ActiveRecord::Migration[8.0]
  def change
    unless table_exists?(:product_translations)
      create_table :product_translations do |t|
        t.references :product, null: false, foreign_key: { on_delete: :cascade }
        t.string :locale, null: false
        t.jsonb :data, null: false, default: {}
      end

      add_index :product_translations, [:product_id, :locale], unique: true
      add_index :product_translations, :locale
    end
  end
end
