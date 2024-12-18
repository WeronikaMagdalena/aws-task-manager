import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Dialog,
  DialogTitle,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

import { Task } from "../../models/Task";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  task: Task;
  onClose: () => void;
  onSubmit: (task: Task) => void;
}

const TaskEditDialog = ({ open, task, onClose, onSubmit }: Props) => {
  const [name, setName] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [completed, setCompleted] = useState(task.completed);
  const [deadline, setDeadline] = useState<Dayjs | null>(dayjs(task.deadline));

  const onSubmitHandler = () => {
    const modifiedTask: Task = {
      ...task,
      title: name,
      description,
      completed,
      deadline: deadline?.toDate() || new Date(),
    };
    onSubmit(modifiedTask);
  };

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setCompleted(false);
      setDeadline(dayjs(new Date()));
    }
  }, [open]);

  useEffect(() => {
    setName(task.title);
    setDescription(task.description);
    setCompleted(task.completed);
    setDeadline(dayjs(task.deadline));
  }, [task]);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>{task.id ? "Edit Task" : "Create Task"}</DialogTitle>
      <Card>
        <CardContent
          sx={{ display: "flex", flexFlow: "column", minWidth: 350, gap: 2 }}
        >
          <TextField
            id="task-name"
            label="Name"
            variant="standard"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="task-description"
            label="Description"
            variant="standard"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <DatePicker
            slotProps={{
              textField: {
                variant: "standard",
              },
            }}
            label="deadline"
            value={dayjs(deadline)}
            onChange={setDeadline}
          />
          <FormGroup>
            <FormControlLabel
              control={<Checkbox />}
              label="Completed"
              value={completed}
              onChange={(e) => setCompleted(!completed)}
            />
          </FormGroup>
        </CardContent>
        <CardActions sx={{ pb: 2 }}>
          <Button
            size="small"
            variant="text"
            sx={{ borderRadius: 28, width: "100%" }}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            size="small"
            variant="contained"
            onClick={onSubmitHandler}
            sx={{ borderRadius: 28, width: "100%" }}
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </Dialog>
  );
};

export default TaskEditDialog;
