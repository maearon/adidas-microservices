Rails.application.routes.draw do
  namespace :api, format: "json" do
    # Root API landing (optional)
    root 'static_pages#home'

    # Product endpoints
    resources :products do
      collection do
        get :filters
      end
    end
    get "products/:slug/:variant_code", to: "products#show"

    namespace :api do
      namespace :admin do
        resources :products, only: [:create, :update]
      end
    end

    # Order and cart management
    resources :orders
    resources :cart_items, only: [:create, :update, :destroy]
    resources :guest_cart_items, only: [:create, :update, :destroy]
    resources :cart, only: [:index]

    # Wishlist
    resources :wish_items, only: [:create, :destroy]
    resources :guest_wish_items, only: [:create, :destroy]
    resources :wish, only: [:index]

    # Product reviews
    resources :reviews, only: [:create, :update, :destroy]
  end

  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
  get '/health', to: 'application#health'

  # GraphQL endpoint
  post "/graphql", to: "graphql#execute"

  # AI chat
  post '/api/ai/chat', to: 'api/ai#chat'

  # Catch-all for SPA frontend
  get '*path', to: 'application#index', constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
