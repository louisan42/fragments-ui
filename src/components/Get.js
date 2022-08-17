import React from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';
import { MdInfoOutline, MdDelete, MdEdit } from 'react-icons/md';
import {
  SwitchField,
  Divider,
  Button,
  Badge,
  ButtonGroup,
  Image,
  Card,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { useState, useEffect } from 'react';
import {
  getUserFragments,
  getExpandedFragments,
  getFragmentDataByID,
  getMetadataByID,
  deleteFragmentByID,
} from '../api';
import Put from './Put';
import parse from 'html-react-parser';

const Get = ({ user }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [fragments, setFragments] = useState([]);
  const [viewBox, setViewBox] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('Modal Title');
  const [src, setSrc] = useState(null);

  const imageTypes = ['png', 'jpeg', 'gif', 'webp'];
  const textTypes = ['txt', 'json', 'html'];

  const handleGetData = async (user, fragment, title, ext = '') => {
    const res = await getFragmentDataByID(user, fragment, ext);

    if (res) {
      if (typeof res != 'string' && res.type.startsWith('image/')) {
        // eslint-disable-next-line no-undef
        const reader = new FileReader();
        reader.onloadend = () => {
          setSrc(reader.result);
          //setData(file);
        };
        reader.readAsDataURL(res);
      }
      setViewBox(
        <React.Fragment>
          {typeof res != 'string' && (
            <>
              <div className="centerItem">
                <Image src={src} alt="uploaded image" height="40%" width="40%" />
              </div>
              <ButtonGroup
                justifyContent={'center'}
                gap={'relative.small'}
                marginTop={'relative.small'}
              >
                {imageTypes
                  .filter((t) => !res.type.includes(t))
                  .map((t, index) => (
                    <Button
                      size={'small'}
                      textAlign={'center'}
                      backgroundColor={'teal.80'}
                      color={'white'}
                      fontSize={'.8em'}
                      key={index}
                      onClick={() => handleGetData(user, fragment, title, `.${t}`)}
                    >
                      convert to {t}
                    </Button>
                  ))}
              </ButtonGroup>
            </>
          )}
          {!res.type && (
            <>
              {parse(res)}
              <ButtonGroup variation="primary">
                {textTypes
                  //.filter((t) => !res.type)
                  .map((t, index) => (
                    <Button
                      key={index}
                      fontSize={'.8em'}
                      size={'small'}
                      textAlign={'center'}
                      backgroundColor={'teal.80'}
                      color={'white'}
                      marginTop={'relative.small'}
                      onClick={() => handleGetData(user, fragment, title, `.${t}`)}
                    >
                      convert to {t}
                    </Button>
                  ))}
              </ButtonGroup>
            </>
          )}
        </React.Fragment>
      );
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
  }, [isChecked, user, src]);
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
              <div className="centerItem">
                <Badge borderRadius={'3px'} textAlign={'left'}>
                  {typeof fragment == 'object' ? (
                    <pre>{JSON.stringify(fragment, null, 2)}</pre>
                  ) : (
                    fragment
                  )}
                </Badge>
              </div>
              <div className="App-buttons">
                <ButtonGroup justifyContent={'center'}>
                  <Button
                    size="small"
                    color="white"
                    name="Data"
                    backgroundColor={'teal'}
                    onClick={(e) => handleGetData(user, fragment, e.target.name)}
                  >
                    <MdInfoOutline /> data
                  </Button>
                  <Button
                    size="small"
                    color="white"
                    name="Metadata"
                    backgroundColor={'darkblue'}
                    onClick={(e) => handleGetMetadata(user, fragment, e.target.name)}
                  >
                    <MdInfoOutline /> metadata
                  </Button>
                  <Button
                    size="small"
                    color="white"
                    backgroundColor={'goldenrod'}
                    name={`Edit Fragment ${fragment.id ? fragment.id : fragment}`}
                    onClick={(e) => handleEdit(user, fragment, e.target.name)}
                  >
                    <MdEdit /> edit
                  </Button>
                  <Button
                    size="small"
                    backgroundColor={'darkRed'}
                    color="white"
                    onClick={() => handleDelete(user, fragment)}
                  >
                    <MdDelete /> delete
                  </Button>
                </ButtonGroup>
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
