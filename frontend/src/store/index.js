import {create} from "zustand";

const useStore = create((set)=> ({
    theme:localStorage.getItem("theme") ?? "light",
    user:JSON.parse(localStorage.getItem("user")) ?? null,

    setTheme:(theme) => set({theme}),
    setCredentials:(user) => set({user}),
    signOut:() => set({user:null})
}));

export default useStore;