import { toast } from "@/hooks/use-toast";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard." });
  } catch (err) {
    toast({ title: "Failed to copy.", variant: "destructive" });
  }
};
