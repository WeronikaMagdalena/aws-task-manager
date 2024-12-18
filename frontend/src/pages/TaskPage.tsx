import { useEffect, useState } from "react";
import TaskEditDialog from "../components/tasks/TaskEditDialog";
import { Task } from "../models/Task";
import TaskList from "../components/tasks/TaskList";
import taskService from "../services/TaskService";
import TaskListHeader from "../components/tasks/TaskListHeader";

const newTask: Task = {
  title: "",
  description: "",
  completed: false,
  deadline: new Date(),
};

const TaskPage = () => {
  const [open, setIsOpen] = useState<boolean>(false);
  const [task, setTask] = useState<Task>(newTask);

  const [tasks, setTasks] = useState<Array<Task>>([]);

  const openCreateDialog = () => {
    setTask(newTask);
    setIsOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setTask(task);
    setIsOpen(true);
  };

  const deleteTask = async (task: Task) => {
    await taskService.removeTask(task);
    setIsOpen(false);
    loadData();
  };

  const submitTask = async (task: Task) => {
    if (!task.id) {
      await taskService.saveTask(task);
      setIsOpen(false);
      loadData();
      return;
    }

    await taskService.modifyTask(task);
    setIsOpen(false);
    loadData();
  };

  const loadData = () => {
    taskService
      .getTasks()
      .then((res) => {
        setTasks(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <TaskListHeader onCreateNewTask={openCreateDialog} onReload={loadData} />
      <TaskList data={tasks} onEdit={openEditDialog} onDelete={deleteTask} />
      <TaskEditDialog
        open={open}
        task={task}
        onClose={() => setIsOpen(false)}
        onSubmit={submitTask}
      />
    </>
  );
};

export default TaskPage;
