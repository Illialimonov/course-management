import api from "../axios";

export interface StudentIn {
  _id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female";
  email: string;
  phone: string;
  username: string;
  password: string;
  birthDate: string;
  role: "student";
}

export interface UsersResponse {
  users: StudentIn[];
}

export const getUsers = async (
  controller: AbortController
): Promise<UsersResponse> => {
  try {
    const response = await api.get<UsersResponse>("/users", {
      signal: controller.signal,
    });
    return response.data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error fetching users:", error);
    }
    throw error;
  }
};
