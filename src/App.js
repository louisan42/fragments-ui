import logo from "./logo.svg";
import "./App.css";
import { getUser, config } from "./auth";
import {
  withAuthenticator,
  useTheme,
  Image,
  View,
  Heading,
  Loader,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";
import { useEffect, useState } from "react";
import { getUserFragments } from "./api";
import PropTypes from "prop-types";

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

  useEffect(() => {
    if (user != null) {
      getUserFragments(user);
    }
  });

  return (
    <>
      {user != null ? (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>Fragments-UI</h1>
          </header>
          <h3>Hello {user.username} </h3>
          <button onClick={signOut} className="signOut-button">
            Sign Out
          </button>
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
