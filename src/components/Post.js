import { postFragment } from '../api';
import React from 'react';
import EntryForm from './EntryForm';
import PropTypes from 'prop-types';

const Post = ({ user }) => {
  return (
    <div className="action-landing">
      <h2 className="launch-label">Post Fragment</h2>
      <hr />
      <EntryForm action={postFragment} user={user} />
    </div>
  );
};
Post.propTypes = {
  user: PropTypes.object,
};
export default Post;
