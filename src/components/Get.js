import React from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';

import {
  SwitchField,
  Divider,
  Card,
  Button,
  IconInfo,
  IconDelete,
  IconEdit,
  Badge,
} from '@aws-amplify/ui-react';
import { useState, useEffect } from 'react';
import {
  getUserFragments,
  getExpandedFragments,
  getFragmentDataByID,
  getMetadataByID,
  deleteFragmentByID,
} from '../api';
import Modal from './Modal';
import Put from './Put';
const Get = ({ user }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [fragments, setFragments] = useState([]);
  const [viewBox, setViewBox] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Modal Title');

  const handleGetData = async (user, fragment, title) => {
    const res = await getFragmentDataByID(user, fragment);
    if (res) {
      setViewBox(parse(res));
      setIsOpen(true);
      setTitle(title);
    }
  };
  const handleGetMetadata = async (user, fragment, title) => {
    const res = await getMetadataByID(user, fragment);
    if (res) {
      setViewBox(
        <div>
          <pre>{JSON.stringify(res.fragment, null, 2)}</pre>
        </div>
      );
      setIsOpen(true);
      setTitle(title);
    }
  };
  const handleDelete = async (user, fragment) => {
    const res = await deleteFragmentByID(user, fragment);
    console.log(res.status);
    if (res.status === 'ok') {
      setFragments(fragments.filter((f) => f !== fragment));
    }
  };

  const handleEdit = async (user, fragment, title) => {
    fragment = fragment.id ? fragment.id : fragment;
    setViewBox(<Put user={user} id={fragment} />);
    setIsOpen(true);
    setTitle(title);
  };

  useEffect(() => {
    if (user && !isChecked) {
      getUserFragments(user)
        .then((res) => {
          setFragments(res.fragments);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (user && isChecked) {
      getExpandedFragments(user).then((res) => {
        setFragments(res.fragments);
      });
    }
  }, [isChecked, user]);
  return (
    <>
      <div className="action-landing">
        <h2 className="launch-label">Get fragment</h2>
        <Divider />
        <div>
          <SwitchField
            name="subscribe-controlled"
            isChecked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            label="Expand fragment"
          />
        </div>
        <Divider size="small" />
        {fragments &&
          fragments.map((fragment, index) => (
            <Card variation="elevated" key={index}>
              <div>
                <Badge borderRadius={'3px'} textAlign={'left'}>
                  {typeof fragment == 'object' ? (
                    <pre>{JSON.stringify(fragment, null, 2)}</pre>
                  ) : (
                    fragment
                  )}
                </Badge>
              </div>
              <div className="App-buttons">
                <Button
                  size="small"
                  color="white"
                  name="Data"
                  variation="primary"
                  onClick={(e) => handleGetData(user, fragment, e.target.name)}
                >
                  <IconInfo />
                  data
                </Button>
                <Button
                  size="small"
                  color="white"
                  name="Metadata"
                  backgroundColor={'darkblue'}
                  onClick={(e) => handleGetMetadata(user, fragment, e.target.name)}
                >
                  <IconInfo />
                  metadata
                </Button>
                <Button
                  size="small"
                  color="white"
                  backgroundColor={'goldenrod'}
                  name={`Edit Fragment ${fragment.id ? fragment.id : fragment}`}
                  onClick={(e) => handleEdit(user, fragment, e.target.name)}
                >
                  <IconEdit /> edit
                </Button>
                <Button
                  size="small"
                  backgroundColor={'darkRed'}
                  color="white"
                  onClick={() => handleDelete(user, fragment)}
                >
                  <IconDelete /> delete
                </Button>
              </div>
            </Card>
          ))}
      </div>
      {isOpen && <Modal setIsOpen={setIsOpen} info={viewBox} title={title} />}
    </>
  );
};
Get.propTypes = {
  user: PropTypes.object,
};

export default Get;
