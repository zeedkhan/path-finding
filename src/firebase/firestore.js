import { storage } from './firebase'
import { ref, getDownloadURL } from 'firebase/storage'
import {
    addDoc,
    collection,
    getFirestore,
    getDoc,
    doc,
    setDoc,
    updateDoc
} from 'firebase/firestore'
import { selectUser } from '../features/slice/userSlice'
import store from '../store/store'

// root
const storageRef = ref(storage)
const db = getFirestore()
const imageRef = ref(
    storageRef,
    process.env['REACT_APP_BASE_fireStorage_default_pics']
)

const addDocs = async () => {
    try {
        /* MOCK UP */
        const docRef = await addDoc(collection(db, 'user'), {
            name: 'seed2',
            color: 'red2'
        })
        console.log(docRef)
    } catch (error) {
        console.log(error)
    }
}

const getDocs = async () => {
    const currentStore = store.getState(selectUser)

    // const docRef = doc(db, 'user', store.getState().user.user.email)
    try {
        const docRef = doc(db, 'user', currentStore.user.user.email)
        const docSnap = await getDoc(docRef)
        const userData = docSnap.data()

        console.log('Successful getDoc')

        return userData
    } catch (error) {
        console.log(error)
    }
}

// set when interact board
// eg: move start, finish and wall
const defaultUserSetting = async () => {
    const board = store.getState().board.grid
    const currentUser = store.getState().user
    const addKeyInBoard = Object.fromEntries(Object.entries(board))

    const docData = {
        startPic: '',
        finishPic: '',
        grid: addKeyInBoard
    }

    await setDoc(doc(db, 'user', currentUser.user.email), docData)
}

const setPhotoUser = (email) => {
    // first letter of email
    const firstLetter = email.charAt(0)
    const fileName = `letter-${firstLetter}.png`
    const picRef = ref(imageRef, fileName)
    return getDownloadURL(picRef)
}

const updateGridStore = async (board, pos) => {
    const currentStore = store.getState(selectUser)

    if (currentStore.user.user != null) {
        const docRef = doc(db, 'user', currentStore.user.user.email)
    
        const addKeyInBoard = Object.fromEntries(Object.entries(board))
    
        await updateDoc(docRef, {
            grid: addKeyInBoard,
            initPosition: pos,
            speed: currentStore.speed.speed
        })
    } else {
        window.alert('Please login before save!')
    }

}

export { setPhotoUser, defaultUserSetting, getDocs, updateGridStore }
