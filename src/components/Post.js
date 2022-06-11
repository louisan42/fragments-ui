import { useState, useEffect } from "react";
import { postFragment } from "../api";
import {
  TextAreaField,
  Flex,
  Button,
  SelectField,
} from "@aws-amplify/ui-react";

const Post = ({ user }) => {
  const [text, setText] = useState("");
  const [contentType, setContentType] = useState("");
  const [hasError, setHasError] = useState({ type: false, text: false });
  const [message, setMessage] = useState("");
  const wait = async (ms = 2000) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text && contentType) {
      const res = await postFragment(user, contentType, text);
      if (res) {
        setContentType("");
        setText("");
        setHasError({ type: false, text: false });

        setMessage("Fragment posted successfully");
        await wait();
        setMessage("");
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
    <div className="action-landing">
      <h2 className="launch-label">Post Fragment</h2>
      <hr />
      <Flex as="form" direction="column">
        <SelectField
          //isDisabled
          label="Content-Type"
          //labelHidden
          hasError={hasError.type}
          errorMessage={"Please select a content type"}
          descriptiveText=""
          onChange={(e) => setContentType(e.target.value)}
        >
          <option value="">select your content type</option>
          <option value="text/plain">text/plain</option>
        </SelectField>
        {contentType === "text/plain" && (
          <TextAreaField
            label="Text"
            placeholder="This is a text fragment input"
            descriptiveText="Please enter your text"
            resize="vertical"
            hasError={hasError.text}
            errorMessage={"Text cannot be empty"}
            onChange={(e) => setText(e.target.value)}
          />
        )}
        <Button
          variation="primary"
          type="submit"
          className=""
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </Button>
        <div style={{ color: "green" }}>{message}</div>
      </Flex>
    </div>
  );
};
export default Post;
