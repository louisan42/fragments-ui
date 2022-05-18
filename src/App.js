import logo from "./logo.svg";
import "./App.css";
import { getUser } from "./auth";
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
Amplify.configure({
  Auth: {
    // Amazon Region
    region: "us-east-1",

    // Amazon Cognito User Pool ID
    userPoolId: process.env.REACT_APP_AWS_COGNITO_POOL_ID,

    // Amazon Cognito App Client ID (26-char alphanumeric string)
    userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,

    // Hosted UI configuration
    oauth: {
      // Amazon Hosted UI Domain
      domain: process.env.REACT_APP_AWS_COGNITO_HOSTED_UI_DOMAIN,

      // These scopes must match what you set in the User Pool for this App Client
      scope: ["email", "profile", "openid"],

      // NOTE: these must match what you have specified in the Hosted UI
      // app settings for Callback and Redirect URLs (e.g., no trailing slash).
      redirectSignIn: process.env.REACT_APP_OAUTH_SIGN_IN_REDIRECT_URL,
      redirectSignOut: process.env.REACT_APP_OAUTH_SIGN_OUT_REDIRECT_URL,

      // We're using the Access Code Grant flow (i.e., `code`)
      responseType: "code",
    },
  },
});

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
    if (user === null) {
      getUser().then((user) => {
        setUser(user);
      });
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
          {console.log(user)}
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <Loader variation="linear" className="abs-center" />
        </div>
      )}
    </>

    // <Authenticator signUpAttributes={["email", "name"]} components={components}>
    //   {({ signOut, user }) => (
    //     <main>
    //       <h1>Hello {user.username}</h1>
    //       <button onClick={signOut}>Sign out</button>
    //     </main>
    //   )}
    // </Authenticator>
  );
}

export default withAuthenticator(App, {
  signUpAttributes: ["email", "name"],
  components: components,
  variation: "default",
});
//export default App;
