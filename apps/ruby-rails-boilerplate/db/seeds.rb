# frozen_string_literal: true

require "securerandom"

puts "🌱 Seeding local catalog (sizes, categories, products, variants)..."

ALPHA_SIZES   = %w[XS S M L XL XXL].freeze
NUMERIC_SIZES = (36..45).flat_map { |n| [n.to_s, "#{n}.5"] }.freeze
LOCATIONS     = %w[US VN].freeze
PRODUCTS_IMAGE_DIR = Rails.root.join("app/assets/images/products")

def attach_file(attachment, path)
  return unless path && File.file?(path)

  attachment.attach(
    io: File.open(path),
    filename: File.basename(path),
    content_type: Marcel::MimeType.for(Pathname.new(path))
  )
rescue StandardError => e
  puts "  ⚠️ skip #{File.basename(path)}: #{e.message}"
end

def image_set_for(index)
  dir = PRODUCTS_IMAGE_DIR.join(index.to_s)
  return {} unless dir.directory?

  thumbs  = Dir.glob(dir.join("thumbnail/*.{jpg,jpeg,png,webp}")).sort_by { |p| File.basename(p).downcase }
  details = Dir.glob(dir.join("*dt*.{jpg,jpeg,png,webp}")).sort_by { |p| File.basename(p).downcase }
  hovers  = Dir.glob(dir.join("*hover*.{jpg,jpeg,png,webp}")).sort_by { |p| File.basename(p).downcase }
  mains   = Dir.glob(dir.join("*.{jpg,jpeg,png,webp}")).sort_by { |p| File.basename(p).downcase }

  image = thumbs[0] || mains[0]
  hover = thumbs[1] || hovers[0] || mains[1] || image
  {
    image: image,
    hover: hover,
    details: (details.presence || mains.drop(1)).first(4)
  }
end

puts "🧼 Clearing catalog rows..."
VariantSize.delete_all
Variant.delete_all
ActiveRecord::Base.connection.execute("DELETE FROM products_tags")
ActiveRecord::Base.connection.execute("DELETE FROM collaborations_products") if ActiveRecord::Base.connection.table_exists?("collaborations_products")
Product.delete_all
%w[variant_sizes variants products].each do |table|
  ActiveRecord::Base.connection.reset_pk_sequence!(table)
rescue StandardError
  nil
end

puts "📦 Seeding sizes..."
LOCATIONS.each do |loc|
  ALPHA_SIZES.each do |label|
    Size.find_or_create_by!(label: label, system: "alpha", location: loc)
  end
  NUMERIC_SIZES.each do |label|
    Size.find_or_create_by!(label: label, system: "numeric", location: loc)
  end
end
Size.find_or_create_by!(label: "One Size", system: "one_size", location: "GLOBAL")
Size.find_or_create_by!(label: "5", system: "ball", location: "GLOBAL")
puts "  sizes=#{Size.count}"

puts "📁 Seeding categories..."
category_records = %w[Shoes Apparel Accessories].map do |name|
  Category.find_or_create_by!(name: name) { |c| c.slug = name.parameterize }
end
category_by_name = category_records.index_by(&:name)

puts "🏷️ Seeding tags..."
%w[
  new_arrivals best_sellers prime_delivery liberty_london_florals
  fast_delivery soft_lux must_have summer_savings trending_now
  disney_collection premium_collaborations release_dates track_pants
].each do |slug|
  Tag.find_or_create_by!(slug: slug) { |t| t.name = slug.titleize }
end

puts "📚 Seeding model bases..."
%w[
  adicolor gazelle samba superstar sportswear supernova terrex ultraboost y-3 zne
  stella_mccartney originals f50 adizero 4d five_ten tiro copa
].each do |slug|
  ModelBase.find_or_create_by!(slug: slug) { |m| m.name = slug.tr("_", " ").titleize }
end

puts "🤝 Seeding collaborations..."
[
  "Bad Bunny", "Bape", "Disney", "Edison Chen", "Fear of God Athletics",
  "Pharrell", "Prada", "Sporty & Rich", "Wales Bonner"
].each do |name|
  Collaboration.find_or_create_by!(name: name) { |c| c.slug = name.parameterize }
end

