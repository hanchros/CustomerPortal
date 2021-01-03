import React from "react";
import { connect } from "react-redux";
import { Collapse, Button } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import {
  createComment,
  updateComment,
  listComment,
  likeComment,
  deleteComment,
} from "../../actions/comment";
import CommentBody from "./comment_body";
import Editor from "./comment_editor";

const { Panel } = Collapse;

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showEditor: false,
      curComment: {},
    };
  }

  refreshComment = async () => {
    await this.props.listComment(this.props.projectId);
  };

  onCreateComment = () => {
    this.setState({ showEditor: true, curComment: {} });
  };

  onUpdateComment = (comment) => {
    if (comment.participant._id !== this.props.user._id) return;
    this.setState({ showEditor: true, curComment: comment });
  };

  hideEditor = () => {
    this.setState({ showEditor: false });
  };

  createComment = async (projectId, content, parent) => {
    await this.props.createComment(projectId, content, parent);
    await this.refreshComment();
    this.setState({ showEditor: false });
  };

  updateComment = async (commentId, content) => {
    await this.props.updateComment(commentId, content);
    await this.refreshComment();
    this.setState({ showEditor: false });
  };

  deleteComment = async (comment) => {
    const { user, deleteComment } = this.props;
    if (comment.participant._id !== user._id) return;
    await deleteComment(comment._id);
    await this.refreshComment();
  };

  likeComment = async (comment, like) => {
    if (comment.participant._id === this.props.user._id) return;
    await this.props.likeComment(comment._id, like);
    await this.refreshComment();
  };

  replyComment = (parentId) => {
    const comment = { parent: parentId };
    this.setState({ showEditor: true, curComment: comment });
  };

  showComment = (comment) => (
    <CommentBody
      key={comment._id}
      comment={comment}
      onUpdateComment={this.onUpdateComment}
      onDeleteComment={this.deleteComment}
      likeComment={this.likeComment}
      replyComment={this.replyComment}
      userId={this.props.user._id}
    >
      {comment.children.map((cm) => this.showComment(cm))}
    </CommentBody>
  );

  renderCommentList = () => {
    const { comments } = this.props.project;
    var indexed_nodes = {},
      tree_roots = [];
    for (var i = 0; i < comments.length; i++) {
      indexed_nodes[comments[i]._id] = comments[i];
      indexed_nodes[comments[i]._id].children = [];
    }
    for (i = 0; i < comments.length; i += 1) {
      var parent_id = comments[i].parent;
      if (!parent_id) {
        tree_roots.push(comments[i]);
      } else if (indexed_nodes[parent_id]) {
        indexed_nodes[parent_id].children.push(comments[i]);
      }
    }
    return (
      <React.Fragment>
        {tree_roots.map((comment) => this.showComment(comment))}
      </React.Fragment>
    );
  };

  render() {
    const { showEditor, curComment } = this.state;
    const { comments } = this.props.project;

    return (
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
        className="comment mt-5"
      >
        <Panel header={`Comments(${comments.length})`}>
          {this.renderCommentList()}
          {showEditor && (
            <Editor
              createComment={this.createComment}
              updateComment={this.updateComment}
              hideEditor={this.hideEditor}
              projectId={this.props.projectId}
              comment={curComment}
            />
          )}
          {!showEditor && (
            <Button
              type="primary"
              className="mt-3"
              onClick={this.onCreateComment}
            >
              Add Comment
            </Button>
          )}
        </Panel>
      </Collapse>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.profile,
    auth: state.auth,
    project: state.project,
  };
};

export default connect(mapStateToProps, {
  createComment,
  updateComment,
  listComment,
  likeComment,
  deleteComment,
})(Comments);
