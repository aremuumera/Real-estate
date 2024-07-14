
import React from 'react'
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { listData, singlePostData, userData } from '../../lib/dummydata';
import Slider from '../../components/slider/Slider';
import "./singlePage.scss";
import Map from '../../components/map/Map';
import apiRequest from '../../lib/apiRequest';
import { AuthContext } from '../../context/AuthContext';


const SinglePage = () => {
  // to load single pages 
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* second block */}
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
             {/* Utilities */}
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
                {/* <p>Rental is resposible</p> */}
              </div>
            </div>

            {/* Pet policy */}
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
                {/* <p>Pets is Allowed</p> */}
              </div>
            </div>

             {/* Income policy */}
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>

           {/* Size section*/}
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>

          {/* Nearby Places */}
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p >
                {post.postDetail.school 
                ? post.postDetail.school > 999
                  ? (post.postDetail.school / 1000).toFixed(1) + "km away"
                  : post.postDetail.school + "m away"
                : "No school available"}
                  {/* away */}
                </p>
                {/* <p>250m away</p> */}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>
                {post.postDetail.bus 
                ? post.postDetail.bus > 999
                  ? (post.postDetail.bus / 1000).toFixed(1) + "km away"
                  : post.postDetail.bus + "m away"
                : "No bus available"}
                </p>
                {/* <p>100m away</p> */}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>
                {post.postDetail.restaurant
                ? post.postDetail.restaurant> 999
                  ? (post.postDetail.restaurant/ 1000).toFixed(1) + "km away"
                  : post.postDetail.restaurant+ "m away"
                : "No restaurant available"}
                </p>
                {/* <p>200m away</p> */}
              </div>
            </div>
          </div>

           {/* Location section */}
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
        
          <div className="buttons">
            {/* chat section */}
            <button>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>

            {/* save section */}
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SinglePage
