import { useEffect, useState } from "react";
import { getUsers, StudentIn } from "../service/userService";
import {
  AssignmentIn,
  getAssignments,
  getGrades,
} from "../service/TeacherService";

interface FetchUsersState {
  assignments: AssignmentIn[];
  grades: [];
  loading: boolean;
  error: string | null;
}

const useFetchAssignments = (courseId: string) => {
  const [state, setState] = useState<FetchUsersState>({
    assignments: [],
    grades: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        const data = await getAssignments(controller, courseId);
        const grades = await getGrades(controller, courseId);
        setState({
          assignments: data.map((assignment) => ({
            _id: assignment._id,
            courseId: assignment.courseId,
            assignmentName: assignment.assignmentName,
          })),
          grades: grades,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setState({
            assignments: [],
            grades: [],
            loading: false,
            error: err.message,
          });
        }
      }
    };

    fetchUsers();

    return () => controller.abort(); // Cleanup to abort ongoing requests on unmount
  }, []);

  return state;
};

export default useFetchAssignments;
