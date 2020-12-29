import React from "react";
import {
  LikeOutlined,
  LinkedinOutlined,
  FacebookFilled,
  TwitterOutlined,
  UserOutlined,
} from "@ant-design/icons";
import FeaturedImg from "../../assets/img/featured.png";

const SocialLinks = (props) => (
  <span>
    {props.linkedin && <LinkedinOutlined />}
    {props.facebook && <FacebookFilled />}
    {props.twitter && <TwitterOutlined />}
    {props.web && <UserOutlined />}
  </span>
);

const CustomCard = (props) => {
  if (!props.columns || props.columns === 4)
    return (
      <div className="custom-card mt-4">
        {props.logo && <img src={props.logo} alt="logo" />}
        {props.featured && (
          <img src={FeaturedImg} alt="" className="featured-img" />
        )}
        <h5>{props.title}</h5>
        <p>{props.description}</p>
        <SocialLinks {...props} />
        <p className="custom-card-footer">{props.status}</p>
        {props.likes > 0 && (
          <p className="custom-card-like">
            <LikeOutlined /> <span>{props.likes}</span>
          </p>
        )}
      </div>
    );
  return (
    <div className="wide-card mt-4">
      <div className="flex">
        <div className="wide-card-img">
          {props.logo && <img src={props.logo} alt="" />}
        </div>
        {props.featured && (
          <img src={FeaturedImg} alt="" className="featured-img" />
        )}
        <div className="wide-card-desc">
          <h4>
            <b>{props.title}</b>
          </h4>
          <p>{props.description}</p>
          <SocialLinks {...props} />
        </div>
      </div>
      <p className="custom-card-footer">{props.status}</p>
      {props.likes > 0 && (
        <p className="custom-card-like">
          <LikeOutlined /> <span>{props.likes}</span>
        </p>
      )}
    </div>
  );
};

export default CustomCard;
