import React from 'react'
const Home = () => {
  return (
    <div className="bg-[url(../public/uber-bg.jpg)] h-screen w-full bg-gray-200 relative">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt="Uber Logo"
        className="absolute top-4 left-4 h-6 md:h-8"
      />

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <div className="flex flex-col gap-4 items-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold">Get Started With Uber</h2>
          <button className="bg-black text-white px-6 py-2 rounded">Continue</button>
        </div>
      </div>
    </div>
  )
}

export default Home;