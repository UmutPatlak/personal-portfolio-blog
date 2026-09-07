import api from './api';

export interface UploadResponse {
  url: string;
  filename: string;
  originalname: string;
  size: number;
  mimetype: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<UploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post<UploadResponse>('/upload/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};
