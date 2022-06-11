import "./App.css";
import { getUser, config } from "./auth";
import {
  withAuthenticator,
  useTheme,
  Image,
  View,
  Loader,
  Heading,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";
import { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Home from "./components/Home";

// Configure our Auth object to use our Cognito User Pool
Amplify.configure(config);

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="Amplify logo"
          src="https://docs.amplify.aws/assets/logo-dark.svg"
        />
        <Heading
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
          //style={{ color: #61DBFB }}
        >
          Fragment Microservice
        </Heading>
      </View>
    );
  },
};

function App({ signOut }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <>
      {user != null ? (
        <div>
          <Home user={user} signOut={signOut} />
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <Loader variation="linear" className="abs-center" />
        </div>
      )}
    </>
  );
}

App.propTypes = {
  user: PropTypes.object,
};

export default withAuthenticator(App, {
  signUpAttributes: ["email", "name"],
  components: components,
  variation: "default",
});
