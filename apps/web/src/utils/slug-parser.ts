/**
 * Utility functions to parse URL slugs and initialize filters
 * Based on adidas.com menu structure and schema
 */

export interface SlugFilters {
  gender?: string[]
  genders?: string[]
  category?: string[] // nếu bạn chỉ cần 1 category
  categories?: string[] // nếu muốn hỗ trợ nhiều category thì thêm field này
  limit?: number;
  sport?: string[]
  product_type?: string[]
  brand?: string[]
  collection?: string[]
  activity?: string[]
  material?: string[]
  min_price?: number
  max_price?: number
  size?: string[]
  color?: string[]
}

/**
 * Parse slug to extract filter information
 * Examples:
 * /men-running-shoes → { gender: ['men'], sport: ['running'], category: ['shoes'] }
 * /women-clothing → { gender: ['women'], category: ['clothing'] }
 * /kids-basketball → { gender: ['kids'], sport: ['basketball'] }
 * /sale-men_shoes → { category: ['shoes'], gender: ['men'] }
 */
export function parseSlugToFilters(slug: string): SlugFilters {
  const filters: SlugFilters = {}
  
  // Split slug by hyphens and underscores
  const parts = slug.split(/[-_]/).filter(Boolean)
  
  if (parts.length === 0) return filters
  
  // Gender detection (primary filter)
  if (parts[0] === 'men') {
    filters.gender = ['men']
  } else if (parts[0] === 'women') {
    filters.gender = ['women']
  } else if (['kids', 'boys', 'girls', 'babies'].includes(parts[0])) {
    filters.gender = ['kids']
  }
  
  // Category detection
  if (parts.includes('shoes')) {
    filters.category = ['shoes']
  } else if (parts.includes('clothing')) {
    filters.category = ['clothing']
  } else if (parts.includes('accessories')) {
    filters.category = ['accessories']
  }
  
  // Sport detection
  const sports = [
    'running', 'soccer', 'basketball', 'football', 'golf', 'tennis',
    'baseball', 'volleyball', 'cycling', 'hiking', 'outdoor', 'workout',
    'yoga', 'motorsport', 'swim', 'softball', 'cricket', 'rugby',
    'skateboarding', 'weightlifting'
  ]
  
  const foundSport = parts.find(part => sports.includes(part))
  if (foundSport) {
    filters.sport = [foundSport]
  }
  
  // Product type detection
  const productTypes = [
    'sneakers', 'slides', 'sandals', 'platform', 'slip-on', 'straps',
    'pants', 'shorts', 't-shirts', 'tops', 'jerseys', 'tracksuits',
    'hoodies', 'sweatshirts', 'jackets', 'coats', 'dresses', 'skirts',
    'tights', 'leggings', 'bras', 'matching', 'uniforms'
  ]
  
  const foundProductType = parts.find(part => productTypes.includes(part))
  if (foundProductType) {
    filters.product_type = [foundProductType]
  }
  
  // Price detection
  if (parts.includes('under_100') || parts.includes('under-100')) {
    filters.max_price = 100
  } else if (parts.includes('under_80') || parts.includes('under-80')) {
    filters.max_price = 80
  } else if (parts.includes('under_60') || parts.includes('under-60')) {
    filters.max_price = 60
  }
  
  // Collection detection
  if (parts.includes('adicolor')) {
    filters.collection = ['adicolor']
  } else if (parts.includes('ultraboost')) {
    filters.collection = ['ultraboost']
  } else if (parts.includes('samba')) {
    filters.collection = ['samba']
  } else if (parts.includes('superstar')) {
    filters.collection = ['superstar']
  } else if (parts.includes('gazelle')) {
    filters.collection = ['gazelle']
  } else if (parts.includes('terrex')) {
    filters.collection = ['terrex']
  } else if (parts.includes('y-3')) {
    filters.collection = ['y-3']
  }
  
  // Activity detection
  const activities = ['new_arrivals', 'best_sellers', 'trending', 'sale', 'back_to_school']
  const foundActivity = parts.find(part => activities.includes(part))
  if (foundActivity) {
    filters.activity = [foundActivity]
  }
  
  // Age detection for kids
  if (filters.gender?.includes('kids')) {
    if (parts.includes('youth_teens') || parts.includes('youth')) {
      filters.activity = ['youth_teens']
    } else if (parts.includes('children') || parts.includes('child')) {
      filters.activity = ['children']
    } else if (parts.includes('babies_toddlers') || parts.includes('babies')) {
      filters.activity = ['babies_toddlers']
    }
  }
  
  return filters
}

/**
 * Generate URL from filters
 */
export function generateUrlFromFilters(filters: SlugFilters, baseSlug: string): string {
  let url = '/'
  
  // Gender-based base
  if (filters.gender?.includes('men')) {
    url = '/men'
  } else if (filters.gender?.includes('women')) {
    url = '/women'
  } else if (filters.gender?.includes('kids')) {
    url = '/kids'
  }
  
  // Category suffix
  if (filters.category?.includes('shoes')) {
    url += '-shoes'
  } else if (filters.category?.includes('clothing')) {
    url += '-clothing'
  } else if (filters.category?.includes('accessories')) {
    url += '-accessories'
  }
  
  // Sport suffix
  if (filters.sport?.length === 1) {
    url += `-${filters.sport[0]}`
  }
  
  // Product type suffix
  if (filters.product_type?.length === 1) {
    url += `-${filters.product_type[0]}`
  }
  
  // Price suffix
  if (filters.max_price === 100) {
    url += '-under_100'
  } else if (filters.max_price === 80) {
    url += '-under_80'
  } else if (filters.max_price === 60) {
    url += '-under_60'
  }
  
  return url
}

/**
 * Generate query parameters from filters
 */
export function generateQueryParams(filters: SlugFilters): Record<string, string[]> {
  const queryParams: Record<string, string[]> = {}
  
  // Add filters that should be in query params (not in URL path)
  Object.entries(filters).forEach(([key, value]) => {
    if (value && !['gender', 'category', 'sport', 'product_type', 'collection', 'activity', 'min_price', 'max_price'].includes(key)) {
      if (Array.isArray(value)) {
        queryParams[key] = value
      } else {
        queryParams[key] = [String(value)]
      }
    }
  })
  
  return queryParams
}

/**
 * Check if slug matches a specific pattern
 */
export function slugMatchesPattern(slug: string, pattern: string): boolean {
  const slugParts = slug.split(/[-_]/)
  const patternParts = pattern.split(/[-_]/)
  
  return patternParts.every(part => slugParts.includes(part))
}

/**
 * Get filter options based on slug context
 */
export function getFilterOptionsBySlug(slug: string) {
  const filters = parseSlugToFilters(slug)
  
  return {
    gender: filters.gender || [],
    category: filters.category || [],
    sport: filters.sport || [],
    product_type: filters.product_type || [],
    collection: filters.collection || [],
    activity: filters.activity || [],
    price: filters.max_price ? { max: filters.max_price } : null
  }
}
