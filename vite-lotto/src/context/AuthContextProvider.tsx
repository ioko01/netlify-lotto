import React, {
    ReactNode,
    useState,
    useContext,
    createContext,
} from 'react'
import axios from 'axios'
import { axiosConfig } from '../utils/cookie'
import { IUser } from '../models/User'
import { getCookies, removeCookie } from 'typescript-cookie'

export interface AuthProviderProps {
    children?: ReactNode
}

export interface UserContextState {
    isUser: IUser
    status: LOGIN_STATE
    id?: string
}

type LOGIN_STATE = "LOADING" | "NULL" | "ERROR" | "SUCCESS" | "NETWORK_ERROR" | "LOGOUT";

export const UserStateContext = createContext<UserContextState>(
    {} as UserContextState,
)
export interface AuthContextModel {
    isUser: IUser | null
    status: LOGIN_STATE
    setAuthUser: (data: IUser | null) => void,
    setPageStatus: (status: LOGIN_STATE) => void
}

export const AuthContext = React.createContext<AuthContextModel>(
    {} as AuthContextModel,
)

export function useAuth(): AuthContextModel {
    return useContext(AuthContext)
}

let sendRequest = false
export const AuthContextProvider = ({ children }: AuthProviderProps): JSX.Element => {

    const [isUser, setIsUser] = useState<IUser | null>(null)
    const [status, setStatus] = useState<LOGIN_STATE>("LOADING");

    const cookie = getCookies()
    if (cookie.jwt) {
        if (!isUser) {
            if (status !== "LOGOUT") {
                if (!sendRequest) {
                    axios.get(import.meta.env.VITE_OPS_URL + "/me", axiosConfig)
                        .then((res) => {
                            setIsUser(res.data)
                            setAuthUser(res.data)
                            setStatus("SUCCESS")
                            sendRequest = true
                        })
                        .catch((err) => {
                            setStatus("LOGOUT")
                            setIsUser(null)
                            setAuthUser(null)
                            sendRequest = true
                        })
                }

            }
        } else if (status !== "SUCCESS") {
            setStatus("SUCCESS")
        }
    } else if (status !== "LOGOUT") {
        setStatus("LOGOUT")
    }

    const setAuthUser = (data: IUser | null) => {
        setIsUser(data)
        if (data) setStatus("SUCCESS")
        else setStatus("LOGOUT")
    };

    const setPageStatus = (status: LOGIN_STATE) => {
        setStatus(status)
    }

    const values = {
        status,
        isUser,
        setAuthUser,
        setPageStatus
    }

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export const useUserContext = (): UserContextState => {
    return useContext(UserStateContext)
}