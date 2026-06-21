class CreateWishes < ActiveRecord::Migration[6.0]
  def change
    create_table :wishes do |t|
      # Better Auth / Drizzle user UUID — no FK to local users table
      t.text :user_id, null: false

      t.timestamps
    end

    add_index :wishes, :user_id, name: "index_wishes_on_user_id"
  end
end
