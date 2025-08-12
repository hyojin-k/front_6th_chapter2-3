import { useQuery } from "@tanstack/react-query";
import { userApi } from "./userApi";
import { UserType } from "../model/types";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getUsers(),
  });
};

export const useGetUser = (user: UserType) => {
  return useQuery({
    queryKey: ["user", user],
    queryFn: () => userApi.getUser(user),
  });
};
