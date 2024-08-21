import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import './Home.css'


function Home() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUpActive, setIsSignUpActive] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleSignIn() {
        if (!email || !password) {
            setError('Email and password both are required');
            return;
        }
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user);
                navigate("/private");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
                console.log({ errorCode, errorMessage });
            });
    }

    function handleSignUp() {
        if (!email || !password) {
            setError('Email and password both are required');
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredentials) => {
                const user = userCredentials.user;
                console.log(user);
                navigate("/private");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
                console.log({ errorCode, errorMessage });
            });
    }

    function handleMethodChange() {
        setIsSignUpActive(!isSignUpActive);
    }

    return (
        <div className="container">
        <form>
            {isSignUpActive && <legend>Sign Up</legend>}
            {!isSignUpActive && <legend>Sign In</legend>}
            <fieldset>
                <ul>
                    <li>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" value={email} onChange={handleEmailChange} />
                    </li>
                    <li>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" value={password} onChange={handlePasswordChange} />
                    </li>
                </ul>
                {error && <p id="error-message">{error}</p>}
                {isSignUpActive ? (
                    <button type="button" onClick={handleSignUp} className="btn signUp">Sign Up</button>
                ) : (
                    <button type="button" onClick={handleSignIn} className="btn signIn">Sign In</button>
                )}
            </fieldset>
            {isSignUpActive ? (
                <a onClick={handleMethodChange}>Already have an account? Sign In</a>
            ) : (
                <a onClick={handleMethodChange}>Don't have an account? Sign Up</a>
            )}
        </form>
        </div>
    );
}

export default Home;
