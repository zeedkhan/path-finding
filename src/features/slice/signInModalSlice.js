import createSlice  from '../createSlice'

export const signInModalSlice = createSlice({
    name: 'user',
    initialState: {
        showModal: false
    },
    reducers: {
        setModal: (state, action) => {
            state.showModal = action.payload
        }
    }
})

export const { setModal } = signInModalSlice.actions;

export const selectSignIn = (state) => state.showLoginModal.showModal;

export default signInModalSlice.reducer;