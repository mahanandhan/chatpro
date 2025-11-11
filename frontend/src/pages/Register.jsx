import React from 'react'

const Register = () => {
  return (
    <div className="h-screen w-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4"
           style={{ boxShadow: '0 24px 40px 0 rgba(0,0,0,0.12)' }}>
        <h1 className="text-3xl font-bold text-gray-600 mb-4">Register</h1>
        <input type="text" placeholder='Enter Full Name' className='border border-gray-300 py-3 px-5 rounded-xl w-72 text-left placeholder:text-gray-400 placeholder:text-left outline-none mb-2'/>
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 py-3 px-5 rounded-xl w-72 text-left placeholder:text-gray-400 placeholder:text-left outline-none mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 py-3 px-5 rounded-xl w-72 text-left placeholder:text-gray-400 placeholder:text-left outline-none mb-4"
        />
        <button className="w-72 bg-linear-to-r from-blue-500 to-blue-600 text-white font-bold text-lg py-3 rounded-full shadow-lg mb-2 hover:from-blue-600 hover:to-blue-700 transition-colors cursor-pointer">
          Register
        </button>
      </div>
    </div>
  )
}

export default Register
