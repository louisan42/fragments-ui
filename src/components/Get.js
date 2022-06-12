import {
  SwitchField,
  Divider,
  Card,
  Button,
  IconInfo,
  IconDelete,
  IconEdit,
  Badge,
} from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import {
  getUserFragments,
  getExpandedFragments,
  getFragmentDataByID,
  getMetadataByID,
  deleteFragmentByID,
} from "../api";
const Get = ({ user }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [fragments, setFragments] = useState([]);
  const [viewBox, setViewBox] = useState(null);

  const handleGetData = async (user, fragment) => {
    const res = await getFragmentDataByID(user, fragment);
    if (res) {
      setViewBox(res);
    }
  };
  const handleGetMetadata = async (user, fragment) => {
    const res = await getMetadataByID(user, fragment);
    if (res) {
      setViewBox(JSON.stringify(res.fragment, null, 1));
    }
  };
  const handleDelete = async (user, fragment) => {
    const res = await deleteFragmentByID(user, fragment);
    console.log(res.status);
    if (res.status === "ok") {
      setFragments(fragments.filter((f) => f !== fragment));
    }
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
  }, [user, isChecked]);
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
            <>
              <Card variation="elevated" key={index}>
                <div>
                  <Badge borderRadius={"3px"}>
                    {typeof fragment == "object"
                      ? JSON.stringify(fragment, null, 1)
                      : fragment}
                  </Badge>
                </div>
                <div className="App-buttons">
                  <Button
                    size="small"
                    color="white"
                    variation="primary"
                    onClick={() => handleGetData(user, fragment)}
                  >
                    <IconInfo />
                    data
                  </Button>
                  <Button
                    size="small"
                    color="white"
                    backgroundColor={"darkblue"}
                    onClick={() => handleGetMetadata(user, fragment)}
                  >
                    <IconInfo />
                    metadata
                  </Button>
                  <Button
                    size="small"
                    color="white"
                    backgroundColor={"goldenrod"}
                  >
                    <IconEdit /> edit
                  </Button>
                  <Button
                    size="small"
                    backgroundColor={"darkRed"}
                    color="white"
                    onClick={() => handleDelete(user, fragment)}
                  >
                    <IconDelete /> delete
                  </Button>
                </div>
              </Card>
            </>
          ))}
      </div>
      <p className="launch-label">Response</p>
      <div className="action-landing" style={{ height: "15vh" }}>
        {viewBox}
      </div>
    </>
  );
};
export default Get;