brands       = %w[Adidas Originals Athletics Essentials]
sports       = %w[Running Soccer Basketball Tennis Gym Training Golf Hiking Yoga Football Baseball]
producttypes = %w[Sneakers Cleats Sandals Hoodie Pants Shorts Jacket Jersey TShirt TankTop Dress Leggings Tracksuit Bra Coat]
genders      = %w[Men Women Unisex Kids]
colors       = %w[Black White Red Blue]

image_indexes = Dir.children(PRODUCTS_IMAGE_DIR).filter_map { |name| Integer(name, exception: false) }.sort
count = [image_indexes.length, 95].min
count = 24 if count.zero?

puts "👟 Generating #{count} products..."

count.times do |i|
  index        = image_indexes[i] || (i + 1)
  brand        = brands[i % brands.length]
  sport        = sports[i % sports.length]
  producttype  = producttypes[i % producttypes.length]
  gender       = genders[i % genders.length]
  category_name = case producttype
                  when "Sneakers", "Cleats", "Sandals" then "Shoes"
                  when "Bra" then "Apparel"
                  else
                    i.even? ? "Apparel" : "Shoes"
                  end
  category_name = "Accessories" if (i % 11).zero?
  category_record = category_by_name.fetch(category_name)
  model_base = ModelBase.offset(i % ModelBase.count).first
  model_number = "MOD#{(i + 1).to_s.rjust(4, '0')}"
  name = "#{brand} #{producttype} #{i + 1}"

  model = Model.find_or_create_by!(slug: "#{model_number}-#{name.parameterize}") do |m|
    m.name = "#{brand} #{producttype} Model #{i + 1}"
    m.model_base = model_base
  end

  product = Product.new(
    name: name,
    model_number: model_number,
    gender: gender,
    franchise: i.even? ? "Tubular" : "Alphabounce",
    product_type: producttype,
    brand: brand,
    sport: sport,
    slug: "#{name.parameterize}-#{model_number.downcase}",
    status: "active",
    is_featured: i < 8,
    badge: (%w[new best_seller][i % 3] if i < 12),
    activity: %w[Outdoor Indoor Gym Training][i % 4],
    material: %w[Leather Mesh Cotton Synthetic Eco][i % 5],
    collection: model_base.slug,
    category_id: category_record.id,
    model_base_id: model_base.id,
    model: model,
    collaboration: Collaboration.offset(i % Collaboration.count).first,
    description_h5: "#{producttype} for #{sport} by #{brand}",
    description_p: "Performance-driven #{producttype} for the modern athlete.",
    care: "Machine wash cold. Tumble dry low.",
    specifications: "Ergonomic, high-performance, breathable, eco-friendly"
  )
  product[:category] = category_name
  product.save!

  tag_ids = Tag.offset(i % [Tag.count - 1, 1].max).limit(2).pluck(:id)
  product.tag_ids = tag_ids if tag_ids.any?

  images = image_set_for(index)
  attach_file(product.image, images[:image])
  attach_file(product.hover_image, images[:hover])

  sizes = case category_name
          when "Shoes"
            Size.where(system: "numeric", location: "US").to_a
          when "Apparel"
            Size.where(system: "alpha", location: "US").to_a
          else
            [Size.find_by!(label: "One Size", system: "one_size", location: "GLOBAL")]
          end

  colors.each_with_index do |color, idx|
    variant = product.variants.create!(
      color: color,
      price: (40 + ((i * 7 + idx * 11) % 110)).to_f,
      compare_at_price: (160 + ((i * 5 + idx * 9) % 90)).to_f,
      variant_code: "VC#{i + 1}-#{color[0, 2].upcase}-#{SecureRandom.hex(2)}",
      stock: 5 + ((i + idx) % 26)
    )

    attach_file(variant.avatar, images[:image])
    attach_file(variant.hover, images[:hover])
    if idx.zero?
      Array(images[:details]).each { |path| attach_file(variant.images, path) }
    end

    sizes.each do |size|
      VariantSize.create!(variant: variant, size: size, stock: 1 + ((i + idx) % 30))
    end
  end

  puts "✅ #{i + 1}/#{count} #{product.name} (#{category_name})"
end

puts "🎉 Seed done: products=#{Product.count} variants=#{Variant.count} sizes=#{Size.count}"
