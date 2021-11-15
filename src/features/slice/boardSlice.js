import createSlice from '../createSlice'

export const boardSlice = createSlice({
    name: 'board',
    initialState: {
        grid: [],
        size: { numRow: 20, numCol: 50 }
    },
    reducers: {
        setGrid: (state, action) => {
            state.grid = action.payload
        }
    }
})

export const { setGrid } = boardSlice.actions

export const selectGrid = (state) => state.board.grid
export const selectSizeGrid = (state) => state.board.grid

export default boardSlice.reducer
