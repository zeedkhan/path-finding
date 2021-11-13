import createSlice  from '../createSlice'

export const boardSlice = createSlice({
    name: 'board',
    initialState: {
        grid: []
    },
    reducers: {
        setGrid: (state, action) => {
            state.grid = action.payload
        }
    }
})

export const { setGrid } = boardSlice.actions;

export const selectGrid = (state) => state.board.grid;

export default boardSlice.reducer;