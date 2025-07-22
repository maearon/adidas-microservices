product = Product.find(1)

# Xoá ảnh cũ nếu có
product.image.purge if product.image.attached?
product.hover_image.purge if product.hover_image.attached?

# Đường dẫn thư mục chứa ảnh
dir_path = Rails.root.join("app/assets/images/products/1/thumnail")
image_files = Dir.glob("#{dir_path}/*.jpg").sort_by { |path| File.mtime(path) }

# Cập nhật ảnh chính
if image_files[0]
  product.image.attach(
    io: File.open(image_files[0]),
    filename: File.basename(image_files[0]),
    content_type: "image/jpeg"
  )
  puts "✅ Attached main image: #{File.basename(image_files[0])}"
else
  puts "⚠️ No image found for main image"
end

# Cập nhật ảnh hover nếu có ảnh thứ hai
if image_files[1]
  product.hover_image.attach(
    io: File.open(image_files[1]),
    filename: File.basename(image_files[1]),
    content_type: "image/jpeg"
  )
  puts "✅ Attached hover image: #{File.basename(image_files[1])}"
else
  puts "⚠️ No second image found for hover"
end

# Tìm variant theo variant_code
variant = Variant.find_by(variant_code: "JP55933")

if variant
  # Xoá toàn bộ ảnh cũ nếu có
  variant.avatar.purge
  variant.hover.purge
  variant.images.each(&:purge)

  # Gắn ảnh mới từ thư mục variant
  variant_dir = Rails.root.join("app/assets/images/products/1")
  variant_images = Dir.glob("#{variant_dir}/*.jpg").sort_by { |path| File.mtime(path) }

  variant.avatar.attach(
        io: File.open(variant_images[0]),
        filename: File.basename(variant_images[0]),
        content_type: "image/jpeg"
      )

  variant.hover.attach(
        io: File.open(variant_images[1]),
        filename: File.basename(variant_images[1]),
        content_type: "image/jpeg"
      )

  if variant_images.empty?
    puts "⚠️ No variant images found"
  else
    variant_images.each do |path|
      variant.images.attach(
        io: File.open(path),
        filename: File.basename(path),
        content_type: "image/jpeg"
      )
      puts "✅ Attached variant image: #{File.basename(path)}"
    end
  end
else
  puts "❌ Variant with code 'JP55933' not found"
end

puts "✅ Done updating images for product ##{product.id} and variant 'JP55933'"

puts "✅ Done updating images for product ##{product.id}"
