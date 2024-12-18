import "./App.css";
import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import Header from "./components/Header";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import TaskPage from "./pages/TaskPage";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

Amplify.configure({ ...awsExports });

const App = () => {
  return (
    <Authenticator loginMechanisms={["email"]} signUpAttributes={[]}>
      {({ signOut, user }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Header
              signOut={signOut}
              userName={user?.username || "Anonymous"}
            />
            <Box margin="5vh 5vw">
              <TaskPage />
            </Box>
          </ThemeProvider>
        </LocalizationProvider>
      )}
    </Authenticator>
  );
};

export default App;
