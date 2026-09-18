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

    namespace :admin do
      # Unique name: `member { post :update }` collides with resources#update and never registers.
      post "products/:id/update", to: "products#update", as: :product_post_update
      resources :products, only: [:create, :update] do
        member do
          get :translations
          patch :reorder_images
          post :update_translations
        end
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

    resources :sessions, only: [:index]
    delete "/logout", to: "sessions#destroy"
    post "/login", to: "sessions#create"
    post "/refresh", to: "sessions#refresh"
    post "/revoke", to: "sessions#revoke"
  end

  # adidas-admin-dashboard posts /login and /refresh without the /api prefix.
  scope format: "json" do
    post "/login", to: "api/sessions#create"
    post "/refresh", to: "api/sessions#refresh"
    post "/revoke", to: "api/sessions#revoke"
    delete "/logout", to: "api/sessions#destroy"
    get "/sessions", to: "api/sessions#index"
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
