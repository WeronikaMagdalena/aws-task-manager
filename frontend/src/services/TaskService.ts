import { AxiosResponse } from "axios";
import { Task } from "../models/Task";
import httpClient from "./HttpClient";

class TaskService {
  private API_URL: string = `${process.env.REACT_APP_API_GATEWAY_URL}/api/tasks`;

  public getTasks(): Promise<AxiosResponse<Array<Task>>> {
    return httpClient.get<Array<Task>>(this.API_URL);
  }

  public saveTask(task: Task): Promise<Task> {
    return httpClient.post<Task, Task>(this.API_URL, task);
  }

  public modifyTask(task: Task): Promise<Task> {
    return httpClient.put<Task, Task>(`${this.API_URL}/${task.id}`, task);
  }

  public removeTask(task: Task): Promise<Task> {
    return httpClient.delete<Task, Task>(`${this.API_URL}/${task.id}`);
  }
}

const taskService = new TaskService();

export default taskService;
