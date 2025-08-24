/**
 * Test cases for slug parser
 * This file demonstrates how the slug parser works with different URL patterns
 */

import { parseSlugToFilters, generateUrlFromFilters } from './slug-parser'

// Test cases for different slug patterns
const testCases = [
  // Basic gender filters
  {
    slug: 'men',
    expected: { gender: ['men'] },
    description: 'Basic men category'
  },
  {
    slug: 'women',
    expected: { gender: ['women'] },
    description: 'Basic women category'
  },
  {
    slug: 'kids',
    expected: { gender: ['kids'] },
    description: 'Basic kids category'
  },
  
  // Gender + Category combinations
  {
    slug: 'men-shoes',
    expected: { gender: ['men'], category: ['shoes'] },
    description: 'Men shoes category'
  },
  {
    slug: 'women-clothing',
    expected: { gender: ['women'], category: ['clothing'] },
    description: 'Women clothing category'
  },
  {
    slug: 'kids-accessories',
    expected: { gender: ['kids'], category: ['accessories'] },
    description: 'Kids accessories category'
  },
  
  // Gender + Sport combinations
  {
    slug: 'men-running',
    expected: { gender: ['men'], sport: ['running'] },
    description: 'Men running category'
  },
  {
    slug: 'women-soccer',
    expected: { gender: ['women'], sport: ['soccer'] },
    description: 'Women soccer category'
  },
  {
    slug: 'kids-basketball',
    expected: { gender: ['kids'], sport: ['basketball'] },
    description: 'Kids basketball category'
  },
  
  // Gender + Category + Sport combinations
  {
    slug: 'men-running-shoes',
    expected: { gender: ['men'], sport: ['running'], category: ['shoes'] },
    description: 'Men running shoes'
  },
  {
    slug: 'women-soccer-shoes',
    expected: { gender: ['women'], sport: ['soccer'], category: ['shoes'] },
    description: 'Women soccer shoes'
  },
  
  // Product type filters
  {
    slug: 'men-t-shirts_tops',
    expected: { gender: ['men'], product_type: ['t-shirts_tops'] },
    description: 'Men t-shirts and tops'
  },
  {
    slug: 'women-hoodies_sweatshirts',
    expected: { gender: ['women'], product_type: ['hoodies_sweatshirts'] },
    description: 'Women hoodies and sweatshirts'
  },
  
  // Price filters
  {
    slug: 'men-under_100-shoes',
    expected: { gender: ['men'], max_price: 100, category: ['shoes'] },
    description: 'Men shoes under $100'
  },
  {
    slug: 'women-shoes_under_80',
    expected: { gender: ['women'], max_price: 80, category: ['shoes'] },
    description: 'Women shoes under $80'
  },
  
  // Collection filters
  {
    slug: 'collections/adicolor',
    expected: { collection: ['adicolor'] },
    description: 'Adicolor collection'
  },
  {
    slug: 'collections/ultraboost',
    expected: { collection: ['ultraboost'] },
    description: 'Ultraboost collection'
  },
  
  // Activity filters
  {
    slug: 'men-new_arrivals',
    expected: { gender: ['men'], activity: ['new_arrivals'] },
    description: 'Men new arrivals'
  },
  {
    slug: 'women-best_sellers',
    expected: { gender: ['women'], activity: ['best_sellers'] },
    description: 'Women best sellers'
  },
  
  // Kids age-specific filters
  {
    slug: 'kids-youth_teens',
    expected: { gender: ['kids'], activity: ['youth_teens'] },
    description: 'Kids youth and teens'
  },
  {
    slug: 'kids-children',
    expected: { gender: ['kids'], activity: ['children'] },
    description: 'Kids children'
  },
  
  // Complex combinations
  {
    slug: 'men-running-shoes-under_100',
    expected: { gender: ['men'], sport: ['running'], category: ['shoes'], max_price: 100 },
    description: 'Men running shoes under $100'
  },
  {
    slug: 'women-basketball-clothing',
    expected: { gender: ['women'], sport: ['basketball'], category: ['clothing'] },
    description: 'Women basketball clothing'
  }
]

// Run test cases
console.log('🧪 Testing Slug Parser...\n')

testCases.forEach((testCase, index) => {
  const result = parseSlugToFilters(testCase.slug)
  const passed = JSON.stringify(result) === JSON.stringify(testCase.expected)
  
  console.log(`Test ${index + 1}: ${testCase.description}`)
  console.log(`Input: ${testCase.slug}`)
  console.log(`Expected:`, testCase.expected)
  console.log(`Result:`, result)
  console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`)
  console.log('---')
})

// Test URL generation
console.log('\n🧪 Testing URL Generation...\n')

const urlTestCases = [
  {
    filters: { gender: ['men'], sport: ['running'], category: ['shoes'] },
    baseSlug: 'men',
    expected: '/men-shoes-running'
  },
  {
    filters: { gender: ['women'], category: ['clothing'], max_price: 100 },
    baseSlug: 'women',
    expected: '/women-clothing-under_100'
  }
]

urlTestCases.forEach((testCase, index) => {
  const result = generateUrlFromFilters(testCase.filters, testCase.baseSlug)
  const passed = result === testCase.expected
  
  console.log(`URL Test ${index + 1}:`)
  console.log(`Filters:`, testCase.filters)
  console.log(`Expected: ${testCase.expected}`)
  console.log(`Result: ${result}`)
  console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`)
  console.log('---')
})

export { testCases, urlTestCases }
