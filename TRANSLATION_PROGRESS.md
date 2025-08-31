# Tiến độ Dịch thuật Frontend Adidas

## Đã hoàn thành ✅

### 1. Cấu trúc Dịch thuật
- ✅ Hệ thống hook `useTranslations` đã có sẵn
- ✅ Cấu trúc file locales với 2 ngôn ngữ: `en_US` và `vi_VN`
- ✅ File `locale.ts` đã được cập nhật với các namespace mới

### 2. File Dịch thuật Mới
- ✅ `mega-menu.json` (tiếng Anh và tiếng Việt)
- ✅ `product-list.json` (tiếng Anh và tiếng Việt)
- ✅ `footer.json` đã được cập nhật với các key mới

### 3. Components Đã được Dịch thuật
- ✅ `MainNavbar.tsx` - Sử dụng `navigation` namespace
- ✅ `mega-menu.tsx` - Sử dụng `megaMenu` namespace
- ✅ `FooterClient.tsx` - Sử dụng `footer` namespace
- ✅ `ProductListHeader.tsx` - Sử dụng `productList` namespace
- ✅ `ProductListToolbar.tsx` - Sử dụng `productList` namespace
- ✅ `CategoryPageClient.tsx` - Sử dụng `productList` namespace

### 4. Data Mega Menu
- ✅ `men-mega-menu-data.ts` - Đã thêm `translationKey` cho tất cả items
- ✅ Type `MenuCategory` đã được cập nhật để hỗ trợ `translationKey`

## Cần làm tiếp theo 🔄

### 1. Cập nhật Data Mega Menu còn lại
- [ ] `women-mega-menu-data.ts` - Thêm `translationKey`
- [ ] `kids.mega-menu-data.ts` - Thêm `translationKey`
- [ ] `sale-mega-menu-data.ts` - Thêm `translationKey`
- [ ] `back-to-school-mega-menu-data.ts` - Thêm `translationKey`
- [ ] `trending-mega-menu-data.ts` - Thêm `translationKey`

### 2. Components còn lại cần dịch thuật
- [ ] `FilterBar.tsx` - Cần thêm namespace `filter`
- [ ] `FilterChips.tsx` - Cần thêm namespace `filter`
- [ ] `ProductListContainer.tsx` - Kiểm tra text cần dịch
- [ ] Các component khác trong navbar và footer

### 3. Kiểm tra và Test
- [ ] Test chuyển đổi ngôn ngữ
- [ ] Kiểm tra tất cả text đã được dịch
- [ ] Kiểm tra responsive design với text dài
- [ ] Test với các trường hợp edge case

## Cấu trúc Namespace hiện tại

```typescript
export const locales = {
  "en_US": {
    navbar: navbarEn,
    headerNavbar: headerNavbarEn,
    hero: heroEn,
    secondHero: secondHeroEn,
    videoHero: videoHeroEn,
    common: commonEn,
    auth: authEn,
    navigation: navigationEn,
    topbar: topbarEn,
    location: locationEn,
    feedback: feedbackEn,
    account: accountEn,
    product: productEn,
    mobile: mobileEn,
    footer: footerEn,
    megaMenu: megaMenuEn,        // ✅ Mới
    productList: productListEn,  // ✅ Mới
  },
  "vi_VN": {
    // ... tương tự với tiếng Việt
  }
}
```

## Hướng dẫn sử dụng

### 1. Sử dụng trong Component
```typescript
import { useTranslations } from "@/hooks/useTranslations"

export default function MyComponent() {
  const t = useTranslations("megaMenu") // hoặc namespace khác
  
  return (
    <div>
      {t?.someKey || "Fallback text"}
    </div>
  )
}
```

### 2. Thêm Key mới vào file JSON
```json
// en_US/mega-menu.json
{
  "newKey": "English text"
}

// vi_VN/mega-menu.json  
{
  "newKey": "Tiếng Việt"
}
```

### 3. Cập nhật locale.ts
```typescript
import newNamespaceEn from "@/locales/en_US/new-namespace.json"
import newNamespaceVi from "@/locales/vi_VN/new-namespace.json"

// Thêm vào locales object
```

## Lưu ý quan trọng

1. **Fallback**: Luôn sử dụng `t?.key || "fallback text"` để tránh lỗi
2. **Type Safety**: Sử dụng `keyof typeof t` để đảm bảo type safety
3. **Consistency**: Giữ nhất quán trong việc đặt tên key
4. **Testing**: Test với cả 2 ngôn ngữ để đảm bảo UI không bị vỡ
