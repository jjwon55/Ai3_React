import React from 'react'
import './App.css'
import ProductDetail from './Components/ProductDetail'

const App = () => {

    // ✅ 객체 추가
    const product = {
        id : 'p0001',
        name : '야자수',
        price : 52000,
        quantity : 1,
        img: 'https://i.imgur.com/1vpSkbW.png',
    }
  return (
    <>
      <ProductDetail product={ product} />
    </>
  )
}

export default App