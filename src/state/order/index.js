import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchOrdersList } from './helpers'

export const initialState = {
    isLoading: true,
    orders: []
}

export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async (filters) => {
        return await fetchOrdersList(filters);
    },
)

export const ordersSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrders.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orders = action.payload;
        })
        builder.addCase(fetchOrders.rejected, (state) => {
            state.isLoading = false
        })
    }
})

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer