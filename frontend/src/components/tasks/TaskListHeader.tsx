import AddCircleIcon from "@mui/icons-material/AddCircle";
import SyncIcon from "@mui/icons-material/Sync";
import IconButton from "@mui/material/IconButton";

interface Props {
  onCreateNewTask: () => void;
  onReload: () => void;
}

const TaskListHeader = ({ onCreateNewTask, onReload }: Props) => (
  <>
    <IconButton aria-label="create" size="large" onClick={onCreateNewTask}>
      <AddCircleIcon fontSize="inherit" />
    </IconButton>
    <IconButton aria-label="reload" size="large" onClick={onReload}>
      <SyncIcon fontSize="inherit" />
    </IconButton>
  </>
);

export default TaskListHeader;
