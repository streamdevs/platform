import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";

export default function Home() {
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
