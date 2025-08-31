# Maearon Build - Walkthrough Starter Template

Welcome to the G Can Build Walkthrough starter template! This repository serves as the foundation for the YouTube walkthrough series where we explore building and deploying modern web applications. Link to the YT Channel: https://www.youtube.com/@GeorgeLe
https://ui.shadcn.com/docs/components
https://ui.shadcn.com/docs/components/pagination

## 🚀 Tech Stack

This project is built with a modern, production-ready tech stack:

- **Framework**: [Next.js 15](https://nextjs.org/) with React 19
- **API Layer**: [tRPC](https://trpc.io) for end-to-end typesafe APIs
- **Database**: NeonDB (Serverless Postgres) with Drizzle ORM
- **Authentication**: Built-in auth system
- **State Management**: TanStack Query (React Query) with tRPC integration
- **Type Safety**: TypeScript
- **UI Components**:
  - Radix UI primitives
  - Tailwind CSS for styling
  - shadcn/ui component library
  - Various UI utilities (date-fns, recharts, etc.)

## 🛠️ Getting Started

1. Clone this repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:
Create a `.env` file in the root directory and add necessary environment variables (refer to `.env.example` if available)

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📚 Project Structure

- `/src` - Main source code directory
- `/drizzle` - Database schema and migrations
- `/public` - Static assets
- `/src/components` - Reusable UI components
- `/src/app` - Next.js app router pages and layouts
- `/src/lib` - Utility functions and shared logic

## 🎥 YouTube Walkthroughs

This template is used in the G Can Build YouTube channel walkthroughs. Each walkthrough builds upon this foundation to create various web applications while teaching modern web development concepts.

Follow along with our walkthroughs to learn:
- Full-stack web development
- Modern React patterns and best practices
- Database design and management
- Authentication and authorization
- API development with tRPC
- Deployment and DevOps
- And much more!

## 📦 Key Features

- Modern React development with Next.js
- Type-safe API layer with tRPC
- Database operations with Drizzle ORM
- Beautiful UI components from shadcn/ui
- Built-in authentication system
- Responsive design with Tailwind CSS
- Development tools configured (ESLint, TypeScript)

## 🤝 Contributing

Feel free to use this template for your own projects or contribute improvements. Issues and pull requests are welcome!

## 📝 License

This project is open source and available under the MIT license.

---

Built with ❤️ by G Can Build

```
┌────────────┐
│  Server    │
│ (TypeScript│
│  + tRPC)   │
└─────┬──────┘
      │
      │ 1. Định nghĩa router (API)
      │    với input/output có type rõ ràng
      ▼
   routes.ts
   export const appRouter = router({
       getUser: publicProcedure
         .input(z.object({ id: z.string() }))
         .output(UserSchema)
         .query(({ input }) => {
             return db.user.findById(input.id)
         }),
   })
      │
      │
      ▼
┌────────────┐
│ tRPC Client│
│ (tự sinh)  │
└─────┬──────┘
      │ 2. Tự động generate type từ appRouter
      │
      ▼
frontend.ts
const trpc = createTRPCReact<AppRouter>()
const { data } = trpc.getUser.useQuery({ id: "123" })
      │
      │ 3. TypeScript kiểm tra:
      │    - Sai field → báo lỗi compile
      │    - Sai kiểu → báo lỗi compile
      ▼
**Kết quả**:
- Không cần viết API schema riêng
- Không cần viết types tay cho client
- Type server thay đổi → client báo lỗi ngay

Hoàn thành! Tôi đã quét toàn bộ frontend của ứng dụng Adidas trong apps/web và tạo hệ thống dịch thuật đầy đủ cho cả tiếng Anh và tiếng Việt. Đây là tổng kết những gì đã được thực hiện:
📋 Tổng Kết Công Việc Hoàn Thành
🗂️ 1. Tạo Hệ Thống File Dịch Thuật
Đã tạo 20 file JSON dịch thuật được tổ chức theo namespace:
English (en_US/):
common.json - Từ chung (search, buttons, navigation)
auth.json - Đăng nhập, đăng ký
navigation.json - Menu điều hướng
topbar.json - Thanh thông báo trên đầu
location.json - Modal chọn địa điểm
feedback.json - Modal phản hồi
account.json - Tài khoản người dùng
product.json - Sản phẩm và lightbox
mobile.json - Giao diện mobile
footer.json - Danh mục footer
Vietnamese (vi_VN/):
Tương tự với bản dịch tiếng Việt đầy đủ
🔧 2. Cập Nhật Hệ Thống Core
src/lib/locale.ts: Thêm tất cả namespace mới với type safety
src/hooks/useTranslations.ts: Đã có sẵn và hoạt động tốt
🎯 3. Cập Nhật 25+ Components
Đã chuyển đổi tất cả text tiếng Anh thành dynamic translations:
Navigation & Layout:
SearchField.tsx - Search placeholder
Breadcrumb.tsx - Back, Home navigation
BreadcrumbForDetailProductPage.tsx
navbar/TopBar.tsx - Rotating messages
top-bar-dropdown.tsx - Shipping info
navbar/MainNavbar.tsx - Menu items, cart tooltip
navbar/mobile-menu.tsx - Mobile navigation
navbar/mobile-search-overlay.tsx
navbar/mobile-app-banner.tsx
Modals & UI:
location-modal.tsx - Location selection
feedback-modal.tsx - User feedback
navbar/UserAccountSlideOut.tsx - Account panel
image-lightbox.tsx - Image viewer instructions
Product & Shopping:
ProductCardPrice.tsx - Pricing labels
product-grid.tsx - Grid navigation, filters
product-tabs.tsx - Category tabs
product-card.tsx - Add to bag, colors
HistoryView.tsx - Recently viewed
Authentication:
LoginForm.tsx - Form labels, validation
Alert.tsx - Login messages
📱 4. Responsive Design
Mobile navigation hoàn toàn được dịch
Tablet/desktop layout đều có translations
Consistent UI across all device sizes
🔄 5. Dynamic Translation Logic
Fallback mechanism: t?.key || "English fallback"
Type-safe translation keys
Redux integration cho locale switching
Namespace-based organization
🎨 6. Duy Trì UX/UI
Giữ nguyên styling và layout
Button states và interactions không đổi
Loading states được dịch
Error messages có multilingual support
🚀 Kết Quả
✅ 100% hardcoded English text đã được chuyển thành dynamic translations
✅ Hỗ trợ đầy đủ tiếng Anh và tiếng Việt
✅ Type-safe với TypeScript
✅ Fallback mechanism an toàn
✅ Cấu trúc code sạch và maintainable
Bây giờ ứng dụng của bạn đã hoàn toàn internationalized và sẵn sàng cho việc switch language động! 🌐

```
