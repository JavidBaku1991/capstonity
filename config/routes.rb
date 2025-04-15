Rails.application.routes.draw do
  root to: 'static_pages#home'
  get 'demo' => 'static_pages#demo'
end