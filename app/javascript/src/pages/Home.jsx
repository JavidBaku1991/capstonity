import React from 'react'
import ProductCard from '../components/ProductCard'

const Home = () => {
  // TODO: Fetch products from API
  const products = [
    {
      id: 1,
      title: "Product 1",
      description: "Description for product 1",
      price: 99.99,
      image: "/images/1.png"
    },
    {
      id: 2,
      title: "Product 2",
      description: "Description for product 2",
      price: 149.99,
      image: "/images/2.png"
    },
    {
      id: 3,
      title: "Product 3",
      description: "Description for product 3",
      price: 199.99,
      image: "/images/2.png"
    },
    {
      id: 4,
      title: "Product 4",
      description: "Description for product 4",
      price: 249.99,
      image: "/images/1.png"
    }
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Latest Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default Home 