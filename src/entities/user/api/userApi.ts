import { GetUserResponseType, GetUsersResponseType, UserType } from "../model/types";

const API_BASE_URL = "/api/users";

export const userApi = {
  // 사용자 목록 조회
  getUsers: async (): Promise<GetUsersResponseType> => {
    const response = await fetch(`${API_BASE_URL}?limit=0&select=username,image`);
    if (!response.ok) throw new Error(`사용자 목록 가져오기 오류: ${response.statusText}`);
    return response.json();
  },

  // 사용자 상세 조회
  getUser: async (user: UserType): Promise<GetUserResponseType> => {
    const response = await fetch(`${API_BASE_URL}/${user.id}`);
    if (!response.ok) throw new Error(`사용자 정보 가져오기 오류: ${response.statusText}`);
    return response.json();
  },
};
