import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import axios from "axios";
import { axiosConfig } from "../utils/cookie";
import { ILotto } from "../models/Lotto";

export interface ILottoDoc extends ILotto {
    id: string
}

export function Home() {
    let sendRequest = false
    const { isUser } = useContext(AuthContext)
    const [lotto, setLotto] = useState<ILottoDoc[] | null>(null)

    useEffect(() => {
        if (!sendRequest) {
            axios.get(import.meta.env.VITE_OPS_URL + "/get/lotto/all", axiosConfig)
                .then((response) => {
                    setLotto(response.data)
                })
                .catch(() => {
                    setLotto(null)
                })
            sendRequest = true
        }
    }, [])
    return (
        <>{
            isUser &&
            <div id="home" className="flex flex-row">
                {
                    lotto ? lotto.map((lotto, index) => (
                        <div key={index} className="p-2 xl:basis-1/5 lg:basis-1/4 basis-1/3">
                            <Link to={`/bill/${lotto.id}`} className="flex flex-col items-center text-white bg-green-600 rounded-none shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <div className="flex flex-row items-center p-2 w-full">
                                    <img className="object-cover w-auto h-96 h-auto rounded-none" src={`../../public/${lotto.img_flag}`} alt={lotto.name} />
                                    <div className="flex text-end w-full flex-col justify-between leading-normal">
                                        <h5 className="text-sm font-bold tracking-tight dark:text-white">{lotto.name}
                                            <br />
                                            {String(lotto.open)}</h5>
                                    </div>
                                </div>

                                <hr className="w-full" />
                                <div className="w-full text-xs px-2">
                                    <p className="flex justify-between w-full">
                                        <span className="font-light">เวลาปิด</span>
                                        <span className="font-light">{String(lotto.close)}</span>
                                    </p>
                                    <p className="flex justify-between w-full">
                                        <span className="font-light">สถานะ</span>
                                        <span className="font-light">ปิดรับใน 00:46:25</span>
                                    </p>
                                </div>
                            </Link>
                        </div>

                    )) : "กำลังโหลด"
                }
            </div>
        }
        </>
    )
}

