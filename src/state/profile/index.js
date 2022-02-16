import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProfile } from './helpers'

export const initialState = {
    isLoading: true,
    hasRegistered: false,
    data: null,
}

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (account) => {
        return await getProfile(account);
    },
)

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        resetProfile: (state) => {
            state.isLoading = false;
            state.hasRegistered = false;
            state.data = null;
        },
        setProfile: (state, action) => {
           state.data = action.payload;
           state.hasRegistered = true;
           state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchProfile.pending, (state) => {
            state.isLoading = true
        })
        builder.addCase(fetchProfile.fulfilled, (state, action) => {
            const profile = action.payload;

            state.isLoading = false;
            state.hasRegistered = profile ? true : false;
            state.data = profile;
        })
        builder.addCase(fetchProfile.rejected, (state) => {
            state.isLoading = false
        })
    }
})

export const { resetProfile, setProfile } = profileSlice.actions;

export default profileSlice.reducer