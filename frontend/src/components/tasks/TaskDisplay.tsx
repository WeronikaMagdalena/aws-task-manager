import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import NotificationsPausedIcon from "@mui/icons-material/NotificationsPaused";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { Task } from "../../models/Task";

interface TaskDisplayProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const TaskDisplay = ({ task, onEdit, onDelete }: TaskDisplayProps) => {
  const onEditHandler = () => {
    onEdit(task);
  };

  const onDeleteHandler = () => {
    onDelete(task);
  };

  return (
    <Card
      sx={{
        minWidth: 345,
        borderRadius: 5,
      }}
    >
      <CardContent>
        <Box display="flex">
          <Typography gutterBottom variant="h5" component="div" flex="1">
            {task.title}
          </Typography>
          <Chip
            color={task.completed ? "success" : "warning"}
            label={task.completed ? "Completed" : "Waiting"}
            icon={task.completed ? <DoneIcon /> : <NotificationsPausedIcon />}
          />
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {task.description}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Deadline: {`${task.deadline}`}
        </Typography>
      </CardContent>
      <CardActions sx={{ pb: 2 }}>
        <Button
          size="small"
          variant="text"
          endIcon={<DeleteIcon />}
          onClick={onDeleteHandler}
          sx={{ borderRadius: 28, minWidth: 100 }}
        >
          Delete
        </Button>
        <Button
          color="primary"
          size="small"
          variant="contained"
          endIcon={<EditIcon />}
          onClick={onEditHandler}
          sx={{ borderRadius: 28, minWidth: 100 }}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskDisplay;
