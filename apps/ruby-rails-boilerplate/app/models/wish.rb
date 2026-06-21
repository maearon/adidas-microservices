class Wish < ApplicationRecord
  # user_id stores Better Auth UUID (text). Users live in Drizzle DB — no local belongs_to :user.

  has_many :wish_items, dependent: :destroy

  def list
    wish_items
  end

  def wish(product, variant)
    wish_items.create(product: product, variant: variant, wish: self)
  end

  def unwish(current_item)
    wish_items.delete(current_item)
  end

  def wishing?(product, variant)
    current_item = wish_items.find_by(variant: variant)
    wish_items.include?(current_item)
  end

  def total_item
    wish_items.count
  end
end
