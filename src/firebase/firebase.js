import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env['REACT_APP_BASE_firebaseApiKey'],
    authDomain: process.env['REACT_APP_BASE_firebaseAuthDomain'],
    projectId: process.env['REACT_APP_BASE_firebaseProjectId'],
    storageBucket: process.env['REACT_APP_BASE_firebaseStorageBucket'],
    messagingSenderId:
        process.env['REACT_APP_BASE_REACT_APP_BASE_firebaseMessagingSenderId'],
    appId: process.env['REACT_APP_BASE_firebaseAppId'],
    measurementId: process.env['REACT_APP_BASE_firebaseMeasurementId']
}

const firebaseApp = initializeApp(firebaseConfig)

const storage = getStorage(firebaseApp)
const auth = getAuth(firebaseApp)

export { auth, storage }
