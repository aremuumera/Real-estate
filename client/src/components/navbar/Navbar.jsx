import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false); 
  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if(currentUser) 
    fetch();

  return (
    <nav className="z-[1000000]">
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>YikesEstate</span>
        </a>
        <a href="/">Home</a>
        <a href="/listitem">  Marketplace</a>
        <a href="/">Contact</a>
        <a href="/">Agents</a>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            {/* <Link to='/profile/update'> */}
                <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            {/* </Link> */}
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login">Sign in</a>
            <a href="/register" className="register">
              Sign up
            </a>
          </>
        )}
        <div className="menuIcon ">
          <img
           src={isOpen ? "/x1.jpg" : "/menu.png"}
            alt=""
            onClick={() => setIsOpen((prev ) => !prev)}
            className="w-[20px] h-[10px]"
          />
        </div>
        <div className={`pt-[50px] ${isOpen ? "menu active" : "menu"}` }>
          <a href="/">Home</a>
          <a href="/listitem">  Marketplace</a>
          {/* <a href="/">Contact</a> */}
          {/* <a href="/">Agents</a> */}
          <a href="/login">Sign in</a>
          <a href="/register">Sign up</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
