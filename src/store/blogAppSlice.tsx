import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

//state
interface articleTypes {
    articles: any[];
    articlesCount: number;
    isLoading: boolean;
    error: string | null | undefined;
    currentArticle: any | null;
}

const initialState: articleTypes = {
    articles: [],
    articlesCount: 0,
    isLoading: false,
    error: null,
    currentArticle: null,
}

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async (page: number) => {
    const response = await fetch(`https://blog-platform.kata.academy/api/articles?limit=5&offset=${page*5-5}`)
    const data = await response.json()
    return data
})

export const fetchArticle = createAsyncThunk('articles/fetchArticle', async (slug: string) => {
    const response = await fetch(`https://blog-platform.kata.academy/api/articles/${slug}`)
    const data = await response.json()
    return data
})

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchArticles.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchArticles.fulfilled, (state, action) => {
            state.isLoading = false
            state.articles = action.payload.articles
            state.articlesCount = action.payload.articlesCount
        })
        .addCase(fetchArticles.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message
        })
        .addCase(fetchArticle.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchArticle.fulfilled, (state, action) => {
            state.isLoading = false
            state.currentArticle = action.payload.article
        })
        .addCase(fetchArticle.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message
        })
    }
})

export default articlesSlice.reducer;
