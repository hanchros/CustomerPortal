import React from "react";
import ProjectAvatar from "../../assets/icon/challenge.png";
import { LikeOutlined } from "@ant-design/icons";

const ChallengeCard = (props) => {
  const { item } = props;
  return (
    <div className="custom-card">
      <img src={item.logo || ProjectAvatar} alt="logo" height={40} />
      <h5>{item.challenge_name}</h5>
      <p>{item.short_description}</p>
      <p className="custom-card-footer">{item.projects || 0} project</p>
      {item.likes && item.likes.length > 0 && (
        <p className="custom-card-like">
          <LikeOutlined /> <span>{item.likes.length}</span>
        </p>
      )}
    </div>
  );
};

export default ChallengeCard;
