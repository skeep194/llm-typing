import type { PropsWithChildren } from "react";

import { Provider as ChakraProvider } from "./components/ui/provider";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter } from "react-router-dom";

const Provider = ({ children }: PropsWithChildren) => {
    return (
        <BrowserRouter>
            <ChakraProvider>
                <Toaster />
                {children}
            </ChakraProvider>
        </BrowserRouter>
    );
};

export default Provider;