// apps\web\store\sessionSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/store/store'
import javaService from '@/api/services/javaService'
import { Nullable } from '@/types/common'
import { getAccessToken, getGoogleAccessToken } from '@/lib/token';

// ---- User model định nghĩa nhất quán với BE JWT response ----
export interface User {
  id: string; // ✅ sửa thành string
  email: string
  name: string
  given_name?: string
  family_name?: string
  avatar?: string
  level?: string
  token?: string
}

// ---- Slice state ----
export interface UserState {
  loggedIn: boolean
  value: User | null
  status: 'idle' | 'loading' | 'failed'
  error: Nullable<string>
}

const initialState: UserState = {
  loggedIn: false,
  value: null,
  status: 'idle',
  error: null,
}

// ---- Async thunk: lấy user hiện tại từ /sessions (dựa vào JWT) ----
export const fetchUser = createAsyncThunk(
  'session/fetchUser',
  async (_, thunkAPI) => {
    try {
      const googleAccessToken = getGoogleAccessToken()
      const token = getAccessToken()
      // Trường hợp 1: Ưu tiên check Google Access Token
      if (googleAccessToken) {
        // Gọi API userinfo của Google
        const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info from Google');
        }
        
        const googleUser = await response.json();
        
        // Chuyển đổi dữ liệu từ Google về định dạng User của bạn
        return {
          id: googleUser.sub, // 'sub' là ID duy nhất từ Google
          email: googleUser.email,
          name: googleUser.name,
          given_name: googleUser.given_name,
          family_name: googleUser.family_name,
          avatar: googleUser.picture,
          level: 'LEVEL 1', // Gán giá trị mặc định
          token: googleAccessToken,
        } as User;
      } 
      // Trường hợp 2: Nếu không có token Google, dùng token của backend
      else if (token) {
        const response = await javaService.getCurrentSession()
        // Ensure the returned user matches the User interface
        const user = response?.user
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar ?? '',
            level: user.level ?? 'LEVEL 1',
            token: user.token ?? '',
          } as User
        }
      }
      return thunkAPI.rejectWithValue('Cannot fetch user')
    } catch (error: unknown) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message)
      }
      return thunkAPI.rejectWithValue('Cannot fetch user')
    }
  }
)

// ---- Slice ----
const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    logout(state) {
      state.loggedIn = false
      state.value = null
      state.status = 'idle'
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.status = 'idle'
        state.loggedIn = true
        state.value = action.payload
        state.error = null
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed'
        state.loggedIn = false
        state.value = null
        state.error = action.payload as string
      })
  },
})

// ---- Selector ----
export const selectUser = (state: RootState) => state.session
export const selectCurrentUser = (state: RootState) => state.session.value
export const isAuthenticated = (state: RootState) =>
  !!state.session.loggedIn && !!state.session.value?.email

// ---- Export ----
export const { logout } = sessionSlice.actions
export default sessionSlice.reducer
