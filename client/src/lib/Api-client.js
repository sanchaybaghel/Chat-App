import axios from "axios"
import { HOST } from "../utils/constants"
export const ApiClient=axios.create({
    baseURL:HOST,
})