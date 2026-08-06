import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface PunkRecord {
  id: number;
  name: string;
  type: string;
  sub_type: string | null;
  description: string;
  image_url: string | null;
  status: string;
  origin: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export const getPunkRecords = async (): Promise<PunkRecord[]> => {
  const response = await axios.get(`${API_BASE_URL}/punk-records`);
  return response.data;
};

export const getPunkRecordById = async (id: number): Promise<PunkRecord> => {
  const response = await axios.get(`${API_BASE_URL}/punk-records/${id}`);
  return response.data;
};
