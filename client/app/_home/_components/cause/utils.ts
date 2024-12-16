import Elevate from "./icons/elevate";
import EarnRewards from "./icons/rewards";
import Change from "./icons/change";
import CcToken from "./svgs/cc-token";
import Boost from "./svgs/boost";
import World from "./svgs/world";

export const causes = [
  {
    icon: EarnRewards,
    title: "Earn Rewards",
    subTitle: "The first step to empowering donors on Crowdchain.",
    body: "Donate to different campaigns and get CC - a token that grants you access to different features and opportunities to earn additional rewards in the future.",
    Svg: CcToken,
  },
  {
    icon: Elevate,
    title: "Elevate Campaigns",
    subTitle: "An impactful game connecting donors and campaigns.",
    body: "Boost different campaigns to reach their funding goal as soon as possible. This helps creators and other donors to enjoy different future opportunities.",
    Svg: Boost,
  },
  {
    icon: Change,
    title: "Enable Change",
    subTitle:
      "An evolution in supporting donations to charity with community fundraising.",
    body: "Your crypto donations, and participation in the Crowdchain, enables us to build a new future where real world impact projects benefit from their own community-driven regenerative crypto economies.",
    Svg: World,
  },
];

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const svgVariants = {
  hidden: {
    opacity: 0,
    rotate: -10,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: "easeInOut",
    },
  },
};
