import { postFragment } from "../api";

import EntryForm from "./EntryForm";

const Post = ({ user }) => {
  return (
    <div className="action-landing">
      <h2 className="launch-label">Post Fragment</h2>
      <hr />
      <EntryForm action={postFragment} user={user} />
    </div>
  );
};
export default Post;
