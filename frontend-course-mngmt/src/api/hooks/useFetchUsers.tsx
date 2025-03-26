import { useEffect, useState } from "react";
import { getUsers, StudentIn } from "../service/userService";

interface FetchUsersState {
  users: StudentIn[];
  loading: boolean;
  error: string | null;
}

const useFetchUsers = () => {
  const [state, setState] = useState<FetchUsersState>({
    users: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        const data = await getUsers(controller);
        setState({
          users: data.users.map((user) => ({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            gender: user.gender,
            email: user.email,
            phone: user.phone,
            username: user.username,
            password: user.password,
            birthDate: user.birthDate,
            role: "student",
          })),
          loading: false,
          error: null,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setState({ users: [], loading: false, error: err.message });
        }
      }
    };

    fetchUsers();

    return () => controller.abort(); // Cleanup to abort ongoing requests on unmount
  }, []);

  return state;
};

export default useFetchUsers;
