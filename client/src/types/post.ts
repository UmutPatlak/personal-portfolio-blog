export interface Post {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  status: 'draft' | 'published';
  readingTime: number;
  authorId: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostListResponse {
  data: Post[];
  total: number;
  page: number;
  limit: number;
}
