import createSlice  from '../createSlice'

export const visualizeSlice = createSlice({
    name: 'visualize',
    initialState: {
        visualizing: false,
    },
    reducers: {
        setVisualizing: (state, action) => {
            state.visualizing = action.payload
        }
    }
})

export const { setVisualizing } = visualizeSlice.actions;

export const getVisualizing = (state) => state.visualizing.visualizing;

export default visualizeSlice.reducer;