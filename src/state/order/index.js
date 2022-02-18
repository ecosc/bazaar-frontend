import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchOrdersList } from './helpers'

export const initialState = {
    isLoading: true,
    isLoadingMore: false,
    orders: [],
    lastID: -1,
}

export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async (filters) => {
        return await fetchOrdersList(filters);
    },
)

export const loadMoreOrders = createAsyncThunk(
    'order/loadMoreOrders',
    async (filters, { getState }) => {
        const state = getState();

        return await fetchOrdersList({ ...filters, fromID: state.order.lastID });
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
            state.isLoading = true;
            state.lastID = -1;
        })
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload != null) {
                state.orders = action.payload;

                if (action.payload.length > 0) {
                    state.lastID = action.payload[action.payload.length - 1].id;
                }

            } else {
                state.orders = [];
                state.lastID = -1;
            }
        })
        builder.addCase(fetchOrders.rejected, (state) => {
            state.isLoading = false;
            state.orders = [];
        })

        // LoadMoreOrders reducers
        builder.addCase(loadMoreOrders.pending, (state) => {
            state.isLoadingMore = true;
        })
        builder.addCase(loadMoreOrders.fulfilled, (state, action) => {
            state.isLoadingMore = false;
            if (action.payload != null) {
                if (action.payload.length > 0) {
                    state.orders = [...state.orders, ...action.payload];
                    state.lastID = action.payload[action.payload.length - 1].id;
                }
            }
        })
        builder.addCase(loadMoreOrders.rejected, (state) => {
            state.isLoadingMore = false;
        })
    }
})

export const { setOrders } = ordersSlice.actions;

export default ordersSlice.reducer