# Product List & Product Details Components

## Overview

This directory contains the improved Product List and Product Details components that work like adidas.com/us, with:

- **Smart Slug Parser** - Automatically parses URL slugs to initialize filters
- **Inline Filter Bar** - Filters displayed directly on the page
- **Filter Chips** - Active filter tags that can be removed individually
- **Product List Toolbar** - Sort options, view mode toggle, and filter button
- **Infinite Scroll** - Optimized product loading with infinite scroll
- **URL Synchronization** - Filters automatically synchronized with URL

## 🎯 **Smart Slug Parser System**

### **How It Works**

The system automatically parses URL slugs to initialize filters based on adidas.com menu structure:

```typescript
// Examples of automatic filter initialization:
/men-running-shoes → { gender: ['men'], sport: ['running'], category: ['shoes'] }
/women-clothing → { gender: ['women'], category: ['clothing'] }
/kids-basketball → { gender: ['kids'], sport: ['basketball'] }
/men-under_100-shoes → { gender: ['men'], max_price: 100, category: ['shoes'] }
/collections/adicolor → { collection: ['adicolor'] }
```

### **Supported Slug Patterns**

| Pattern | Example | Filters Generated |
|---------|---------|-------------------|
| **Gender** | `/men`, `/women`, `/kids` | `gender: ['men'|'women'|'kids']` |
| **Category** | `*-shoes`, `*-clothing` | `category: ['shoes'|'clothing']` |
| **Sport** | `*-running`, `*-soccer` | `sport: ['running'|'soccer']` |
| **Product Type** | `*-t-shirts_tops` | `product_type: ['t-shirts_tops']` |
| **Price** | `*-under_100` | `max_price: 100` |
| **Collection** | `/collections/adicolor` | `collection: ['adicolor']` |
| **Activity** | `*-new_arrivals` | `activity: ['new_arrivals']` |

## Components

### 1. FilterBar (`components/FilterBar.tsx`)

Smart filter bar that automatically hides filters already set by the slug.

**Features:**
- Automatically hides filters already set by URL slug
- Gender, Category, Sport, Brand, Material, Collection, Price, Size, Color filters
- Dropdown-style filter selection
- Responsive design

**Smart Behavior:**
```typescript
// If URL is /men-running-shoes, these filters are hidden:
// - Gender (already set to 'men')
// - Sport (already set to 'running') 
// - Category (already set to 'shoes')

// Only these filters are shown:
// - Brand, Material, Collection, Price, Size, Color
```

### 2. FilterChips (`components/FilterChips.tsx`)

Displays active filters with smart removal logic.

**Features:**
- Shows all active filters
- **Slug-based filters cannot be removed** (grayed out)
- **User-added filters can be removed** (clickable)
- Clear all filters option

**Smart Removal:**
```typescript
// URL: /men-running-shoes
// Filters shown:
// ✅ Gender: Men (cannot remove - from slug)
// ✅ Sport: Running (cannot remove - from slug)  
// ✅ Category: Shoes (cannot remove - from slug)
// 🔴 Brand: adidas (can remove - user added)
// 🔴 Size: 10 (can remove - user added)
```

### 3. ProductListToolbar (`components/ProductListToolbar.tsx`)

Toolbar with sort options, view mode toggle, and filter button.

**Features:**
- Sort dropdown (Newest, Price Low-High, Price High-Low, Top Sellers, Relevance)
- View mode toggle (Grid/List)
- Filter button
- Results count display

### 4. ProductListContainer (`components/ProductListContainer.tsx`)

Container for the product grid with infinite scroll support.

**Features:**
- Responsive grid layout (2-5 columns based on screen size)
- Infinite scroll with loading states
- Grid/List view mode support
- Loading and empty state handling

### 5. ProductListHeader (`components/ProductListHeader.tsx`)

Header component with title, product count, and optional search bar.

**Features:**
- Page title and product count
- Optional search bar
- Responsive design
- Dark mode support

## 🚀 **API Integration**

### **Filter Query Parameters**

The system automatically maps filters to API query parameters:

```typescript
// URL: /men-running-shoes?size=10&color=black
// API Query:
{
  slug: "men-running-shoes",
  gender: ["men"],
  sport: ["running"], 
  category: ["shoes"],
  size: ["10"],
  color: ["black"]
}
```

### **Supported API Filters**

