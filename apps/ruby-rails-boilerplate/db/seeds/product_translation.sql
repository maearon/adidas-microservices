CREATE TABLE product_translations (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  locale TEXT NOT NULL, -- "en", "vi", "jp"
  data JSONB NOT NULL,  -- chứa description, title, highlights...
  UNIQUE(product_id, locale)
);

CREATE INDEX idx_product_translations_product_id ON product_translations(product_id);
CREATE INDEX idx_product_translations_locale ON product_translations(locale);

INSERT INTO product_translations (product_id, locale, data)
VALUES 
(
  1,
  'en',
  $${
    "description": {
      "descTitle": "Lightweight F50 cleats for showing non-stop Messi skills on firm ground.",
      "descText": "Engineered for speed, tuned for Lionel Messi. These adidas Elite soccer cleats are part of a collection created to match the GOAT's on-pitch requirements. Delivering a leather-like feel, their flexible HybridTouch upper comes with a knit \"burrito\" tongue for a wider opening and comfortable fit. The Sprintframe 360 outsole is built for quick feet on dry grass surfaces."
    },
    "details": [
      "regularFit",
      "laceClosure",
      "hybridTouchUpper",
      "adidasPrimeknitCollar",
      "sprintframe360FirmGroundOutsole",
      "imported",
      "productColor",
      "productCode"
    ],
    "highlights": [
      {
        "title": "ACCELERATE STRONGER",
        "text": "Sprintframe 360 soleplate lets you explode off the mark, just like Messi breaking past defenders."
      },
      {
        "title": "FIT LIKE MESSI",
        "text": "HybridTouch suede upper and burrito tongue match Messi’s preferred comfort and lockdown."
      },
      {
        "title": "DRIBBLE FAST",
        "text": "Materials tuned to Messi’s playing style deliver lightweight, cushioned control."
      },
      {
        "title": "EXPERIENCE LEVEL",
        "text": "Elite Level cleats are crafted for competition at an advanced level."
      }
    ]
  }$$
),
(
  1,
  'vi',
  $${
    "description": {
      "descTitle": "Giày F50 siêu nhẹ giúp bạn phô diễn kỹ năng như Messi trên mặt sân cỏ tự nhiên.",
      "descText": "Tối ưu cho tốc độ, tinh chỉnh theo phong cách thi đấu của Lionel Messi. Đôi giày bóng đá adidas Elite này được thiết kế để đáp ứng chuẩn thi đấu cao cấp theo yêu cầu của cầu thủ xuất sắc nhất thế giới. Thân giày HybridTouch mềm mại mang lại cảm giác ôm chân như da thật, kết hợp lưỡi gà dạng 'burrito' bằng dệt knit giúp mang vào dễ dàng và ôm chân êm ái. Đế Sprintframe 360 hỗ trợ bứt tốc linh hoạt và kiểm soát tuyệt vời trên mặt sân cỏ tự nhiên."
    },
    "details": [
      "form dáng regular",
      "dây buộc truyền thống",
      "thân giày HybridTouch mềm và nhẹ",
      "cổ giày adidas Primeknit linh hoạt",
      "đế Sprintframe 360 tối ưu cho sân cỏ tự nhiên",
      "sản phẩm nhập khẩu",
      "màu sắc sản phẩm",
      "mã sản phẩm"
    ],
    "highlights": [
      {
        "title": "BỨT TỐC MẠNH MẼ",
        "text": "Đế Sprintframe 360 giúp bạn bứt phá và tăng tốc giống như Messi vượt qua hàng phòng ngự."
      },
      {
        "title": "FIT CHUẨN MESSI",
        "text": "Thân giày HybridTouch kết hợp lưỡi gà dạng bao giúp ôm chân chắc và tạo cảm giác thoải mái ưu tiên của Messi."
      },
      {
        "title": "KIỂM SOÁT & RÊ DẪN NHANH",
        "text": "Chất liệu được tinh chỉnh theo phong cách thi đấu giúp kiểm soát bóng nhẹ nhàng, tốc độ và chính xác."
      },
      {
        "title": "DÀNH CHO ĐẲNG CẤP CAO",
        "text": "Phiên bản Elite được chế tác cho thi đấu ở cấp độ cao, nơi từng chuyển động đều tạo khác biệt."
      }
    ]
  }$$
);
