import { useMutation } from "@tanstack/react-query";
import {login} from "./axios.js"


export const useLogin = () => {
    return useMutation({
        mutationFn: login
    })
}

