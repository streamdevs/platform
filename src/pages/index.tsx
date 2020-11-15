import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Head from "next/head";
import {useAuth} from 'reactfire';

export default function Home() {

  const {currentUser} = useAuth();

  console.log({currentUser});

  return (
    <div>
      <Head>
        <title>streamdevs.app</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center minH="100vh">
        <Stack spacing={3}>
          <Text align="center">We're in a closed beta</Text>
          <Button>
            <Stack direction={"row"}>
              <FontAwesomeIcon icon={faGithub} />
              <Text>Login with GitHub</Text>
            </Stack>
          </Button>
        </Stack>
      </Center>
    </div>
  );
}
