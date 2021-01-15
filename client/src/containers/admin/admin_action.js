import React from "react";
import { Button } from "antd";
import { FormOutlined } from "@ant-design/icons";

const AdminAction = ({ onEdit }) => (
  <div className="flex admin-action">
    <Button type="link" onClick={onEdit} title="Edit">
      <FormOutlined />
    </Button>
    {/* <Popconfirm
      title="Are you sure delete this item?"
      onConfirm={onDelete}
      okText="Yes"
      cancelText="No"
    >
      <Button type="link" style={{ color: "red" }} title="Delete">
        <DeleteOutlined />
      </Button>
    </Popconfirm> */}
  </div>
);

export default AdminAction;
