import { toast } from "@/hooks/use-toast";

export const shareLink = async (data: ShareData) => {
  try {
    await navigator.share(data);
  } catch (err) {
    toast({ title: "Unable to share link", variant: "destructive" });
  }
};
