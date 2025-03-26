import api from "./axios"; // Assuming you have a configured API instance

export interface LoginForm {
  username: string;
  password: string;
  type: string;
}

export const login = async ({ username, password, type }: LoginForm) => {
  try {
    let url;
    console.log(type);
    if (type === "students") {
      url = "/users/login";
    } else if (type === "teachers") {
      url = "/teachers/login";
    } else {
      url = "/admins/login";
    }
    const { data } = await api.post(url, {
      email: username,
      password,
    });
    return data;
  } catch (error) {
    throw new Error("Login failed");
  }
};
