class Cart < ApplicationRecord
  # user_id stores Better Auth user id (text). Users live in Drizzle DB — no local belongs_to :user.
  has_many :cart_items, dependent: :destroy

  def line_items
    cart_items
  end

  def cart(product, variant, quantity, action)
    current_item = cart_items.find_or_initialize_by(variant: variant)
    current_item.quantity ||= 0
    current_item.quantity = action == "edit" ? quantity.to_i : current_item.quantity + quantity.to_i
    current_item.product = product
    current_item.save
  end

  def list
    line_items
  end

  def total_item
    line_items.sum(:quantity)
  end

  def total_originalvalue
    line_items.inject(0.0) { |sum, l| sum + l.variant.originalprice * l.quantity }
  end

  def total_value
    line_items.inject(0.0) { |sum, l| sum + l.variant.price * l.quantity }
  end

  def sale
    total_value - total_originalvalue
  end
end
