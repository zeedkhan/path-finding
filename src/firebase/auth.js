import {
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    getAuth,
    sendEmailVerification,
    updateEmail,
    updatePassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from 'firebase/auth'
import { login } from '../features/slice/userSlice'
import store from '../store/store'
import { setPhotoUser, getDocs, defaultUserSetting } from './firestore'

const auth = getAuth()
const provider = new GoogleAuthProvider()
const user = auth.currentUser

const getUserProfile = () => {
    // The user object has basic properties such as display name, email, etc.

    // const displayName = user.displayName
    // const email = user.email
    // const photoURL = user.photoURL
    // const emailVerified = user.emailVerified

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    // const uid = user.uid

    return {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid
    }
}

const getUserProfileByProvider = () => {
    if (user !== null) {
        user.providerData.forEach((profile) => {
            console.log('Sign-in provider: ' + profile.providerId)
            console.log('  Provider-specific UID: ' + profile.uid)
            console.log('  Name: ' + profile.displayName)
            console.log('  Email: ' + profile.email)
            console.log('  Photo URL: ' + profile.photoURL)
        })
    }
}

const logInWithEmailAndPassword = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((user) => user)
        .then((res) => {
            store.dispatch(
                login({
                    email: res.user.email,
                    photoURL: res.user.photoURL,
                    uid: res.user.uid
                })
            )

            // get user data from firestore
            getDocs()
        })
        .catch((err) => {
            console.log(err)
        })
}

const logInWithGoogle = () => {
    signInWithPopup(auth, provider)
        .then((res) => {
            const credentail = GoogleAuthProvider.credentialFromResult(res)
            /**
                details google information account here
            */

            // get user data from firestore
            getDocs()
        })
        .catch((err) => {
            console.log(err)
        })
}

const register = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            setPhotoUser(email).then((url) => {
                const currentUser = auth.currentUser
                updateProfile(currentUser, {
                    ...currentUser,
                    photoURL: url
                })
            })

            // save default setting in firestore
            defaultUserSetting()
        })
        .catch((err) => {
            // add more handle errors here
            switch (err) {
                case 'auth/email-already-in-use':
                    console.log('This email already in used')
                default:
                    break
            }
        })
}

const logOut = () => {
    signOut(auth).then(() => {
        // already sign out
        console.log('already sign out')
    }).then(() => {
        window.location.reload()
    })
}

const authChanged = () => {
    // firebase method check auth in stroage
    onAuthStateChanged(auth, (user) => {
        if (user) {
            store.dispatch(
                login({
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid
                })
            )
        } else {
            store.dispatch(login())
        }
    })
}

const resetEmailWithPassword = () => {
    // email from user
    const email = user.email
    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Password resend sent
        })
        .catch((err) => {
            console.log(err)
        })
}

const setNewPassword = (newPassword) => {
    updatePassword(user, newPassword)
        .then(() => {
            // update successful
        })
        .catch((err) => {
            console.log(err)
        })
}

const setNewEmail = (newEmail) => {
    updateEmail(user, newEmail)
        .then(() => {
            // Email updated
        })
        .catch((err) => {
            console.log(err)
        })
}

const verfifyEmail = () => {
    sendEmailVerification(user)
        .then(() => {
            // verification sent
        })
        .catch((err) => {
            console.log(err)
        })
}

export {
    getUserProfile,
    getUserProfileByProvider,
    logInWithEmailAndPassword,
    logInWithGoogle,
    register,
    logOut,
    authChanged,
    resetEmailWithPassword,
    setNewPassword,
    setNewEmail,
    verfifyEmail
}
