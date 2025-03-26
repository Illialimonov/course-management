import api from "../axios";

export interface AssignmentIn {
  _id: string;
  courseId: string;
  assignmentName: string;
}

export const getAssignments = async (
  controller: AbortController,
  _id: string
): Promise<AssignmentIn[]> => {
  try {
    console.log(_id + " asdishnki");
    const response = await api.get<AssignmentIn[]>(
      `/teachers/assignment/${_id}`,
      {
        signal: controller.signal,
      }
    );
    console.log("after");

    return response.data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error fetching assignments:", error);
    }
    throw error;
  }
};

export const getGrades = async (
  controller: AbortController,
  id: string
): Promise<[]> => {
  try {
    const response = await api.get<[]>(`/teachers/grade`, {
      params: { courseId: id }, // Pass as query param
      signal: controller.signal,
    });
    return response.data;
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error fetching grades:", error);
    }
    throw error;
  }
};

export const insertGrades = async (
  grades: { studentId: string; assignmentId: string; grade: number }[]
): Promise<void> => {
  try {
    console.log("from service: " + grades);
    const response = await api.post<{
      message: string;
      saved: number;
      failed?: any[];
    }>(
      `/teachers/grades`,
      { grades } // Pass correctly in request body
    );

    console.log("Grades inserted successfully:", response.data);
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error inserting grades:", error);
    }
    throw error;
  }
};

export const createAssignment = async (
  coursId: string,
  assignmentName: string
): Promise<void> => {
  try {
    const response = await api.post<[]>(`/teachers/assignment`, {
      courseId: coursId,
      assignmentName: assignmentName,
    });
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error creating assignment", error);
    }
    throw error;
  }
};

export const deleteAssignment = async (assignmentId: string): Promise<void> => {
  try {
    const response = await api.delete(`/teachers/assignment/${assignmentId}`);
    // You can handle the response here if needed
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.log("Request aborted");
    } else {
      console.error("Error deleting assignment", error);
    }
    throw error;
  }
};
