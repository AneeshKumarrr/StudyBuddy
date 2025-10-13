'use client'

import { useState } from 'react'
import { Coins, ShoppingCart, Heart } from 'lucide-react'

interface ShopItem {
  id: string
  sku: string
  type: 'food' | 'cosmetic'
  name: string
  description: string
  cost: number
  meta: any
}

interface ShopProps {
  userCoins: number
  onPurchase: (item: ShopItem) => void
}

export function Shop({ userCoins, onPurchase }: ShopProps) {
  const [selectedCategory, setSelectedCategory] = useState<'food' | 'cosmetic'>('food')

  // Mock shop items - in real app, this would come from Supabase
  const shopItems: ShopItem[] = [
    {
      id: '1',
      sku: 'food_basic',
      type: 'food',
      name: 'Basic Food',
      description: 'Simple pet food that gives 5 XP',
      cost: 10,
      meta: { xp_gain: 5 }
    },
    {
      id: '2',
      sku: 'food_premium',
      type: 'food',
      name: 'Premium Food',
      description: 'High-quality food that gives 15 XP',
      cost: 25,
      meta: { xp_gain: 15 }
    },
    {
      id: '3',
      sku: 'food_special',
      type: 'food',
      name: 'Special Treat',
      description: 'Rare treat that gives 30 XP',
      cost: 50,
      meta: { xp_gain: 30 }
    },
    {
      id: '4',
      sku: 'hat_red',
      type: 'cosmetic',
      name: 'Red Hat',
      description: 'A stylish red hat for your pet',
      cost: 20,
      meta: { slot: 'hat', color: 'red' }
    },
    {
      id: '5',
      sku: 'hat_blue',
      type: 'cosmetic',
      name: 'Blue Hat',
      description: 'A cool blue hat for your pet',
      cost: 20,
      meta: { slot: 'hat', color: 'blue' }
    },
    {
      id: '6',
      sku: 'collar_gold',
      type: 'cosmetic',
      name: 'Gold Collar',
      description: 'A fancy gold collar',
      cost: 30,
      meta: { slot: 'collar', color: 'gold' }
    },
    {
      id: '7',
      sku: 'toy_ball',
      type: 'cosmetic',
      name: 'Ball Toy',
      description: 'A fun ball for your pet to play with',
      cost: 15,
      meta: { slot: 'toy', type: 'ball' }
    }
  ]

  const filteredItems = shopItems.filter(item => item.type === selectedCategory)

  const getItemIcon = (item: ShopItem) => {
    if (item.type === 'food') {
      return <Heart className="w-5 h-5 text-green-500" />
    }
    return <ShoppingCart className="w-5 h-5 text-blue-500" />
  }

  const getItemEmoji = (item: ShopItem) => {
    if (item.type === 'food') {
      return '🍽️'
    }
    
    const meta = item.meta
    if (meta.slot === 'hat') {
      return meta.color === 'red' ? '🎩' : '🧢'
    }
    if (meta.slot === 'collar') {
      return '📿'
    }
    if (meta.slot === 'toy') {
      return '⚽'
    }
    
    return '🎁'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Pet Shop
        </h3>
        <div className="flex items-center gap-2 text-yellow-500">
          <Coins className="w-5 h-5" />
          <span className="font-semibold">{userCoins}</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('food')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'food'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          🍽️ Food
        </button>
        <button
          onClick={() => setSelectedCategory('cosmetic')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'cosmetic'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          🎨 Cosmetics
        </button>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {getItemEmoji(item)}
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Coins className="w-4 h-4" />
                    <span className="font-semibold">{item.cost}</span>
                  </div>
                  
                  <button
                    onClick={() => onPurchase(item)}
                    disabled={userCoins < item.cost}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    {userCoins >= item.cost ? 'Buy' : 'Not enough study coins'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No items available in this category.
        </div>
      )}
    </div>
  )
}
