import { createSlice } from "@reduxjs/toolkit";
import {
  fetchBlogDataThunk,
  loadMoreBlogPostsThunk,
} from "../thunkActionsCreator/blogThunks";

const filterPostsByCategory = (posts, category) => {
  if (category === "all" || !category) return posts;

  const numericCategory = Number(category);

  return posts.filter((post) => post.categories.includes(numericCategory));
};

const initialState = {
  posts: [],
  filteredPosts: [],
  categories: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
  activeCategory: "all",
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
      state.filteredPosts = filterPostsByCategory(state.posts, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogDataThunk.pending, (state, action) => {
        if (action.meta.arg?.page && action.meta.arg.page > 1) {
          state.loadingMore = true;
        } else {
          state.loading = true;
        }
        state.error = null;
      })
      .addCase(fetchBlogDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.page = action.payload.page;
        state.hasMore = action.payload.hasMore;

        if (action.payload.page === 1) {
          state.posts = action.payload.posts;
          state.categories = action.payload.categories;
        } else {
          state.posts = [...state.posts, ...action.payload.posts];
        }

        state.filteredPosts = filterPostsByCategory(
          state.posts,
          state.activeCategory,
        );
      })
      .addCase(fetchBlogDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;

        if (action.payload) {
          state.error = action.payload;
        }
      })
      .addCase(loadMoreBlogPostsThunk.fulfilled, (state) => {
        state.loadingMore = false;
      })
      .addCase(loadMoreBlogPostsThunk.rejected, (state) => {
        state.loadingMore = false;
      });
  },
});

export const { setActiveCategory } = blogSlice.actions;

export default blogSlice.reducer;
