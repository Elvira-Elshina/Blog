import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface UserData {
    user?: {
        username: string;
        email: string;
        token?: string;
        image?: string;
    };
    errors?: {
        [key: string]: string[];
    };
}

const loadUserFromStorage = (): UserData => {
    try {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : {};
    } catch (error) {
        console.error('Error loading user data from localStorage:', error);
        return {};
    }
};

const saveUserToStorage = (userData: UserData) => {
    try {
        localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
        console.error('Error saving user data to localStorage:', error);
    }
};

const clearUserFromStorage = () => {
    try {
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
    } catch (error) {
        console.error('Error clearing user data from localStorage:', error);
    }
};

interface initialStateTypes {
    userData: UserData,
    isLoading: boolean,
    error: string | null | undefined
}

const initialState: initialStateTypes = {
    userData: loadUserFromStorage(),
    isLoading: false,
    error: null
}

const loginInitialState: initialStateTypes = {
    userData: loadUserFromStorage(),
    isLoading: false,
    error: null
}
const baseAPI = 'https://blog-platform.kata.academy/api';

export const registrationFetch = createAsyncThunk('registration/registrationFetch', async (userData: { username: string, email: string, password: string }) => {
    const resp = await fetch(`${baseAPI}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'user': {
                    'username': userData.username,
                    'email': userData.email,
                    'password': userData.password
                }
        })
        
    })

    const data = await resp.json();
    
    if (data.user?.token) {
        localStorage.setItem('authToken', data.user.token);
    }
    
    return data;
})

export const loginFetch = createAsyncThunk('login/loginFetch', async (userData: { email: string, password: string }) => {
    const resp = await fetch(`${baseAPI}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "user": {
                "email": userData.email,
                "password": userData.password
            }
        })
    })
    const data = await resp.json();
    
    if (data.user?.token) {
        localStorage.setItem('authToken', data.user.token);
    }
    
    return data;
})

export const updateProfileFetch = createAsyncThunk('profile/updateProfileFetch', async (userData: { username: string, email: string, password?: string, image?: string | null }) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
        throw new Error('No authorization token found');
    }

    const resp = await fetch(`${baseAPI}/user`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
            user: {
                username: userData.username,
                email: userData.email,
                password: userData.password,
                image: userData.image
            }
        })
    });

    const data = await resp.json();
    
    if (!resp.ok) {
        throw new Error(data.errors ? JSON.stringify(data.errors) : 'Failed to update profile');
    }
    
    return data;
})

export const loginSlice = createSlice({
    name: 'login',
    initialState: loginInitialState,
    reducers: {
        logout: (state) => {
            state.userData = {};
            state.isLoading = false;
            state.error = null;
            clearUserFromStorage();
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginFetch.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(
            loginFetch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userData = action.payload;
                saveUserToStorage(action.payload);
            }
        )
        .addCase(
            loginFetch.rejected, (state, action) => {
                state.error = action.error.message;
                state.isLoading = false;
            }
        )
        .addCase(updateProfileFetch.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(
            updateProfileFetch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userData = action.payload;
                saveUserToStorage(action.payload);
            }
        )
        .addCase(
            updateProfileFetch.rejected, (state, action) => {
                state.error = action.error.message;
                state.isLoading = false;
            }
        )
    }
})

const authSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(registrationFetch.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(
            registrationFetch.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userData = action.payload;
                saveUserToStorage(action.payload);
            }
        )
        .addCase(
            registrationFetch.rejected, (state, action) => {
                state.error = action.error.message;
                state.isLoading = false;
            }
        )
    }   
})

export const loginSliceReducer = loginSlice.reducer;
export const { logout } = loginSlice.actions;

export default authSlice.reducer;