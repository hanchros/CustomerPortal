import React from "react";
import Policy from "react-s3/lib/Policy";
import Signature from "react-s3/lib/Signature";
import { xAmzDate, dateYMD } from "react-s3/lib/Date";
import { Upload, Button } from "antd";
import { UploadOutlined, SyncOutlined } from "@ant-design/icons";

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET,
  region: process.env.REACT_APP_S3_REGION,
  accessKeyId: process.env.REACT_APP_ACCESSKEYID,
  secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
};

const uploadFile = async (file) => {
  const fd = new FormData();
  const key = `${config.dirName ? config.dirName + "/" : ""}${file.name}`;
  const url = `https://${config.bucketName}.s3.${config.region}.amazonaws.com/`;
  fd.append("key", key);
  fd.append("acl", "public-read");
  fd.append("Content-Type", file.type);
  fd.append("x-amz-meta-uuid", "14365123651274");
  fd.append("x-amz-server-side-encryption", "AES256");
  fd.append(
    "X-Amz-Credential",
    `${config.accessKeyId}/${dateYMD}/${config.region}/s3/aws4_request`
  );
  fd.append("X-Amz-Algorithm", "AWS4-HMAC-SHA256");
  fd.append("X-Amz-Date", xAmzDate);
  fd.append("x-amz-meta-tag", "");
  fd.append("Policy", Policy.getPolicy(config));
  fd.append(
    "X-Amz-Signature",
    Signature.getSignature(config, dateYMD, Policy.getPolicy(config))
  );
  fd.append("file", file);

  const params = {
    method: "post",
    headers: {
      fd,
    },
    body: fd,
  };

  const data = await fetch(url, params);
  if (!data.ok) return Promise.reject(data);
  return Promise.resolve({
    bucket: config.bucketName,
    key: `${config.dirName ? config.dirName + "/" : ""}${file.name}`,
    location: `${url}${config.dirName ? config.dirName + "/" : ""}${file.name}`,
    result: data,
  });
};

class UploadFiles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileList: props.files || [],
      loading: false,
    };
  }

  onUpload = async (info) => {
    const { fileList } = this.state;
    this.setState({ loading: true });
    const data = await uploadFile(info);
    const fl = [...fileList, data.location];
    this.setState({ loading: false, fileList: fl });
    this.props.setFiles(fl);
  };

  onRemove = (file) => {
    let fl = this.state.fileList;
    for (let i = fl.length - 1; i >= 0; i--) {
      if (file.url === fl[i]) {
        fl.splice(i, 1);
        break;
      }
    }
    this.setState({ fileList: fl });
    this.props.setFiles(fl);
  };

  render() {
    const { fileList, loading } = this.state;
    const files = fileList.map((f, i) => {
      return {
        uid: i,
        name: f.replace(/^.*[\\/]/, ""),
        status: "done",
        url: f,
      };
    });
    return (
      <Upload
        data={this.onUpload}
        multiple
        fileList={files}
        onRemove={this.onRemove}
        listType="picture"
      >
        <Button icon={loading ? <SyncOutlined spin /> : <UploadOutlined />}>
          Upload
        </Button>
      </Upload>
    );
  }
}

export default UploadFiles;
