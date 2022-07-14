import React from 'react';
import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';
import { TextAreaField, Flex, Button, SelectField } from '@aws-amplify/ui-react';

const EntryForm = ({ user, action }) => {
  const [text, setText] = useState('');
  const [contentType, setContentType] = useState('');
  const [hasError, setHasError] = useState({ type: false, text: false });
  const [errorMessage, setErrorMessage] = useState('input cannot be empty');
  const [message, setMessage] = useState('');

  const wait = async (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const localUser = user.user ? user.user : user;
    const localId = user.id ? user.id : null;
    if (text && contentType) {
      if (contentType === 'application/json') {
        try {
          JSON.parse(text);
          const res = await action(localUser, contentType, text, localId);
          if (res) {
            setContentType('');
            setText('');
            setHasError({ type: false, text: false });

            setMessage('Fragment posted successfully');
            await wait();
            setMessage('');
          }
        } catch (error) {
          setHasError({ type: false, text: true });
          setErrorMessage('Invalid syntax input');
        }
      } else {
        const res = await action(localUser, contentType, text, localId);
        if (res) {
          setContentType('');
          setText('');
          setHasError({ type: false, text: false });

          setMessage('Fragment posted successfully');
          await wait();
          setMessage('');
        }
      }
    }
  };

  useEffect(() => {
    if (text && contentType) {
      setHasError({ type: false, text: false });
    } else if (!contentType) {
      setHasError({ type: true, text: false });
    } else if (!text) {
      setHasError({ type: false, text: true });
    }
  }, [text, contentType]);

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
        <option value="text/plain; charset=utf-8">text/plain; charset=utf-8</option>
        <option value="application/json">application/json</option>
      </SelectField>
      {contentType === 'text/plain' && (
        <TextAreaField
          label="Text"
          placeholder="This is a text fragment input"
          descriptiveText="Please enter your text"
          resize="vertical"
          hasError={hasError.text}
          errorMessage={'Text cannot be empty'}
          onChange={(e) => setText(e.target.value)}
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
          onChange={(e) => setText(e.target.value)}
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
          onChange={(e) => setText(e.target.value)}
        />
      )}
      <Button variation="primary" type="submit" className="" onClick={(e) => handleSubmit(e)}>
        Submit
      </Button>
      <div style={{ color: 'green' }}>{message}</div>
    </Flex>
  );
};

EntryForm.propTypes = {
  user: PropTypes.object,
  action: PropTypes.func,
};

export default EntryForm;
