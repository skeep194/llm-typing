import Provider from "./Provider";
import Router from "./Router";
import { Box } from "@chakra-ui/react";

const App = () => {
  return (
    <Provider>
      <Box w="100vw" h="100vh">
        <Router />
      </Box>
    </Provider>
  );
};

export default App;