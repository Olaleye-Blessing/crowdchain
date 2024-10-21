import { ChangeEvent, useState } from "react";
import { parseEther, parseUnits } from "viem";
import { useAccount, useConfig, useWriteContract } from "wagmi";
import { useForm } from "react-hook-form";
import { differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/utils/upload-image";
import { useCrowdchainInstance } from "@/hooks/use-crowdchain-instance";
import { ICampaignForm } from "../_interfaces/form";
import { validateMilestoneRules } from "../_utils/milestone-rules";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";

const oneDay = 1 * 24 * 60 * 60 * 1000;

export const useCreateCampaign = () => {
  const config = useConfig();
  const { address: accountAddress } = useAccount();
  const contractAddress = useCrowdchainAddress();
  const { writeContractAsync } = useWriteContract();
  const { crowdchainInstance } = useCrowdchainInstance();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>("second");

  const form = useForm<ICampaignForm>({
    defaultValues: {
      title: "",
      description: "",
      goal: 1,
      deadline: new Date(Date.now() + oneDay),
      refundDeadline: new Date(Date.now() + 6 * oneDay),
      milestones: [],
    },
  });
  const [coverImage, setCoverImage] = useState<File | null>(null);

  function handleChangeImage(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const file = files[0];

    const preview = URL.createObjectURL(file);

    setCoverImage(file);
    setPreview(preview);
  }

  const onSubmit = async (data: ICampaignForm) => {
    if (!accountAddress)
      return toast({
        title: "Connect your wallet",
        variant: "destructive",
      });

    if (!coverImage)
      return toast({
        title: "Add your campaign cover image",
        variant: "destructive",
      });

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const fullNow = new Date(now);

    if (!data.deadline)
      return form.setError("deadline", { message: "Provide deadline" });

    const _deadline = differenceInDays(data.deadline, fullNow);

    if (_deadline < 1)
      return form.setError("deadline", {
        message: "Deadline must be at least a day from now",
      });

    if (!data.refundDeadline)
      return form.setError("refundDeadline", {
        message: "Provide refund deadline",
      });

    const _refundDeadline = differenceInDays(
      data.refundDeadline,
      data.deadline,
    );

    if (_refundDeadline < 5)
      return form.setError("refundDeadline", {
        message: "Refund deadline must be at least 5 days from deadline",
      });

    const milestones = data.milestones;

    if (milestones.length > 0) {
      const rules = Object.values(
        validateMilestoneRules({
          milestones,
          goal: data.goal,
          deadline: data.deadline,
        }),
      );

      if (rules.some((rule) => !rule.valid))
        return toast({
          title: "Fix all milestones error",
          variant: "destructive",
        });
    }

    try {
      console.log("Uploading image....");
      const ifpsImg = await uploadImage(coverImage, crowdchainInstance());

      console.log("Called function...");

      await writeContractAsync({
        abi: wagmiAbi,
        address: contractAddress,
        functionName: "createCampaign",
        args: [
          data.title,
          data.description,
          ifpsImg.IpfsHash,
          milestones.map((milestone) => ({
            targetAmount: parseEther(`${milestone.targetAmount}`),
            deadline: parseUnits(
              String(differenceInDays(milestone.deadline!, fullNow)),
              0,
            ),
            description: milestone.description,
          })),
          parseEther(String(data.goal)),
          parseUnits(String(_deadline), 0),
          parseUnits(String(_refundDeadline), 0),
        ],
      });

      toast({ title: "Your campaign has been created" });

      form.reset();
      setCoverImage(null);
      setPreview(null);
    } catch (error) {
      console.log("__ ERROR ___");
      // TODO: Learn how to handle errors
      console.log(error);
      toast({ title: "There is an error creating your campaign" });
    }
  };

  return { form, coverImage, preview, handleChangeImage, onSubmit };
};
