import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

// Get user from localStorage
const localuser = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: localuser ? localuser : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

const formatErrorMessage = (error) => {
    if (error.response && error.response.status === 400) {
        // Check for specific error messages from backend
        if (error.response.data.message) {
            return error.response.data.message
        }
        return 'Please check your input and try again'
    }
    if (error.response && error.response.status === 401) {
        return 'Invalid credentials. Please try again'
    }
    return 'Something went wrong. Please try again'
}

// Register user
export const register = createAsyncThunk(
    'auth/register',
    async (user, thunkAPI) => {
        try {
            return await authService.register(user)
        } catch (error) { 
            const message = formatErrorMessage(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Login user
export const login = createAsyncThunk(
    'auth/login',
    async (user, thunkAPI) => {
        try {
            return await authService.login(user)
        } catch (error) {
            const message = formatErrorMessage(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Logout user
export const logout = createAsyncThunk(
    'auth/logout',
    async () => await authService.logout()
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
    },
    extraReducers: (builder) => {
        builder
            // Register cases
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            // Login cases
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            // Logout case
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer