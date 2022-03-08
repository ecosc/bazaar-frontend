import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    walletConnectVisible: false,
}

export const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        openWalletConnectModal: (state) => {
            state.walletConnectVisible = true;
        },
        closeWalletConnectModal: (state) => {
            state.walletConnectVisible = false;
        },
    },
})

export const { openWalletConnectModal, closeWalletConnectModal } = generalSlice.actions;

export default generalSlice.reducer