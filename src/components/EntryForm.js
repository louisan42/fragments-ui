import React from 'react';
import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';
import { TextAreaField, Flex, Button, SelectField, Image } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Upload from 'rc-upload';

const EntryForm = ({ user, action }) => {
  const [data, setData] = useState('');
  const [contentType, setContentType] = useState('');
  const [hasError, setHasError] = useState({ type: false, text: false });
  const [errorMessage, setErrorMessage] = useState('input cannot be empty');
  const [message, setMessage] = useState('');
  const [imgData, setImgdata] = useState();
  //const [fileName, setFileName] = useState();
  //const [fileSize, setFileSize] = useState();
  // const [percentage, setPercentage] = useState(0);
  //const [isUploading, setIsUploading] = useState(false);

  const props = {
    beforeUpload(file) {
      // Start upload
      //setIsUploading(true);
      // Set file details
      //setFileName(file.name);
      //setFileSize(Math.floor(file.size / 1000));
      // Display image for .png format
      if (file.type.startsWith('image/')) {
        // eslint-disable-next-line no-undef
        const reader = new FileReader();
        reader.onloadend = () => {
          setImgdata(reader.result);
          setData(file);
        };
        reader.readAsDataURL(file);
      }
    },
    onSuccess() {
      // Finish upload
      //setIsUploading(false);
    },
    // onProgress(step) {
    //   // Update progress
    //   // setPercentage(Math.round(step.percent));
    // },
    onError(err) {
      console.log('onError', err);
      //setMessage('Upload failed');
    },
  };
  const wait = async (ms = 5000) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const localUser = user.user ? user.user : user;
    const localId = user.id ? user.id : null;
    if (data && contentType) {
      let res;
      if (contentType === 'application/json') {
        try {
          JSON.parse(data);
          res = await action(localUser, contentType, data, localId);
        } catch (error) {
          setHasError({ type: false, text: true });
          setErrorMessage('Invalid syntax input, try again');
          await wait();
          setErrorMessage('');
        }
      } else {
        res = data
          ? await action(localUser, contentType, data, localId)
          : await action(localUser, contentType, imgData, localId);
      }

      if (res) {
        //setContentType('select your content type');
        setData('');
        setHasError({ type: false, text: false });

        setMessage('Fragment posted successfully');
        await wait();
        setMessage('');
        SelectField.value = null;
        setData('');
        setImgdata('');
        setContentType('');
      }
    }
  };
  // const handleChange = (e) => {
  //   setData(e.target.files[0]);
  // };

  useEffect(() => {
    if (data && contentType) {
      setHasError({ type: false, text: false });
    } else if (!contentType) {
      setHasError({ type: true, text: false });
    } else if (!data) {
      setHasError({ type: false, text: true });
    }
  }, [data, contentType, imgData]);

  return (
    // <div className="action-landing">
    //   <h2 className="launch-label">Post Fragment</h2>
    //   <hr />
    <Flex as="form" direction="column">
      <SelectField
        //isDisabled
        label="Content-Type"
        //labelHidden
        hasError={hasError.type}
        errorMessage={'Please select a content type'}
        descriptiveText=""
        onChange={(e) => setContentType(e.target.value)}
      >
        <option value="">select your content type</option>
        <option value="text/plain">text/plain</option>
        <option value="text/markdown">text/markdown</option>
        <option value="text/html">text/html</option>
        <option value="application/json">application/json</option>
        <option value="image/jpeg">image/jpeg</option>
        <option value="image/png">image/png</option>
        <option value="image/gif">image/gif</option>
        <option value="image/webp">image/webp</option>
      </SelectField>
      {contentType === 'text/plain' && (
        <TextAreaField
          label="Text"
          placeholder="This is a text fragment input"
          descriptiveText="Please enter your text"
          resize="vertical"
          hasError={hasError.text}
          errorMessage={'Text cannot be empty'}
          onChange={(e) => setData(e.target.value)}
        />
      )}
      {contentType === 'text/markdown' && (
        <TextAreaField
          label="Markdown"
          placeholder="This is a Markdown fragment input"
          descriptiveText="Please enter your content"
          resize="vertical"
          hasError={hasError.text}
          errorMessage={'Input cannot be empty'}
          onChange={(e) => setData(e.target.value)}
        />
      )}
      {contentType === 'application/json' && (
        <TextAreaField
          label="JSON"
          placeholder="This is a JSON fragment input"
          descriptiveText="Please enter your content"
          resize="vertical"
          hasError={hasError.text}
          errorMessage={errorMessage}
          onChange={(e) => setData(e.target.value)}
        />
      )}
      {imgData && (
        <div className="centerItem">
          <Image src={imgData} alt="uploaded image" height="40%" width="40%" />
        </div>
      )}
      {contentType === 'image/jpeg' && (
        <>
          <Upload
            accept=".jpeg"
            //action={}
            customRequest={console.log('file recieved')}
            {...props}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Button backgroundColor="LightCoral" color="white">
              choose Image
            </Button>
          </Upload>
          {/* <Loader variation="linear" percentage={percentage} isDeterminate /> */}
        </>
      )}
      {contentType === 'image/png' && (
        <>
          <Upload
            accept=".png"
            //action={}
            {...props}
            className="centerItem"
          >
            <Button backgroundColor="LightCoral" color="white">
              choose Image
            </Button>
          </Upload>
          {/* <div className="centerItem">
            <Loader variation="linear" percentage={percentage} isDeterminate width={'92%'} />
          </div> */}
        </>
      )}
      {contentType === 'image/gif' && (
        // <>
        //   <input type="file" onChange={handleChange} />
        // </>
        <>
          <Upload
            accept=".gif"
            //action={}
            customRequest={console.log('file recieved')}
            {...props}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Button backgroundColor="LightCoral" color="white">
              choose Image
            </Button>
          </Upload>
          {/* <Loader variation="linear" percentage={percentage} isDeterminate /> */}
        </>
      )}
      {contentType === 'image/webp' && (
        // <>
        //   <input type="file" onChange={handleChange} />
        // </>
        <>
          <Upload
            accept=".webp"
            //action={}
            customRequest={console.log('file recieved')}
            {...props}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Button backgroundColor="LightCoral" color="white">
              choose Image
            </Button>
          </Upload>
          {/* <Loader variation="linear" percentage={percentage} isDeterminate /> */}
        </>
      )}
      <Button variation="primary" type="submit" className="" onClick={(e) => handleSubmit(e)}>
        Submit
      </Button>
      <div
        style={message.includes('posted') ? { color: 'green' } : { color: 'red' }}
        className="centerItem"
      >
        {message}
      </div>
    </Flex>
  );
};

EntryForm.propTypes = {
  user: PropTypes.object,
  action: PropTypes.func,
};

export default EntryForm;
