import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectUser } from '../../../features/slice/userSlice'
import SignIn from './SignIn'
import { setModal } from '../../../features/slice/signInModalSlice'
import { selectSignIn } from '../../../features/slice/signInModalSlice'
import { logOut } from '../../../firebase/auth'

function Login({isOpen, toggle}) {
    const dispatch = useDispatch()
    const user = useSelector(selectUser)
    const showLogin = useSelector(selectSignIn)


    useEffect(() => {
        
        if (user) {
            dispatch(setModal(false))
        }


    }, [user])

    const handleLogin = (e) => {
        e.preventDefault()
        dispatch(setModal(!showLogin))
    }

    return (
        <div className="flex items-center justify-center">
            {!user ? (
                <button
                    onClick={(e) => {
                        handleLogin(e)
                    }}
                    className="h-full w-full hover:text-black hover:bg-white pl-2 pr-2">
                    Sign In
                </button>
            ) : (
                <div
                    onClick={() => {
                        toggle(!isOpen)
                    }}
                    className="flex justify-center items-center p-1 bg-white rounded-full overflow-hidden h-4/5 w-full cursor-pointer">
                    <img
                        className="max-h-full max-w-full"
                        src={user.photoURL}
                        alt={user.email}
                    />
                </div>
            )}

            <div className={showLogin ? 'opacity-1 block' :  'opacity-0 hidden'}>
                <SignIn></SignIn>
            </div>
        </div>
    )
}

export default Login
