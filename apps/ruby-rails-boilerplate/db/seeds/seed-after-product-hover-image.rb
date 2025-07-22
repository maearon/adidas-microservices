product = Product.find(1)

# 🧹 Xoá ảnh cũ nếu có
product.image.purge if product.image.attached?
product.hover_image.purge if product.hover_image.attached?

# 📁 Đường dẫn thư mục chứa ảnh product thumbnail
dir_path = Rails.root.join("app/assets/images/products/1/thumbnail")
image_files = Dir.glob("#{dir_path}/*.jpg").sort_by { |path| File.basename(path).downcase }

# ✅ Gắn ảnh chính (main image)
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

# ✅ Gắn ảnh hover nếu có
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

# 🔎 Tìm variant theo variant_code
variant = Variant.find_by(variant_code: "JP55933")

if variant
  # 🧹 Xoá ảnh cũ của variant nếu có
  variant.avatar.purge if variant.avatar.attached?
  variant.hover.purge if variant.hover.attached?
  variant.images.each(&:purge)

  # 📁 Đường dẫn thư mục chứa ảnh variant
  variant_dir = Rails.root.join("app/assets/images/products/1")
  
  # 📜 Danh sách ảnh mong muốn (theo tên chính xác)
  image_filenames = [
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM1.jpg",
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM3.jpg",
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM4.jpg",
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM5.jpg",
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM6.jpg",
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM7.jpg",
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM8.jpg",
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM9.jpg",
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM10.jpg",
    "F50_Messi_Elite_Firm_Ground_Cleats_White_JP5593_HM11.jpg",
  ]

  # 🔎 Tìm đúng file ảnh tương ứng trong thư mục
  variant_images = image_filenames.map do |filename|
    path = File.join(variant_dir, filename)
    File.exist?(path) ? path : nil
  end.compact

  if variant_images.size < 2
    puts "⚠️ Không đủ ảnh để gắn avatar & hover"
  else
    # ✅ Gắn avatar và hover từ ảnh đầu và thứ hai
    variant.avatar.attach(
      io: File.open(variant_images[0]),
      filename: File.basename(variant_images[0]),
      content_type: "image/jpeg"
    )
    puts "✅ Attached variant avatar: #{File.basename(variant_images[0])}"

    variant.hover.attach(
      io: File.open(variant_images[1]),
      filename: File.basename(variant_images[1]),
      content_type: "image/jpeg"
    )
    puts "✅ Attached variant hover: #{File.basename(variant_images[1])}"
  end

  # ✅ Gắn toàn bộ ảnh variant (theo đúng thứ tự đã khai báo)
  variant_images.each do |path|
    variant.images.attach(
      io: File.open(path),
      filename: File.basename(path),
      content_type: "image/jpeg"
    )
    puts "✅ Attached variant image: #{File.basename(path)}"
  end
else
  puts "❌ Variant with code 'JP55933' not found"
end

puts "🎉 Done updating images for product ##{product.id} and variant 'JP55933'"
