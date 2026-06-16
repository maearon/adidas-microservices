class ProductTranslation < ApplicationRecord
  belongs_to :product

  validates :locale, presence: true, uniqueness: { scope: :product_id }
  validates :data, presence: true
end
