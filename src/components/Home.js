import React, { useState } from 'react';
import { Button } from '@aws-amplify/ui-react';
import Post from './Post';
import Get from './Get';
import Heading from './Heading';
import PropTypes from 'prop-types';
const Home = ({ signOut, user }) => {
  const [action, setAction] = useState(<Get user={user} />);

  //useEffect(() => {}, [render]);

  return (
    <div id="landing-page">
      <Heading />
      <h3>Hello {user.username} </h3>
      <div id="launch-buttons">
        <Button
          backgroundColor={'teal'}
          color={'white'}
          onClick={() => setAction(<Get user={user} />)}
          className="launch-label"
        >
          Get fragment
        </Button>

        <Button
          backgroundColor={'#0047AB'}
          color={'white'}
          onClick={() => setAction(<Post user={user} />)}
          className="launch-label"
        >
          Post fragment
        </Button>
      </div>
      {action}
      <Button onClick={signOut} className="signOut-button">
        Sign Out
      </Button>
    </div>
  );
};
Home.propTypes = {
  user: PropTypes.object,
  signOut: PropTypes.func,
};
export default Home;
