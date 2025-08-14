import {
  GetUserResponseType,
  GetUsersResponseType,
  UserType,
} from "../model/types";
import { createApi } from "@/shared/api/baseApi";

const api = createApi("/api/users");

export const userApi = {
  // 사용자 목록 조회
  async getUsers(): Promise<GetUsersResponseType> {
    return api.get<GetUsersResponseType>("?limit=0&select=username,image");
  },

  // 사용자 상세 조회
  async getUser(user: UserType): Promise<GetUserResponseType> {
    return api.get<GetUserResponseType>(`/${user.id}`);
  },
};
