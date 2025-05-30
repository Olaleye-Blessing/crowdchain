import { ChangeEvent, useRef, useState } from "react";
import { parseUnits } from "viem";
import { useChainId, useChains, useConfig, useWriteContract } from "wagmi";
import { useForm } from "react-hook-form";
import { differenceInDays } from "date-fns";
import { ToasterToast, useToast } from "@/hooks/use-toast";
import { uploadImage } from "@/utils/upload-image";
import { useCrowdchainInstance } from "@/hooks/use-crowdchain-instance";
import { ICampaignForm } from "../_interfaces/form";
import { validateMilestoneRules } from "../_utils/milestone-rules";
import { wagmiAbi } from "@/lib/contracts/crowd-chain/abi";
import { useCrowdchainAddress } from "@/hooks/use-crowdchain-address";
import { waitForTransactionReceipt } from "@wagmi/core";
import { clientEnv } from "@/constants/env/client";
import { CROWDCHAIN_DECIMAL_PRECISION } from "@/constants/contracts";
import { getCreateErrMsg } from "../_utils/error-msg";
import { useAccountCheck } from "@/hooks/use-account-check";
import { pickRandomArrItem } from "@/utils/pick-random-arr-item";
import {
  sampleCampaignsWithMilestones,
  sampleCampaignsWithoutMilestones,
} from "../_utils/sample";
import { MDXEditorMethods } from "@mdxeditor/editor";

const oneDay = 1 * 24 * 60 * 60 * 1000;
const totalSample =
  sampleCampaignsWithMilestones.length +
  sampleCampaignsWithoutMilestones.length;

export const useCreateCampaign = () => {
  const mdxRef = useRef<MDXEditorMethods>(null);
  const { isAccountAndCorrectNetwork } = useAccountCheck();
  const chains = useChains();
  const chainId = useChainId();
  const config = useConfig();
  const contractAddress = useCrowdchainAddress();
  const { writeContractAsync } = useWriteContract();
  const { crowdchainInstance } = useCrowdchainInstance();
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>("second");

  const form = useForm<ICampaignForm>({
    defaultValues: {
      title: "",
      summary: "",
      description: "# Provide a detailed description of your campaign",
      goal: 1,
      deadline: new Date(Date.now() + oneDay),
      refundDeadline: new Date(Date.now() + 6 * oneDay),
      milestones: [],
      coverImage: null,
      categories: [],
    },
  });

  function onChangeCategory(category: string, checked: boolean) {
    let categories = [...(form.getValues("categories") || [])];

    if (checked && categories.length === 4)
      return form.setError("categories", {
        message: "Maximum of 4 categories",
      });

    if (checked) {
      categories.push(category);
    } else {
      categories = categories.filter((cat) => cat !== category);
    }

    form.setValue("categories", categories);

    if (categories.length > 0 && categories.length <= 4)
      form.clearErrors("categories");
  }

  function handleChangeImage(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    const file = files[0];

    const oneMb = 1024 * 1024;

    if (file.size > oneMb)
      return form.setError("coverImage", { message: "File is too large" });

    form.clearErrors("coverImage");

    const preview = URL.createObjectURL(file);

    form.setValue("coverImage", file);
    setPreview(preview);
  }

  const loadSample = (type: "with" | "without" | "random") => {
    let options: ICampaignForm[] = [];

    if (type === "with") {
      options = [...sampleCampaignsWithMilestones];
    } else if (type === "without") {
      options = [...sampleCampaignsWithoutMilestones];
    } else {
      options = [
        ...sampleCampaignsWithMilestones,
        ...sampleCampaignsWithoutMilestones,
      ];
    }

    const cam = pickRandomArrItem(options);

    form.reset(cam);
    mdxRef.current?.setMarkdown(cam.description);
  };

  const onSubmit = async (data: ICampaignForm) => {
    if (!data.coverImage)
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

    if (!(await isAccountAndCorrectNetwork())) return;

    let txToast: {
      id: string;
      dismiss: () => void;
      update: (props: ToasterToast) => void;
    } | null = null;

    try {
      txToast = toast({
        title: "Uploading image",
        duration: 100 * 1 * 60 * 60 * 1000, // 100 mins
      });

      const ifpsImg = await uploadImage(data.coverImage, crowdchainInstance());

      txToast.update({ title: "Creating campaign..", id: txToast.id });

      const txHash = await writeContractAsync({
        abi: wagmiAbi,
        address: contractAddress,
        functionName: "createCampaign",
        args: [
          data.title,
          data.summary,
          data.description,
          ifpsImg,
          milestones.map((milestone) => ({
            targetAmount: parseUnits(
              `${milestone.targetAmount}`,
              CROWDCHAIN_DECIMAL_PRECISION,
            ),
            deadline: parseUnits(
              String(differenceInDays(milestone.deadline!, fullNow)),
              0,
            ),
            description: milestone.description,
          })),
          data.categories,
          parseUnits(String(data.goal), CROWDCHAIN_DECIMAL_PRECISION),
          parseUnits(String(_deadline), 0),
          parseUnits(String(_refundDeadline), 0),
        ],
      });

      const chainExplorer =
        chainId === clientEnv.NEXT_PUBLIC_ANVIL_CHAIN_ID
          ? undefined
          : chains.find((ch) => ch.id === chainId)?.blockExplorers?.default.url;

      const txHashLink = `${chainExplorer}/tx/${txHash}`;

      txToast.update({
        id: txToast.id,
        title: "Confirming hash(pending)",
        description: chainExplorer && (
          <a
            href={txHashLink}
            target="_blank"
            className="break-all text-primary underline"
          >
            {txHashLink}
          </a>
        ),
      });

      await waitForTransactionReceipt(config, {
        hash: txHash,
        confirmations: 1,
      });

      txToast.update({
        id: txToast.id,
        title: "Your campaign has been created",
      });

      form.reset();
      setPreview(null);
    } catch (error) {
      txToast!.update({
        id: txToast!.id,
        title: getCreateErrMsg(error),
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        txToast?.dismiss();
      }, 3_000);
    }
  };

  return {
    totalSample,
    mdxRef,
    form,
    preview,
    onChangeCategory,
    handleChangeImage,
    onSubmit,
    loadSample,
  };
};
