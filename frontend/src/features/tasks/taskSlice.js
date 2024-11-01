import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import taskService from './taskService'

const initialState = {
    tasks: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

const formatErrorMessage = (error) => {
    if (error.response && error.response.status === 400) {
        return 'Please provide task details'
    }
    if (error.response && error.response.status === 401) {
        return 'Session expired. Please login again'
    }
    if (error.response && error.response.status === 404) {
        return 'Task not found'
    }
    return 'Unable to process your request. Please try again'
}

// Create new task
export const createTask = createAsyncThunk(
    'tasks/create',
    async (taskData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await taskService.createTask(taskData, token)
        } catch (error) {
            const message = formatErrorMessage(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Get user tasks
export const getTasks = createAsyncThunk(
    'tasks/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user?.token
            if (!token) {
                throw new Error('No token found')
            }
            return await taskService.getTasks(token)
        } catch (error) {
            const message = formatErrorMessage(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Delete user task
export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await taskService.deleteTask(id, token)
        } catch (error) {
            const message = formatErrorMessage(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Update user task
export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({id, taskData}, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await taskService.updateTask(id, taskData, token)
        } catch (error) {
            const message = formatErrorMessage(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTask.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tasks.push(action.payload)
            })
            .addCase(createTask.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getTasks.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tasks = action.payload
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteTask.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tasks = state.tasks.filter(
                    (task) => task._id !== action.payload.id
                )
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateTask.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.tasks = state.tasks.map((task) => 
                    task._id === action.payload._id ? action.payload : task
                )
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    },
})

export const { reset } = taskSlice.actions
export default taskSlice.reducer