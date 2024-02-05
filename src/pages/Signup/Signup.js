import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FacebookOutlined } from "@mui/icons-material";
import { authenticationApiRequests } from "../../apiRequests";
import "./Signup.css";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigateTo = useNavigate();

    const signup = async (event) => {
        event.preventDefault();
        try {
            if (!email || !fullName || !userName || !password) {
                window.alert("Please provide the required details.");
                return;
            }
            const registrationDetails = {
                email,
                name: fullName,
                username: userName,
                password
            };
            const response = await authenticationApiRequests.register(registrationDetails);
            if (response.status === 201) {
                navigateTo("/");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="signup">
            <div className="signup--form">
                <div className="signup--form--about">
                    <h1 style={{ fontFamily: "Dancing Script", fontWeight: "700", fontSize: "3rem" }}>Instagram</h1>
                    <p style={{ color: "#333333" }}>Sign up to see photos and videos from your friends.</p>
                    {/* <button className="login_with_facebook"><i><FacebookOutlined /></i>Log in with Facebook</button> */}
                </div>
                {/* <div style={{ alignSelf: "center" }}>OR</div> */}
                <form onSubmit={signup}>
                    <div className="signup--form--details">
                        <input
                            className="entry"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Email"
                            required
                        />
                        <input
                            className="entry"
                            type="text"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
                            placeholder="Full Name"
                            required
                        />
                        <input
                            className="entry"
                            type="text"
                            value={userName}
                            onChange={(event) => setUserName(event.target.value)}
                            placeholder="User Name"
                            required
                        />
                        <input
                            className="entry"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password"
                            required
                        />
                        <button type="submit" className="signupButton">Sign Up</button>
                    </div>
                </form>
            </div>
            <div className="loginOption">
                <p>Have an account?<Link to={"/"} style={{ textDecoration: "none", color: "#8392FF" }}>Log in</Link></p>
            </div>
        </div>
    )
}

export default Signup;