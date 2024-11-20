import { AxiosInstance, isAxiosError } from "axios";

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
      "/ipfs/image",
      formData,
    );

    return data.data.image;
  } catch (error) {
    let msg = "";

    if (isAxiosError(error)) {
      const data = error.response?.data;
      msg = data.err?.message || data.message;
    } else {
      msg = "Unknown error! Try again later";
    }

    throw new Error(msg);
  }
};
