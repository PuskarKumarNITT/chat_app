import React from 'react'
import { Outlet } from 'react-router-dom'
const Home = () => {
  return (
    <div>
      Home Page

      {/**  Messagee components */}
      <section>
        <Outlet></Outlet>
      </section>
    </div>
  )
}

export default Home
