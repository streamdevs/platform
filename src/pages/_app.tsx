import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {FirebaseAppProvider, SuspenseWithPerf} from 'reactfire';

import firebaseConfig from '../../config/firebase.json';

const config = {
  useSystemColorMode: true,
};

const customTheme = extendTheme({ config });

function MyApp({ Component, pageProps }) {
  return (
      <ChakraProvider theme={customTheme}>
          <FirebaseAppProvider firebaseConfig={firebaseConfig}>
              <Component {...pageProps} />
          </FirebaseAppProvider>
      </ChakraProvider>
  );
}

export default MyApp;