| Filter Type | API Parameter | Database Field |
|-------------|---------------|----------------|
| Gender | `gender` | `products.gender` |
| Category | `category` | `products.category` |
| Sport | `sport` | `products.sport` |
| Product Type | `product_type` | `products.product_type` |
| Brand | `brand` | `products.brand` |
| Material | `material` | `products.material` |
| Collection | `collection` | `products.collection` |
| Activity | `activity` | `products.activity` |
| Price Range | `min_price`, `max_price` | `variants.price` |
| Size | `size` | `variant_sizes.sizes.label` |
| Color | `color` | `variants.color` |

## 📱 **Usage Examples**

### **Basic Implementation**

```tsx
import { 
  FilterBar, 
  FilterChips, 
  ProductListToolbar, 
  ProductListContainer,
  ProductListHeader 
} from "./components"

export default function CategoryPageClient({ params }) {
  // Filters are automatically initialized from slug
  const [filters, setFilters] = useState({})
  
  // URL: /men-running-shoes automatically sets:
  // filters = { gender: ['men'], sport: ['running'], category: ['shoes'] }
  
  return (
    <>
      <ProductListHeader
        title="Men's Running Shoes"
        totalCount={totalCount}
        onSearch={handleSearch}
      />
      
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        slug={params.slug}
        totalCount={totalCount}
      />
      
      <FilterChips
        filters={filters}
        onRemoveFilter={handleRemoveFilter}
        onClearAll={handleClearFilters}
        slug={params.slug}
      />
      
      <ProductListContainer
        products={products}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={handleLoadMore}
        viewMode={viewMode}
      />
    </>
  )
}
```

### **URL Navigation Examples**

```typescript
// User clicks "Running" filter
// URL changes from: /men-shoes
// URL changes to: /men-running-shoes

// User adds size filter
// URL changes to: /men-running-shoes?size=10

// User removes size filter  
// URL changes to: /men-running-shoes

// User clears all filters
// URL changes to: /men (keeps gender filter from slug)
```

## 🔧 **Customization**

### **Adding New Filter Types**

1. **Update Slug Parser** (`utils/slug-parser.ts`):
```typescript
// Add new filter detection logic
if (parts.includes('new_filter_type')) {
  filters.new_filter_type = ['value']
}
```

2. **Update API Route** (`api/products/route.ts`):
```typescript
const newFilterType = searchParams.getAll("new_filter_type").filter(Boolean);
if (newFilterType.length) where.new_filter_type = { in: newFilterType };
```

3. **Update FilterBar** (`components/FilterBar.tsx`):
```typescript
case 'new_filter_type':
  return [
    { value: 'value1', label: 'Value 1', count: totalCount * 0.5 },
    { value: 'value2', label: 'Value 2', count: totalCount * 0.5 }
  ]
```

### **Custom Filter Options**

```typescript
// Override filter options based on business logic
const getFilterOptions = (filterType: string): FilterOption[] => {
  switch (filterType) {
    case 'sport':
      // Custom sport options based on user preferences
      return getUserPreferredSports()
    default:
      return getDefaultFilterOptions(filterType)
  }
}
```

## 🎨 **Styling & Theming**

All components support:
- Custom styling via `className` prop
- Dark mode support
- Responsive breakpoints
- Custom filter options
- Custom loading states

## 🚀 **Performance Features**

- **Smart Filter Initialization** - Only loads necessary filters
- **URL Synchronization** - Browser back/forward works correctly
- **Infinite Scroll** - Optimized product loading
- **Debounced Updates** - Efficient filter changes
- **Lazy Loading** - Images load on demand

## 📊 **Analytics & Tracking**

Track filter usage and user behavior:

```typescript
// Track filter changes
const handleFilterChange = (newFilters: Record<string, any>) => {
  // Analytics tracking
  trackFilterChange(newFilters)
  
  // Update state and URL
  setFilters(newFilters)
  updateURL(newFilters)
}
```

## 🔮 **Next Steps**

1. **Search Implementation** - Add search functionality to ProductListHeader
2. **Advanced Filters** - Add more filter types (season, occasion, etc.)
3. **Product Details** - Improve Product Details page with similar components
4. **Performance** - Add virtual scrolling for large product lists
5. **Analytics** - Track filter usage and user behavior
6. **A/B Testing** - Test different filter layouts and options

## 📝 **Testing**

Run the slug parser tests:

```bash
# Test slug parsing
node -e "import('./utils/slug-parser.test.ts')"

# Expected output:
# 🧪 Testing Slug Parser...
# Test 1: Basic men category
# Input: men
# Expected: { gender: ['men'] }
# Result: { gender: ['men'] }
# Status: ✅ PASS
```

---

**🎉 The system now automatically handles all adidas.com URL patterns and provides a seamless filtering experience!**
