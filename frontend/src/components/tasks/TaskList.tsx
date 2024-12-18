import { Task } from "../../models/Task";

import { Box } from "@mui/material";
import TaskDisplay from "./TaskDisplay";

interface Props {
  data: Array<Task>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskList({ data, onEdit, onDelete }: Props) {
  return (
    <Box
      display="grid"
      flexWrap="wrap"
      gridTemplateColumns="repeat(auto-fill, minmax(365px, 1fr))"
      sx={{ pt: "2rem", gap: "2rem" }}
    >
      {data.map((item) => (
        <>
          <TaskDisplay task={item} onEdit={onEdit} onDelete={onDelete} />
        </>
      ))}
    </Box>
  );
}
