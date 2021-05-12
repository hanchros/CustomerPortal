import React, { useState } from "react";
import { useStoreState } from "react-flow-renderer";
import {
  Button,
  Tooltip,
  Popconfirm,
  Form,
  Input,
  message,
  Modal,
  Select,
} from "antd";
import {
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  FormOutlined,
} from "@ant-design/icons";

const MoveForm = ({
  addMove,
  editMove,
  moveData,
  companies,
  elements,
  onClose,
}) => {
  const onFinish = (values) => {
    if (moveData.id) {
      editMove(values);
      onClose();
      return;
    }
    let moveId = `move-${values.from}-${values.to}`;
    for (let el of elements) {
      if (el.id === moveId) {
        message.error("The movement already exists!");
        return;
      }
      if (values.from === values.to) {
        message.error("Target and source can't be same!");
        return;
      }
    }
    addMove(values);
    onClose();
  };
  return (
    <Form
      name="moveform"
      className="move-form"
      onFinish={onFinish}
      initialValues={{ ...moveData }}
    >
      <span className="form-label">Movement content*</span>
      <Form.Item
        name="content"
        rules={[
          {
            required: true,
            message: "Please input the content!",
          },
        ]}
      >
        <Input.TextArea rows={4} size="large" autoFocus={true} />
      </Form.Item>
      <span className="form-label">From*</span>
      <Form.Item
        name="from"
        rules={[
          {
            required: true,
            message: "Please select from value",
          },
        ]}
      >
        <Select size="large" disabled={!!moveData.from}>
          {companies.map((item) => {
            return (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <span className="form-label">To*</span>
      <Form.Item
        name="to"
        rules={[
          {
            required: true,
            message: "Please select to value",
          },
        ]}
      >
        <Select size="large" disabled={!!moveData.to}>
          {companies.map((item) => {
            return (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
      <div className="flex mt-5" style={{ justifyContent: "flex-end" }}>
        <Button type="ghost" htmlType="submit" className="black-btn">
          Submit
        </Button>
      </div>
    </Form>
  );
};

const Movestyle = {
  background: "#333333",
  color: "white",
  width: "auto",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const SideBar = ({
  elements,
  selectedElement,
  project,
  updateDiagrams,
  setState,
  companies,
}) => {
  const nodes = useStoreState((store) => store.nodes);
  const [moveData, setMoveData] = useState({});
  const [visible, setVisible] = useState(false);

  const onOpenAdd = () => {
    setMoveData({});
    setVisible(true);
  };

  const onOpenEdit = () => {
    if (!selectedElement.id.includes("move")) return;
    let ids = selectedElement.id.split("-");
    if (ids.length !== 3) return;
    setMoveData({
      id: selectedElement.id,
      content: selectedElement.data.label.props.children.props.children,
      from: ids[1],
      to: ids[2],
    });
    setVisible(true);
  };

  const onCloseModal = () => {
    setMoveData({});
    setVisible(false);
  };

  const bulkUpdateDiagrams = () => {
    let diagrams = [];
    for (let elem of elements) {
      if (elem.target) continue;
      const fnode = nodes.filter((item) => item.id === elem.id);
      if (fnode.length === 0) continue;
      diagrams.push({
        org_id: elem.id,
        content: elem.content || "",
        project: project._id,
        position_x: fnode[0].__rf.position.x.toFixed(2),
        position_y: fnode[0].__rf.position.y.toFixed(2),
      });
    }
    updateDiagrams(project._id, diagrams);
  };

  const setPositions = (els) => {
    let result = [];
    for (let el of els) {
      if (!el.target) {
        const fnode = nodes.filter((item) => item.id === el.id);
        if (fnode.length > 0) {
          el.position = {
            x: fnode[0].__rf.position.x.toFixed(2),
            y: fnode[0].__rf.position.y.toFixed(2),
          };
        }
      }
      result.push(el);
    }
    return result;
  };

  const addMove = async (moveData) => {
    setState({ loading: true });
    let moveId = `move-${moveData.from}-${moveData.to}`;
    elements.push({
      id: moveId,
      data: {
        label: (
          <div>
            <pre className="pre-code">{moveData.content}</pre>
          </div>
        ),
      },
      position: { x: 0, y: 0 },
      style: Movestyle,
      content: moveData.content,
    });
    elements.push({
      id: `line-${moveData.from}-${moveData.to}-1`,
      source: moveData.from,
      target: moveId,
      arrowHeadType: "arrow",
      type: "smoothstep",
    });
    elements.push({
      id: `line-${moveData.from}-${moveData.to}-2`,
      source: moveId,
      target: moveData.to,
      arrowHeadType: "arrow",
      type: "smoothstep",
    });
    await sleep(50);
    elements = setPositions(elements);
    setState({ elements, loading: false });
  };

  const deleteMove = async () => {
    setState({ loading: true });
    let targetId = selectedElement.id;
    targetId = targetId.replace("move-", "");
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i].id.includes(targetId)) {
        elements.splice(i, 1);
      }
    }
    await sleep(50);
    elements = setPositions(elements);
    setState({ elements, loading: false, selectedElement: null });
  };

  const editMove = async (moveData) => {
    setState({ loading: true });
    let targetId = selectedElement.id;
    for (let i = elements.length - 1; i >= 0; i--) {
      if (elements[i].id === targetId) {
        elements[i].data = {
          label: (
            <div>
              <pre className="pre-code">{moveData.content}</pre>
            </div>
          ),
        };
        elements[i].content = moveData.content;
      }
    }
    await sleep(50);
    elements = setPositions(elements);
    setState({ elements, loading: false });
  };

  return (
    <div className="updatesave__controls">
      {selectedElement && (
        <React.Fragment>
          <Tooltip title="Delete Movement" placement="left">
            <Popconfirm
              title="Are you sure delete this movement?"
              onConfirm={deleteMove}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
                size="large"
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Edit Movement" placement="left">
            <Button
              shape="circle"
              icon={<FormOutlined />}
              onClick={onOpenEdit}
              size="large"
            />
          </Tooltip>
        </React.Fragment>
      )}
      <Tooltip title="Add Movement" placement="left">
        <Button
          type="ghost"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={onOpenAdd}
          size="large"
        />
      </Tooltip>
      <Tooltip title="Save" placement="left">
        <Button
          type="primary"
          shape="circle"
          icon={<SaveOutlined />}
          onClick={bulkUpdateDiagrams}
          size="large"
        />
      </Tooltip>
      {visible && (
        <Modal
          title={`${moveData.id ? "Update" : "Create"} Movement`}
          visible={visible}
          width={600}
          footer={false}
          closable
          onCancel={onCloseModal}
        >
          <MoveForm
            addMove={addMove}
            editMove={editMove}
            moveData={moveData}
            companies={companies}
            elements={elements}
            onClose={onCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default SideBar;
