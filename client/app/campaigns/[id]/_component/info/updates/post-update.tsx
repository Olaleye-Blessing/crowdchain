import Loading from "@/app/loading";
import { MDXEditor } from "@/components/markdown/editor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { toast, ToasterToast } from "@/hooks/use-toast";
import { IUpdate } from "@/interfaces/update";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { waitForTransactionReceipt } from "@wagmi/core";
import { Controller, useForm } from "react-hook-form";
import { useAccount, useConfig, useWriteContract } from "wagmi";

type IUpdateForm = Pick<IUpdate, "title" | "content">;

interface PostUpdatesProps {
  className?: string;
  campaignId: number;
}

export default function PostUpdates({
  campaignId,
  className,
}: PostUpdatesProps) {
  const config = useConfig();
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const contractAddress = useCrowdchainAddress();
  const form = useForm<IUpdateForm>({
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const {
    control,
    formState: { errors, isSubmitting },
  } = form;

  const onPostUpdate = async (data: IUpdateForm) => {
    if (!address)
      return toast({ title: "Connect your wallet", variant: "destructive" });

    let txToast: {
      id: string;
      dismiss: () => void;
      update: (props: ToasterToast) => void;
    } | null = null;

    try {
      txToast = toast({
        title: "Sending update...",
      });

      const txHash = await writeContractAsync({
        abi: wagmiAbi,
        address: contractAddress,
        functionName: "postUpdate",
        args: [BigInt(campaignId), data.title, data.content],
      });

      await waitForTransactionReceipt(config, {
        hash: txHash,
        confirmations: 1,
      });

      txToast.update({
        id: txToast.id,
        title: "Your update has been posted.",
      });

      form.reset();
    } catch (error) {
      console.log("__ ERROR __", error);
      txToast!.update({
        id: txToast!.id,
        title:
          (error as Error).message || "There is an error posting your update.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        txToast?.dismiss();
      }, 3_000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className}>Post an update</Button>
      </DialogTrigger>
      <DialogContent className="gap-2 max-w-xl">
        <DialogHeader className="items-start text-left border-b border-border pb-2">
          <DialogTitle>Post an Update</DialogTitle>
          <DialogDescription>
            Update your donors about the progress of this campaign.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onPostUpdate)}
          className="w-full flex flex-col space-y-2"
        >
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              {...form.register("title", {
                required: true,
                minLength: {
                  value: 10,
                  message: "Provide at least 10 characters",
                },
              })}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Controller
              name="content"
              rules={{
                required: true,
                minLength: {
                  value: 10,
                  message: "Provide at least 10 characters",
                },
              }}
              control={control}
              render={({ field }) => (
                <MDXEditor
                  className="min-h-64"
                  markdown={field.value}
                  onChange={(markdown) => {
                    field.onChange(markdown);
                  }}
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>
          <div>
            <Button className="" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loading /> : "Post Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
