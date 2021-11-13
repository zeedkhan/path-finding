import React, { useState } from 'react'
import {
    selectSignIn,
    setModal
} from '../../../features/slice/signInModalSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
    AiFillFacebook,
    AiFillGithub,
    AiOutlineGoogle,
    AiOutlineClose,
    AiOutlineImport
} from 'react-icons/ai'
import './SignIn.css'
import { logInWithGoogle, logInWithEmailAndPassword, register } from '../../../firebase/auth'

function SignIn() {
    const loginModal = useSelector(selectSignIn)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [normalSignIn, setNormalSignIn] = useState(false)

    const dispatch = useDispatch()

    const closeModal = (e) => {
        e.preventDefault()
        return dispatch(setModal(false))
    }

    const handleRegister = () => {
        if (password !== confirmPassword) {
            alert('Please put same password')
            return
        }

        register(email, password)
    }

    return (
        <div className="absolute signin-height left-0 top-24 w-full bg-opacity-70 flex flex-col justify-center items-center">
            <div
                className={`transform transition duration-1000 scale-0 bg-gray-700 w-1/4 rounded max-width-input overflow-hidden ${
                    loginModal && 'scale-100'
                }`}>
                <AiOutlineClose
                    onClick={(e) => closeModal(e)}
                    className="mt-2 ml-2 w-1/6 h-1/6 max-size-cross text-black text-white font-bold cursor-pointer"
                />
                <div>
                    <div className="shadow-md">
                        {/* Sign up */}

                        <form
                            className={`${
                                !normalSignIn
                                    ? 'translate-x-full pointer-none'
                                    : ''
                            } ease-in-out transform transition duration-1000 rounded w-full px-8 pt-6 pb-8 mb-4 mt-2 text-white`}>
                            <h3 className="text-xl text-center mb-4 font-semibold">
                                Sign up
                            </h3>
                            <div className="mb-4">
                                <label
                                    className="block text-sm font-bold mb-2"
                                    htmlFor="email">
                                    E-mail
                                </label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-gray-700 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Please enter email..."
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    className="block text-sm font-bold mb-2"
                                    htmlFor="password">
                                    Password
                                </label>
                                <input
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="text-gray-700 shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="******************"
                                />
                            </div>
                            <div className="mb-6">
                                <label
                                    className="block text-sm font-bold mb-2"
                                    htmlFor="confirm-password">
                                    Confirm Password
                                </label>
                                <input
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className="text-gray-700 shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="confirm-password"
                                    type="password"
                                    placeholder="******************"
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => handleRegister()}
                                    className="text-gray-700 bg-white hover:bg-gray-100 hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button">
                                    Sign Up
                                </button>
                                <button className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                                    Forgot Password?
                                </button>
                            </div>
                        </form>

                        {/* Sign in */}

                        <form
                            className={`${
                                normalSignIn ? 'translate-x-full opacity-0' : ''
                            } flex flex-col justify-center absolute top-0 ease-in-out transform transition duration-1000 rounded w-full px-8 pt-6 pb-8 mb-4 mt-10 text-white`}>
                            <h3 className="text-xl text-center mb-4 font-semibold">
                                Login
                            </h3>
                            <div className="mb-4">
                                <label
                                    className="block text-sm font-bold mb-2"
                                    htmlFor="email">
                                    E-mail
                                </label>
                                <input
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-gray-700 shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="email"
                                    type="email"
                                    placeholder="Please enter email..."
                                />
                            </div>
                            <div className="mb-2">
                                <label
                                    className="block text-sm font-bold mb-2"
                                    htmlFor="password">
                                    Password
                                </label>
                                <input
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="text-gray-700 shadow appearance-none border rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="******************"
                                />
                            </div>
                            <button
                                onClick={() => logInWithEmailAndPassword(email, password)}
                                className="mt-5 text-gray-700 bg-white hover:bg-gray-100 hover:text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="button">
                                Log in
                            </button>
                            <div className="mt-8 cursor-pointer hover:text-gray-100 text-sm font-semibold">
                                <p>Forget Password ?</p>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Alredy Member */}

                <div className="mt-5">
                    <div className="mb-5 text-center">
                        <h3>Already Member? or Sign in with</h3>
                    </div>
                    <div className="flex flex-row items-center justify-around w-ful pb-5">
                        <AiFillGithub className="w-1/6 h-1/6 max-size-icons hover:text-gray-200 cursor-pointer" />
                        <AiFillFacebook className="w-1/6 h-1/6 max-size-icons hover:text-blue-600 cursor-pointer" />
                        <AiOutlineGoogle
                            onClick={(e) => {
                                e.preventDefault()
                                logInWithGoogle()
                            }}
                            className="w-1/6 h-1/6 max-size-icons hover:text-gray-200 cursor-pointer"
                        />
                        <AiOutlineImport
                            onClick={() => setNormalSignIn(!normalSignIn)}
                            className="w-1/6 h-1/6 max-size-icons hover:text-gray-200 cursor-pointer"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
