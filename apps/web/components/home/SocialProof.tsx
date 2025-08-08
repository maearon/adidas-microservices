export default function SocialProof() {
  const stats = [
    { number: "1M+", label: "Khách hàng hài lòng" },
    { number: "500+", label: "Cửa hàng toàn quốc" },
    { number: "50+", label: "Năm kinh nghiệm" },
    { number: "24/7", label: "Hỗ trợ khách hàng" },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 dark:text-white">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
