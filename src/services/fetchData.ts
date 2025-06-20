import { createAsyncThunk } from '@reduxjs/toolkit';

const baseAPI = 'https://blog-platform.kata.academy/api';

export interface ArticleData {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData: ArticleData) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authorization token found');
    }

    const response = await fetch(`${baseAPI}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        article: articleData
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors ? JSON.stringify(data.errors) : 'Failed to create article');
    }
    
    return data;
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ articleData, slug }: { articleData: ArticleData; slug: string }) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authorization token found');
    }

    const response = await fetch(`${baseAPI}/articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        article: articleData
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors ? JSON.stringify(data.errors) : 'Failed to update article');
    }
    
    return data;
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (slug: string) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authorization token found');
    }

    const response = await fetch(`${baseAPI}/articles/${slug}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    });
    
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors ? JSON.stringify(data.errors) : 'Failed to delete article');
    }
    
    return slug;
  }
);

export const favoriteArticle = createAsyncThunk(
  'articles/favoriteArticle',
  async (slug: string) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authorization token found');
    }

    const response = await fetch(`${baseAPI}/articles/${slug}/favorite`, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors ? JSON.stringify(data.errors) : 'Failed to favorite article');
    }
    
    return data;
  }
);

export const unfavoriteArticle = createAsyncThunk(
  'articles/unfavoriteArticle',
  async (slug: string) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authorization token found');
    }

    const response = await fetch(`${baseAPI}/articles/${slug}/favorite`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.errors ? JSON.stringify(data.errors) : 'Failed to unfavorite article');
    }
    
    return data;
  }
); 