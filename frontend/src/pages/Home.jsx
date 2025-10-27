import React from 'react'
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div>
      <div className="bg-cover bg-bottom bg-[url(../public/traffic-lights.jpg)] h-screen w-full bg-gray-200 relative">
        <img
          src="../src/assets/Uber_logo_2018.png"
          alt="Uber Logo"
          className="absolute top-4 left-4 h-17"
        />
        <>
          <style>{`
            .absolute.bottom-8.left-0.right-0 { bottom: 0 !important; }
            .absolute.bottom-8.left-0.right-0 > div {
              width: 100% !important;
              border-radius: 0 !important;
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
            @media (min-width: 768px) {
              .absolute.bottom-8.left-0.right-0 > div {
                max-width: 1024px;
                margin: 0 auto;
                border-radius: 0.5rem !important;
              }
            }
          `}</style>
        </>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex flex-col gap-4 items-center bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold">Get Started With Uber</h2>
            <Link to="/signup" className="bg-black text-white px-6 py-2 rounded">Continue</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;