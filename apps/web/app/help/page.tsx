'use client'

import Link from 'next/link'
import { NextPage } from 'next'

const importantLinks = [
  {
    href: '/password_resets/new',
    text: '🔐 Reset Your Password',
  },
  {
    href: '/account_activations/new',
    text: '✅ Resend Activation Email',
  },
  {
    href: '/signup',
    text: '📝 Create a New Account',
  },
]

const helpLinks = [
  {
    title: 'FREQUENTLY ASKED QUESTIONS',
    items: [
      { title: 'Data Security', subtitle: 'Company Information' },
      { title: 'When will I get my refund?', subtitle: 'Returns & Refunds' },
      { title: 'How do I return my product(s)?', subtitle: 'Returns & Refunds' },
      { title: 'Can I exchange my product(s)?', subtitle: 'Returns & Refunds' },
    ],
  },
  {
    title: 'HELP CATEGORIES',
    items: [
      'ADICLUB & NEWSLETTER',
      'COMPANY INFORMATION',
      'PRODUCTS',
      'ORDERING',
      'DELIVERY',
      'PAYMENT',
      'VOUCHERS & GIFT CARDS',
      'RETURNS & REFUNDS',
      'CONFIRMED APP',
      'ADIDAS RUNNING APP',
      'SIZE GUIDE',
    ],
  },
]

const Help: NextPage = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-4">Help Center</h1>

      {/* 🎯 Highlighted quick-access links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
        {importantLinks.map((link, idx) => (
          <a
            key={idx}
            href={link.href}
            
            rel="noopener noreferrer"
            className="border-2 border-black bg-white text-black p-6 text-center font-semibold hover:bg-black hover:text-white transition rounded"
          >
            {link.text}
          </a>
        ))}
      </div>

      {/* 🧩 Main Help Sections */}
      {helpLinks.map((section, i) => (
        <div key={i} className="mb-10">
          <h2 className="text-xl font-bold mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {section.items.map((item, idx) =>
              typeof item === 'string' ? (
                <div
                  key={idx}
                  className="border border-gray-300 hover:border-black p-4 rounded-none transition"
                >
                  <span className="font-medium">{item}</span>
                </div>
              ) : (
                <div
                  key={idx}
                  className="border border-gray-300 hover:border-black p-4 rounded-none transition"
                >
                  <div className="font-medium">{item.title}</div>
                  <div className="text-gray-500 text-base">{item.subtitle}</div>
                </div>
              ),
            )}
          </div>
        </div>
      ))}

      {/* 📞 Contact */}
      <div className="border border-gray-300 p-6 mt-12 rounded-none">
        <h3 className="text-base text-gray-600 mb-2">Still can't find your answer?</h3>
        <p className="text-base text-gray-800 mb-2">ASK OUR CUSTOMER SERVICE</p>
        <p className="text-base text-gray-500 mb-4">Mon - Sun : 5:00 AM to 8:00 PM</p>
        <Link
          href="mailto:support@adidas.com"
          className="inline-block border border-black px-4 py-2 text-base font-semibold hover:bg-black hover:text-white transition"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}

export default Help
