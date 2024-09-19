import axios from "axios";
import { clientEnv } from "@/constants/env/client";

export const useCrowdchainInstance = () => {
  const crowdchainInstance = () => {
    let instance = axios.create({
      baseURL: `${clientEnv.NEXT_PUBLIC_BACKEND_URL}/api/v1`,
      withCredentials: true,
    });

    return instance;
  };

  return { crowdchainInstance };
};
