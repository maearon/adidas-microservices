# 📍 Address Management API

API routes để quản lý địa chỉ của user trong checkout process.

## 📋 Routes

### 1. **GET** `/api/v1/addresses`
Lấy tất cả địa chỉ của user đang đăng nhập.

**Response:**
```json
{
  "addresses": [
    {
      "_id": "...",
      "userId": "user-123",
      "firstName": "Manh",
      "lastName": "Nguyen",
      "street": "1901 Manhattan Ave",
      "apartment": "",
      "city": "East Palo Alto",
      "state": "California",
      "zipCode": "94303-2251",
      "country": "US",
      "phone": "0912915132",
      "isDefault": true,
      "type": "delivery",
      "formattedAddress": "1901 Manhattan Ave, East Palo Alto, California, 94303-2251, US",
      "createdAt": "2025-01-15T...",
      "updatedAt": "2025-01-15T..."
    }
  ]
}
```

### 2. **POST** `/api/v1/addresses`
Tạo địa chỉ mới.

**Request Body:**
```json
{
  "firstName": "Manh",
  "lastName": "Nguyen",
  "street": "1901 Manhattan Ave",
  "apartment": "Apt 2B", // optional
  "city": "East Palo Alto",
  "state": "California",
  "zipCode": "94303-2251",
  "country": "US", // default: "US"
  "phone": "0912915132",
  "isDefault": false, // default: false
  "type": "delivery", // "delivery" | "billing" | "both"
  "latitude": 37.4683, // optional
  "longitude": -122.1431 // optional
}
```

**Response:**
```json
{
  "address": { ... }
}
```

### 3. **GET** `/api/v1/addresses/[addressId]`
Lấy thông tin một địa chỉ cụ thể.

### 4. **PUT** `/api/v1/addresses/[addressId]`
Cập nhật địa chỉ.

**Request Body:** (tương tự POST, tất cả fields đều optional)

### 5. **DELETE** `/api/v1/addresses/[addressId]`
Xóa địa chỉ.

### 6. **PUT** `/api/v1/addresses/default`
Set địa chỉ làm mặc định.

**Request Body:**
```json
{
  "addressId": "address-id-here"
}
```

### 7. **POST** `/api/v1/addresses/search`
Tìm kiếm địa chỉ từ map service.

**Request Body:**
```json
{
  "query": "1901 Manhattan Ave",
  "country": "US" // optional, default: "US"
}
```

**Response:**
```json
{
  "addresses": [
    {
      "formattedAddress": "1901 Manhattan Ave, East Palo Alto, CA 94303, USA",
      "street": "1901 Manhattan Ave",
      "city": "East Palo Alto",
      "state": "California",
      "zipCode": "94303",
      "country": "US",
      "latitude": 37.4683,
      "longitude": -122.1431
    }
  ]
}
```

## 🔐 Authentication

Tất cả routes đều yêu cầu user đăng nhập (better auth session).

## 🗄️ Database Schema

Address model được lưu trong MongoDB với các fields:

- `userId`: ID của user (từ better auth)
- `firstName`, `lastName`: Tên
- `street`: Đường
- `apartment`: Số phòng (optional)
- `city`: Thành phố
- `state`: Bang/Tỉnh
- `zipCode`: Mã bưu điện
- `country`: Quốc gia (default: "US")
- `phone`: Số điện thoại
- `isDefault`: Địa chỉ mặc định
- `type`: Loại địa chỉ ("delivery" | "billing" | "both")
- `latitude`, `longitude`: Tọa độ (optional)
- `formattedAddress`: Địa chỉ đầy đủ (auto-generated)
- `createdAt`, `updatedAt`: Timestamps

## 🗺️ Address Search Integration

API hỗ trợ 2 options cho address search:

### Option 1: Google Places API (Recommended)

**Setup:**
1. Lấy API key từ [Google Cloud Console](https://console.cloud.google.com/)
2. Enable "Places API"
3. Add vào `.env`:
   ```env
   GOOGLE_PLACES_API_KEY=your-api-key-here
   ```

**Ưu điểm:**
- Kết quả chính xác
- Auto-complete tốt
- Có place details

### Option 2: Nominatim (OpenStreetMap) - Free

**Không cần setup**, tự động fallback nếu không có Google API key.

**Lưu ý:**
- Rate limit: 1 request/second
- Cần User-Agent header
- Kết quả có thể kém chính xác hơn Google

## 📝 Usage Examples

### Frontend (React/Next.js)

```typescript
// Get all addresses
const response = await fetch('/api/v1/addresses', {
  credentials: 'include', // Include cookies for auth
});
const { addresses } = await response.json();

// Create new address
const newAddress = await fetch('/api/v1/addresses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    firstName: 'Manh',
    lastName: 'Nguyen',
    street: '1901 Manhattan Ave',
    city: 'East Palo Alto',
    state: 'California',
    zipCode: '94303-2251',
    country: 'US',
    phone: '0912915132',
    isDefault: true,
  }),
});

// Search addresses
const searchResults = await fetch('/api/v1/addresses/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Manhattan Ave',
    country: 'US',
  }),
});
```

## ⚠️ Notes

1. **Default Address**: Chỉ có 1 địa chỉ mặc định per user. Khi set một địa chỉ làm default, các địa chỉ khác sẽ tự động unset.

2. **User Ownership**: Tất cả routes đều verify address thuộc về user đang đăng nhập.

3. **Formatted Address**: Tự động generate từ các fields khi save.

4. **Validation**: Required fields: firstName, lastName, street, city, state, zipCode, phone.

