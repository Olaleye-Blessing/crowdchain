/* eslint-disable @next/next/no-img-element */
"use client";

import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import CurlySvg from "./curly-svg";
import {
  containerVariants,
  curlySvgVariants,
  itemVariants,
} from "./motion-utils";

export default function Header() {
  return (
    <motion.header
      initial="hidden"
      animate="visible"
      className="relative bg-white px-4 mt-8 py-12 md:py-16 md:mt-2"
    >
      <motion.div
        variants={curlySvgVariants}
        className="absolute top-0 left-0 md:left-14 md:top-8"
      >
        <CurlySvg />
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="layout relative pt-8 max-w-[80rem] md:flex md:items-center md:justify-between md:pt-2 md:max-w-[75rem]"
      >
        <motion.div variants={itemVariants} className="max-w-[33rem]">
          <motion.h1 variants={itemVariants}>Welcome to ČrôwdChǎin</motion.h1>

          <motion.p variants={itemVariants} className="mb-8">
            Empowering innovation through blockchain-based crowdfunding. Launch
            your ideas, support groundbreaking projects or ask for help with
            transparency and security.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link
              href="/create"
              className={buttonVariants({
                className: "mt-8",
                variant: "default",
              })}
            >
              Start a Campaign
            </Link>
          </motion.div>
        </motion.div>

        <motion.figure
          variants={itemVariants}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center w-full mx-auto mt-8 md:max-w-max"
        >
          <img
            src="/assets/home/header_bg.jpg"
            alt=""
            className="max-w-80 md:max-w-96"
          />
        </motion.figure>
      </motion.div>

      <motion.div
        variants={curlySvgVariants}
        className="absolute -bottom-8 right-0 md:right-8"
      >
        <CurlySvg />
      </motion.div>
    </motion.header>
  );
}
