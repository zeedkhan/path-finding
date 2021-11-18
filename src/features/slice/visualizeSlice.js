import createSlice  from '../createSlice'
import { supportBoth, supportWeight } from '../../algorithms/list'

export const visualizeSlice = createSlice({
    name: 'visualize',
    initialState: {
        visualizing: false,
        algorithm : null,
        usingWeight: true
    },
    reducers: {
        setVisualizing: (state, action) => {
            state.visualizing = action.payload
        },
        setAlgorithm: (state, action) => {
            state.algorithm = action.payload
        },
        setUsingWeight: (state, action) => {
            console.log(action.payload);
            state.algorithm = action.payload
        }
    }
})

export const { setVisualizing, setAlgorithm, setUsingWeight } = visualizeSlice.actions;

export const getVisualizing = (state) => state.visualizing.visualizing;
export const getAlgorithm = (state) => state.visualizing.algorithm;
export const getSupportWeight = (state) => supportWeight(state.visualizing.algorithm);
export const getUsingWeight = (state) => supportBoth(state.visualizing.algorithm);


export default visualizeSlice.reducer;