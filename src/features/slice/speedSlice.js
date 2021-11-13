import createSlice  from '../createSlice'

export const speedSlice = createSlice({
    name: 'speed',
    initialState: {
        speed: 30,
    },
    reducers: {
        setSpeed: (state, action) => {
            state.speed = action.payload
        }
    }
})

export const { setSpeed } = speedSlice.actions;

export const getSpeed = (state) => state.speed.speed;

export default speedSlice.reducer;