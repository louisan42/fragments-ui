import {
  SwitchField,
  Divider,
  Card,
  Button,
  IconInfo,
  IconDelete,
  IconEdit,
} from "@aws-amplify/ui-react";
import { useState, useEffect } from "react";
import { getUserFragments, getExpandedFragments } from "../api";
const Get = ({ user }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [fragments, setFragments] = useState([]);

  //   const fetData = async (user) => {
  //     const res = await getUserFragments(user);
  //     //const data = res.json();
  //     console.log(res);
  //   };

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
            <div>{JSON.stringify(fragment, null, 1)}</div>
            <div className="App-buttons">
              <Button size="small" color="white" variation="primary">
                <IconInfo />
                data
              </Button>
              <Button size="small" color="white" backgroundColor={"darkblue"}>
                <IconInfo />
                metadata
              </Button>
              <Button size="small" color="white" backgroundColor={"goldenrod"}>
                <IconEdit /> edit
              </Button>
              <Button size="small" backgroundColor={"darkRed"} color="white">
                <IconDelete /> delete
              </Button>
            </div>
          </Card>
        ))}
    </div>
  );
};
export default Get;
