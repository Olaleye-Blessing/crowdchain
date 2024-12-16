"use client";

import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import TotalCampaigns from "./total-campaigns";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function Ready() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="!bg-[#e9fbe9]"
    >
      <div className="layout">
        <motion.header
          variants={containerVariants}
          className="text-center mb-8"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold">
            Ready to Make a Difference?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-sm text-center text-gray-500 -mt-1"
          >
            Join our community of changemakers and support projects that matter.
          </motion.p>
        </motion.header>

        <motion.div
          variants={containerVariants}
          className="flex items-center justify-center"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/create"
              className={buttonVariants({ className: "mr-4" })}
            >
              Launch a Campaign
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/campaigns"
              className={buttonVariants({
                variant: "secondary",
                className: "mr-4",
              })}
            >
              Explore
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <TotalCampaigns />
        </motion.div>
      </div>
    </motion.section>
  );
}
