import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createArticle, updateArticle, deleteArticle, favoriteArticle, unfavoriteArticle } from '../services/fetchData';

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
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
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
        .addCase(createArticle.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(createArticle.fulfilled, (state) => {
            state.isLoading = false
        })
        .addCase(createArticle.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message
        })
        .addCase(updateArticle.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(updateArticle.fulfilled, (state) => {
            state.isLoading = false
        })
        .addCase(updateArticle.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message
        })
        .addCase(deleteArticle.pending, (state) => {
            state.isLoading = true
            state.error = null
        })
        .addCase(deleteArticle.fulfilled, (state) => {
            state.isLoading = false
            state.currentArticle = null
        })
        .addCase(deleteArticle.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message
        })
        .addCase(favoriteArticle.fulfilled, (state, action) => {
            if (state.currentArticle && state.currentArticle.slug === action.payload.article.slug) {
                state.currentArticle = action.payload.article;
            }
            const articleIndex = state.articles.findIndex(article => article.slug === action.payload.article.slug);
            if (articleIndex !== -1) {
                state.articles[articleIndex] = action.payload.article;
            }
        })
        .addCase(favoriteArticle.rejected, (state, action) => {
            state.error = action.error.message
        })
        .addCase(unfavoriteArticle.fulfilled, (state, action) => {
            if (state.currentArticle && state.currentArticle.slug === action.payload.article.slug) {
                state.currentArticle = action.payload.article;
            }
            const articleIndex = state.articles.findIndex(article => article.slug === action.payload.article.slug);
            if (articleIndex !== -1) {
                state.articles[articleIndex] = action.payload.article;
            }
        })
        .addCase(unfavoriteArticle.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export const { clearError } = articlesSlice.actions;
export default articlesSlice.reducer;
