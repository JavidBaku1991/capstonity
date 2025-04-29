class Product < ApplicationRecord
  has_one_attached :image, service: :amazon
end
