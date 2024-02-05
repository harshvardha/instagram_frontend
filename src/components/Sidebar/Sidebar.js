import { useContext, useState } from "react";
import {
    LogoutOutlined,
    HomeOutlined,
    Search,
    ExploreOutlined,
    MenuOutlined
} from "@mui/icons-material";
import profilePic from "../../images/profile_pic.jpg";
import SearchComponent from "../Search/Search";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { UserContext } from "../../context/UserContext";

const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const { username, userProfilePic } = useContext(UserContext);
    const navigateTo = useNavigate();

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accountOwnerId");
        navigateTo("/");
    }

    return (
        <div className="sidebar">
            <div className="sidebar--logo">
                <LogoutOutlined onClick={logout} />
            </div>
            <div className="sidebar--options">
                <Link to={"/Timeline"} style={{ textDecoration: "none", color: "black" }} onClick={() => setOpen(false)}><HomeOutlined /></Link>
                <Search onClick={() => setOpen(prev => !prev)} />
                {open && <SearchComponent setOpen={setOpen} />}
                <ExploreOutlined />
                <Link to={`/profile/${username}`} onClick={() => setOpen(false)}><img src={userProfilePic} className="sidebar--profilePic" /></Link>
            </div>
            <div className="sidebar--menuButton">
                <MenuOutlined />
            </div>
        </div>
    )
}

export default Sidebar;