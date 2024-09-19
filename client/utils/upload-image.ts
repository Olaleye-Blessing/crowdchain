import { AxiosInstance } from "axios";
import { hanldeCrowdChainApiError } from "./handle-api-error";

// from Pinata
interface UploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
  imgBaseUrl?: string;
}

export const uploadImage = async (image: File, _axios: AxiosInstance) => {
  try {
    const formData = new FormData();
    formData.set("image", image);

    const { data } = await _axios.post<{ data: { image: UploadResponse } }>(
      "/image",
      formData,
    );

    return data.data.image;
  } catch (error) {
    throw new Error(hanldeCrowdChainApiError(error));
  }
};
