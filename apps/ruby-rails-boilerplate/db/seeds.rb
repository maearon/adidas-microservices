puts "🧼 Clearing existing data..."
[Product, Variant, VariantSize, Size, Tag, ModelBase, Model, Collaboration].each(&:destroy_all)
[Product, Variant, VariantSize, Size, Tag, ModelBase, Model, Collaboration].each do |model|
  ActiveRecord::Base.connection.reset_pk_sequence!(model.table_name)
end

puts "📦 Seeding sizes..."
ALPHA_SIZES   = %w[XS S M L XL XXL]
NUMERIC_SIZES = (36..45).flat_map { |n| ["#{n}", "#{n}.5"] }
LOCATIONS     = %w[US VN]

LOCATIONS.each do |loc|
  ALPHA_SIZES.each do |label|
    Size.create!(label: label, system: "alpha", location: loc)
  end
  NUMERIC_SIZES.each do |label|
    Size.create!(label: label, system: "numeric", location: loc)
  end
end

Size.create!(label: "One Size", system: "one_size", location: "GLOBAL")
puts "✅ Done seeding sizes: #{Size.count} entries."

puts "🏷️ Seeding tags..."
tags = %w[
  new_arrivals best_sellers prime_delivery liberty_london_florals
  fast_delivery soft_lux must_have summer_savings trending_now
  disney_collection premium_collaborations release_dates track_pants
]
tags.each { |slug| Tag.find_or_create_by!(slug: slug, name: slug.titleize) }

puts "📚 Seeding model bases (collections)..."
collections = %w[
  adicolor gazelle samba superstar sportswear supernova terrex ultraboost y-3 zne
  stella_mccartney originals f50 adizero 4d five_ten tiro copa
]
collections.each do |slug|
  ModelBase.find_or_create_by!(slug: slug, name: slug.titleize)
end

puts "🤝 Seeding collaborations..."
collabs = [
  "Bad Bunny", "Bape", "Disney", "Edison Chen", "Fear of God Athletics",
  "Pharrell", "Prada", "Sporty & Rich", "Wales Bonner"
]
collabs.each do |name|
  Collaboration.find_or_create_by!(name: name, slug: name.parameterize)
end

puts "👟 Generating sample products..."

brands       = %w[Adidas Originals Athletics Essentials]
sports       = %w[Running Soccer Basketball Tennis Gym Training Golf Hiking Yoga Football Baseball]
producttypes = %w[Sneakers Cleats Sandals Hoodie Pants Shorts Jacket Jersey TShirt TankTop Dress Leggings Tracksuit Bra Coat]
genders      = %w[Men Women Unisex Kids]
categories   = %w[Shoes Apparel Accessories]
PRODUCTS_IMAGE_DIR = Rails.root.join("app/assets/images/products")

95.times do |i|
  model_number = "MOD#{i.to_s.rjust(4, '0')}"
  brand        = brands.sample
  sport        = sports.sample
  producttype  = producttypes.sample
  gender       = genders.sample
  category     = categories.sample
  name         = "#{brand} #{producttype} #{i + 1}"

  model_base = ModelBase.order("RANDOM()").first

  model = Model.find_or_create_by!(name: "#{brand} #{producttype} Model #{i + 1}") do |m|
    m.model_base = model_base
  end

  product = Product.create!(
    name: name,
    model_number: model_number,
    gender: gender,
    franchise: "Tubular",
    product_type: producttype,
    brand: brand,
    category: category,
    sport: sport,
    model_base_id: model_base.id,
    model: model,
    collaboration: Collaboration.order("RANDOM()").first,
    tag_ids: Tag.order("RANDOM()").limit(2).pluck(:id),
    description_h5: "#{producttype} for #{sport} by #{brand}",
    description_p: "Performance-driven #{producttype} for the modern athlete.",
    care: "Machine wash cold. Tumble dry low.",
    specifications: "Ergonomic, high-performance, breathable, eco-friendly"
  )

  dir_path = PRODUCTS_IMAGE_DIR.join((i + 1).to_s)
  avatar_path = dir_path.join("#{i + 1}.jpg")
  if File.exist?(avatar_path)
    product.image.attach(io: File.open(avatar_path), filename: "#{i + 1}.jpg", content_type: "image/jpeg")
    product.hover_image.attach(io: File.open(avatar_path), filename: "#{i + 1}-hover.jpg", content_type: "image/jpeg")
  end

  %w[Black White Red Blue].each_with_index do |color, idx|
    variant = product.variants.create!(
      color: color,
      price: rand(40.0..150.0).round(2),
      compare_at_price: rand(160.0..250.0).round(2),
      variant_code: "VC#{i + 1}-#{color[0..1].upcase}-#{SecureRandom.hex(2)}",
      stock: rand(5..30)
    )

    if idx == 0 && File.exist?(avatar_path)
      variant.avatar.attach(io: File.open(avatar_path), filename: "#{i + 1}.jpg", content_type: "image/jpeg")
      variant.hover.attach(io: File.open(avatar_path), filename: "#{i + 1}.jpg", content_type: "image/jpeg")
    end

    detail_images = Dir.glob("#{dir_path}/#{i + 1}dt*.jpg").sort
    detail_images.each do |img_path|
      variant.images.attach(io: File.open(img_path), filename: File.basename(img_path), content_type: "image/jpeg")
    end

    sizes = case category
            when "Shoes"
              NUMERIC_SIZES.map { |label| Size.find_by!(label: label, system: "numeric", location: "US") }
            when "Apparel"
              ALPHA_SIZES.map { |label| Size.find_by!(label: label, system: "alpha", location: "US") }
            else
              [Size.find_by!(label: "One Size", system: "one_size", location: "GLOBAL")]
            end

    sizes.each do |size|
      VariantSize.create!(variant: variant, size: size, stock: rand(1..30))
    end
  end

  puts "✅ Created product #{i + 1}: #{product.name}"
end

puts "🎉 Seed completed with #{Product.count} products and #{Size.count} sizes."
