import React, { useState } from "react";
import { Button, Popconfirm } from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  CrownFilled,
  CrownOutlined,
} from "@ant-design/icons";

const AdminFeatureAction = ({
  onEdit,
  onDelete,
  onToggleFeature,
  featured,
}) => {
  const [fitu, setFitu] = useState(featured);
  const onClickFeature = () => {
    const f = fitu ? false : true;
    onToggleFeature(f);
    setFitu(f);
  };

  return (
    <div className="flex admin-action">
      <Button type="link" onClick={onEdit} title="Edit">
        <FormOutlined />
      </Button>
      <Button type="link" title="Featured" onClick={onClickFeature}>
        {fitu && <CrownFilled />}
        {!fitu && <CrownOutlined />}
      </Button>
      <Popconfirm
        title="Are you sure delete this item?"
        onConfirm={onDelete}
        okText="Yes"
        cancelText="No"
      >
        <Button type="link" style={{ color: "red" }} title="Delete">
          <DeleteOutlined />
        </Button>
      </Popconfirm>
    </div>
  );
};

export default AdminFeatureAction;
