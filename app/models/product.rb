class Product < ApplicationRecord
  belongs_to :user
  has_one_attached :image, service: :amazon
end
