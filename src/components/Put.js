import { updateFragment } from '../api';
import React from 'react';
import EntryForm from './EntryForm';
import PropTypes from 'prop-types';

const Put = ({ user, id }) => {
  return (
    <div className="action-landing">
      {/* <h2 className="launch-label">Update Fragment</h2> */}
      <hr />
      <EntryForm action={updateFragment} user={{ user: user, id: id }} />
    </div>
  );
};

Put.propTypes = {
  user: PropTypes.object,
  id: PropTypes.string,
};
export default Put;
