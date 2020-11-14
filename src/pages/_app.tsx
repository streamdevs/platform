import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const config = {
  useSystemColorMode: true,
};

const customTheme = extendTheme({ config });

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
