import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Suspense } from "react";
import { FirebaseAppProvider, SuspenseWithPerf } from "reactfire";

import firebaseConfig from "../../config/firebase.json";

const config = {
  useSystemColorMode: true,
};

const customTheme = extendTheme({ config });

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <Suspense fallback="loading">
          <Component {...pageProps} />
        </Suspense>
      </FirebaseAppProvider>
    </ChakraProvider>
  );
}

export default MyApp;
