import api from './api';
import type { Post, PostListResponse } from '@/types/post';
import { fallbackPosts } from '@/data/blog-data';

interface GetPostsParams {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
}

export const blogService = {
  async getPosts(params: GetPostsParams = {}): Promise<PostListResponse> {
    try {
      const { data } = await api.get<PostListResponse>('/posts', { params });
      if (data && data.data && data.data.length > 0) {
        return data;
      }
    } catch {
      // Backend not running or error - fallback gracefully
    }

    let filtered = [...fallbackPosts];

    if (params.tag) {
      const tagLower = params.tag.toLowerCase();
      filtered = filtered.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tagLower)
      );
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.summary.toLowerCase().includes(searchLower) ||
          p.tags.some((t) => t.toLowerCase().includes(searchLower))
      );
    }

    return {
      data: filtered,
      total: filtered.length,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  },

  async getPostBySlug(slug: string): Promise<Post> {
    try {
      const { data } = await api.get<Post>(`/posts/${slug}`);
      if (data) return data;
    } catch {
      // Fallback
    }

    const post = fallbackPosts.find((p) => p.slug === slug);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
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

