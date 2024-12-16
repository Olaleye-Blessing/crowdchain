"use client";
import { causes, containerVariants, itemVariants, svgVariants } from "./utils";
import { motion } from "motion/react";



export default function Cause() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="layout">
        <motion.ul
          variants={containerVariants}
          className="lg:max-w-[60rem] lg:mx-auto"
        >
          {causes.map((cause) => {
            return (
              <motion.li
                key={cause.title}
                variants={itemVariants}
                className="mb-28 lg:mb-14 lg:flex lg:even:flex-row-reverse lg:items-center lg:justify-between"
              >
                <div className="lg:max-w-[25rem]">
                  <motion.header
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center justify-center flex-col sm:flex-row-reverse sm:justify-end sm:items-end"
                  >
                    <figure aria-hidden>
                      <cause.icon />
                    </figure>
                    <h3 className="text-xl sm:mr-4">{cause.title}</h3>
                  </motion.header>
                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center mb-8 sm:text-left"
                  >
                    {cause.subTitle}
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {cause.body}
                  </motion.p>
                </div>
                <motion.figure
                  variants={svgVariants}
                  className="flex items-center justify-center mx-auto mt-16 w-[calc(15rem+10vw)] h-[calc(15rem+10vw)] lg:w-full lg:h-full lg:max-h-[25rem] lg:max-w-[25rem]"
                >
                  <cause.Svg />
                </motion.figure>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </motion.section>
  );
}
