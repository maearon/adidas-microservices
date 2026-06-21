class CartItem < ApplicationRecord
  belongs_to :product
  belongs_to :variant
  # cart_id is bigint bucket from Better Auth user UUID — not FK to carts.id
  validates :cart_id, presence: true
  validates_uniqueness_of :variant_id, scope: :cart_id
  default_scope { order(created_at: :asc) }

  def total_price
    variant.price * quantity
  end
end
