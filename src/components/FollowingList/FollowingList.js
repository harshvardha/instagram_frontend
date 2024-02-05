import "./FollowingList.css";
import image from "../../images/profile_pic.jpg";

const FollowingList = () => {
    return (
        <div className="followingList">
            <ul className="followingList--list">
                <li className="followingAccount">
                    <img id="followingAccountProfilePic" src={image} alt="" />
                    <p>following 1</p>
                </li>
                <li className="followingAccount">
                    <img id="followingAccountProfilePic" src={image} alt="" />
                    <p>following 2</p>
                </li>
                <li className="followingAccount">
                    <img id="followingAccountProfilePic" src={image} alt="" />
                    <p>following 3</p>
                </li>
                <li className="followingAccount">
                    <img id="followingAccountProfilePic" src={image} alt="" />
                    <p>following 4</p>
                </li>
                <li className="followingAccount">
                    <img id="followingAccountProfilePic" src={image} alt="" />
                    <p>following 5</p>
                </li>
                <li className="followingAccount">
                    <img id="followingAccountProfilePic" src={image} alt="" />
                    <p>following 6</p>
                </li>
                <li className="followingAccount">
                    <img id="followingAccountProfilePic" src={image} alt="" />
                    <p>following 7</p>
                </li>
            </ul>
        </div>
    )
}

export default FollowingList;