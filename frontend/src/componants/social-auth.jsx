import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import {auth} from "../libs/firebaseConfig.js";
import {useAuthState} from "react-firebase-hooks/auth";
import {useEffect, useState} from "react";
import useStore from "../store/index.js";
import {useNavigate} from "react-router-dom";
import api from "../libs/apiCall.js";
import {toast} from "sonner";
import {Button} from "./button.js";
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";

export const SocialAuth = ({isLoading, setIsLoading}) => {
    const [user] = useAuthState(auth);
    const [selectProvider, setSelectProvider] = useState("google")
    const {setCredentials} = useStore((state) => state);
    const navigate = useNavigate();

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        setSelectProvider("google")
        try {
            const res = await signInWithPopup(auth, provider);
            console.log(res);
        } catch (e) {
            console.error("Error signing in with Google", e);
        }
    }

    const signInWithGithub = async () => {
        const provider = new GithubAuthProvider();
        setSelectProvider("github")
        try {
            const res = await signInWithPopup(auth, provider);
            console.log(res);

        } catch (e) {
            console.error("Error signing in with Github", e);
        }
    }
    useEffect(() => {
        const saveDataToBD = async () => {
            try {
                const userData = {
                    name: user.displayName,
                    email: user.email,
                    uid: user.uid,
                    provider: selectProvider,
                }
                setIsLoading(true);
                const {data: res} = api.post('/auth/sign-in', userData);
                console.log(res);

                if (res?.user) {
                    toast.success(res?.message);
                    const userInfo = {...res?.user, token: res?.token}
                    localStorage.setItem("user", JSON.stringify(userInfo));
                    setCredentials(userInfo);
                    setTimeout(() => {
                        navigate("/overview");
                    }, 1500);
                }

            } catch (e) {
                console.error("Error saving user data to backend", e);
                toast.error(e ?.response?.data?.message || e.message);
            } finally {
                setIsLoading(false);
            }
        }
        if (user) {
            saveDataToBD();
        }
    }, [user?.uid]);
    return (
        <div className='flex items-center gap-2'>
            <Button onClick={signInWithGoogle}
                    disabled={isLoading}
                    variant="outline"
                    className='w-full test-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400'
                    type='button'>
                <FcGoogle className="mr-2 size-5"/>
            </Button>

            <Button onClick={signInWithGithub}
                    disabled={isLoading}
                    variant="outline"
                    className='w-full test-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400'
                    type='button'>
                <FaGithub className="mr-2 size-5"/>
            </Button>

        </div>
    );
}

