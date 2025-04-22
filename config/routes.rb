Rails.application.routes.draw do
  # Root route
  root 'home#index'
  
  # Cart routes
  resource :cart, only: [:show, :destroy]
  resources :line_items, only: [:create, :update, :destroy]
  
  # API endpoints
  resources :products, only: [:index, :show], defaults: { format: :json }
  
  # React Router catch-all - this should be the last route
  get '*path', to: 'home#index', constraints: ->(req) { !req.xhr? && req.format.html? }
end