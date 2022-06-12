import { updateFragment } from "../api";

import EntryForm from "./EntryForm";

const Put = ({ user, id }) => {
  return (
    <div className="action-landing">
      {/* <h2 className="launch-label">Update Fragment</h2> */}
      <hr />
      <EntryForm action={updateFragment} user={{ user: user, id: id }} />
    </div>
  );
};
export default Put;
