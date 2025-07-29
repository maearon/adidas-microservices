product = Product.find(3)

# 🧹 Xoá ảnh cũ nếu có
product.image.purge if product.image.attached?
product.hover_image.purge if product.hover_image.attached?

# 📁 Đường dẫn đến thư mục thumbnail
thumbnail_dir = Rails.root.join("app/assets/images/products/94/thumbnail")

# 📄 Lấy danh sách ảnh và sắp xếp
image_files = Dir.glob("#{thumbnail_dir}/*.jpg").sort_by { |path| File.basename(path).downcase }

# ✅ Gắn ảnh nếu đủ file
if image_files[0] && image_files[1]
  product.variants.find_by(id: 466).avatar.attach(
    io: File.open(image_files[0]),
    filename: File.basename(image_files[0]),
    content_type: "image/jpeg"
  )

  product.variants.find_by(id: 466).hover.attach(
    io: File.open(image_files[1]),
    filename: File.basename(image_files[1]),
    content_type: "image/jpeg"
  )
else
  puts "❌ Không tìm thấy đủ ảnh trong #{thumbnail_dir}"
end