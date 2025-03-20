import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { AppProps } from "next/app";
import { AuthProvider } from "@/contexts/AuthContext";
import { InactivityProvider } from "@/contexts/InactivityProvider";
import { TokenRefreshProvider } from "@/contexts/TokenRefreshProvider";
import {DashboardLayout} from "@/components/DashboardLayout";
import { useRouter } from "next/router";

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({ config });

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isNotLoginOrRegister = !["/login", "/register"].includes(router.pathname);

  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <InactivityProvider>
          <TokenRefreshProvider>
            {isNotLoginOrRegister ? (
              <DashboardLayout>
                <Component {...pageProps} />
              </DashboardLayout>
            ) : (
              <Component {...pageProps} />
            )}
          </TokenRefreshProvider>
        </InactivityProvider>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default MyApp;
