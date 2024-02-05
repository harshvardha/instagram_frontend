import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { FacebookOutlined } from "@mui/icons-material";
import { authenticationApiRequests } from "../../apiRequests";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { setUsername, setUserProfilePic } = useContext(UserContext);
    const navigateTo = useNavigate();

    const submitLogin = async (event) => {
        event.preventDefault();
        try {
            if (!email || !password) {
                window.alert("Please provide login credentials.");
                return;
            }
            const loginDetails = {
                email,
                password
            }
            const response = await authenticationApiRequests.login(loginDetails);
            if (response.status === 200) {
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("accountOwnerId", response.data.id);
                setUsername(response.data.username);
                setUserProfilePic(response.data.profilePicUrl);
                navigateTo(`/profile/${response.data.username}`);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="login">
            <div className="login--form">
                <h1 style={{ fontFamily: "Dancing Script", fontWeight: "700", fontSize: "3rem", paddingTop: "2rem", paddingBottom: "2rem" }}>Instagram</h1>
                <form onSubmit={submitLogin}>
                    <div className="login--form--details">
                        <input
                            className="entry"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="email"
                            required
                        />
                        <input
                            className="entry"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="password"
                            required
                        />
                        <button type="submit" className="loginButton">Log in</button>
                    </div>
                </form>
                <div style={{ alignSelf: "center" }}>OR</div>
                <div className="login--alternateOptions">
                    <p><FacebookOutlined style={{ verticalAlign: "middle" }} /> Log in with Facebook</p>
                    <Link to={"/"} style={{ textDecoration: "none", color: "#8392FF" }}>Forget password?</Link>
                </div>
            </div>
            <div className="signup-option">
                <p>Don't have an account? <Link to={"/signup"} style={{ textDecoration: "none", color: "#8392FF" }}>Sign up</Link></p>
            </div>
        </div>
    )
}

export default Login;