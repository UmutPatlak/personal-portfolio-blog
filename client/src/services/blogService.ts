import api from './api';
import type { Post, PostListResponse } from '@/types/post';

interface GetPostsParams {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
}

export const blogService = {
  async getPosts(params: GetPostsParams = {}): Promise<PostListResponse> {
    const { data } = await api.get<PostListResponse>('/posts', { params });
    return data;
  },

  async getPostBySlug(slug: string): Promise<Post> {
    const { data } = await api.get<Post>(`/posts/${slug}`);
    return data;
  },

  async createPost(post: Partial<Post>): Promise<Post> {
    const { data } = await api.post<Post>('/posts', post);
    return data;
  },

  async updatePost(id: number, post: Partial<Post>): Promise<Post> {
    const { data } = await api.patch<Post>(`/posts/${id}`, post);
    return data;
  },

  async deletePost(id: number): Promise<void> {
    await api.delete(`/posts/${id}`);
  },
};
