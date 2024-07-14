import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";

function HomePage() {

  const {currentUser} = useContext(AuthContext)
  console.log(currentUser)
  return (
    <div className="homePage ">
      <div className="textContainer">
        <div className="wrapper ">
        <h1 className="title pt-[10px]">Discover Your Dream Home with Us</h1>
        <p className="wrappertext">
          Welcome to your gateway to exceptional real estate opportunities! Whether you're looking for a cozy starter home, a luxurious estate, or an investment property, we have the perfect match for you.  
        </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="imgContainer">
        <img src="/real1.jpg" alt="" />
      </div> */}
    </div>
  );
}

export default HomePage;
