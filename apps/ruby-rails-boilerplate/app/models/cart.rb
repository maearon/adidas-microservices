class Cart < ApplicationRecord
  self.primary_key = "id"

  # user_id stores Better Auth UUID (text). Users live in Drizzle DB — no local belongs_to :user.
  # cart_items.cart_id is a derived bigint bucket, not carts.id — see #cart_items_bucket_id.

  def cart_items_bucket_id
    digest = Digest::SHA256.digest(user_id.to_s)
    digest.bytes.first(7).inject(0) { |acc, byte| (acc << 8) | byte }
  end

  def line_items
    CartItem.where(cart_id: cart_items_bucket_id)
  end

  def cart(product, variant, quantity, action)
    bucket_id = cart_items_bucket_id
    current_item = CartItem.find_or_initialize_by(cart_id: bucket_id, variant: variant)
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
