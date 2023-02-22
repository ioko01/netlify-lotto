import { useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosConfig } from "../utils/cookie";
import { setCookie } from "typescript-cookie";
import { IUser } from "../models/User";

function Login() {
    const { setAuthUser, status } = useContext(AuthContext);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate()
    const isLoading = document.getElementById("loading")
    let sendRequest = false

    const isLogin = async () => {
        try {
            isLoading!.removeAttribute("style")
            if (status === "LOGOUT") {
                if (!sendRequest) {
                    await axios.post(import.meta.env.VITE_OPS_URL + "/auth/login",
                        { username: usernameRef.current!.value, password: passwordRef.current!.value }, axiosConfig)
                        .then((res) => {
                            if (res.data) {
                                setAuthUser(res.data)
                                navigate("/")
                            } else {
                                console.log(res)
                            }
                        })
                        .catch(() => {
                            setAuthUser(null)
                            navigate("/")
                        })
                    sendRequest = true
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <form className="mt-4" id="formSignup">
                <input ref={usernameRef} type={"text"} id="username" name="username" className="block h-8 py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Username" />
                <input ref={passwordRef} type={"password"} id="password" name="password" className="block h-8 py-2 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Password" />
                <button type={"button"} onClick={isLogin}>Add</button>
            </form>
        </>
    );
}

export default Login;