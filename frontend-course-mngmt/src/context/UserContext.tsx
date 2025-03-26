import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import api from "../api/axios";
import { CourseIn, TeacherIn, UserIn } from "../pages/Dashboard";

type UserContextProviderProps = {
  children: ReactNode;
};

// Define the context type
export const UserContext = createContext<{
  user: UserIn | TeacherIn | null;
  setUser: Dispatch<SetStateAction<UserIn | TeacherIn | null>>;
  usersCourses: CourseIn[] | null;
  setCourses: Dispatch<SetStateAction<CourseIn[] | null>>;
} | null>(null);

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<UserIn | null>(null);
  const [usersCourses, setCourses] = useState<CourseIn[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      let supertype;
      if (localStorage.getItem("type") === "teachers") {
        supertype = "teachers";
      } else if (localStorage.getItem("type") === "users") {
        supertype = "users";
      } else {
        return (
          <UserContext.Provider
            value={{ user, setUser, usersCourses, setCourses }}
          >
            {children}
          </UserContext.Provider>
        );
      }

      console.log(supertype);

      try {
        const userResponse = await api.get("/" + supertype + "/me");
        setUser(userResponse.data);

        const coursesResponse = await api.get("/" + supertype + "/my-courses");
        setCourses(coursesResponse.data);
      } catch (error) {
        console.error("Error fetching user or courses:", error);
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, usersCourses, setCourses }}>
      {children}
    </UserContext.Provider>
  );
}
