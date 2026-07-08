module Products
  class SortService
    SORT_ALIASES = {
      "PRICE (LOW - HIGH)" => :price_asc,
      "PRICE_LOW_HIGH" => :price_asc,
      "PRICE-LOW-HIGH" => :price_asc,
      "PRICE (HIGH - LOW)" => :price_desc,
      "PRICE_HIGH_LOW" => :price_desc,
      "PRICE-HIGH-LOW" => :price_desc,
      "NEWEST" => :newest,
      "TOP SELLERS" => :top_sellers,
      "TOP_SELLERS" => :top_sellers,
      "RELEVANCE" => :default,
      "DEFAULT" => :default
    }.freeze

    def initialize(scope, sort_param)
      @scope = scope
      @sort_key = SORT_ALIASES[sort_param.to_s.upcase.strip] || :default
    end

    def call
      case @sort_key
      when :price_asc
        order_by_variant_price(:asc)
      when :price_desc
        order_by_variant_price(:desc)
      when :newest
        @scope.order(created_at: :desc)
      when :top_sellers
        @scope
          .left_joins(:reviews)
          .group("products.id")
          .order(Arel.sql("COUNT(reviews.id) DESC, COALESCE(AVG(reviews.rating), 0) DESC"))
      else
        @scope.order(:name)
      end
    end

    private

    def order_by_variant_price(direction)
      dir = direction == :desc ? "DESC" : "ASC"
      @scope
        .left_joins(:variants)
        .group("products.id")
        .order(Arel.sql("MIN(variants.price) #{dir} NULLS LAST"))
    end
  end
end
