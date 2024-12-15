/* eslint-disable @next/next/no-img-element */
import { causes } from "./utils";

export default function Cause() {
  return (
    <section>
      <div className="layout">
        <ul className="lg:max-w-[60rem] lg:mx-auto">
          {causes.map((cause) => {
            return (
              <li
                key={cause.title}
                className="mb-28 lg:mb-14 lg:flex lg:even:flex-row-reverse lg:items-center lg:justify-between"
              >
                <div className="lg:max-w-[25rem]">
                  <header className="flex items-center justify-center flex-col sm:flex-row-reverse sm:justify-end sm:items-end">
                    <figure aria-hidden>
                      <cause.icon />
                    </figure>
                    <h3 className="text-xl sm:mr-4">{cause.title}</h3>
                  </header>
                  <p className="text-center mb-8 sm:text-left">
                    {cause.subTitle}
                  </p>
                  <p>{cause.body}</p>
                </div>
                <figure className="flex items-center justify-center mx-auto mt-16 w-[calc(15rem+10vw)] h-[calc(15rem+10vw)] lg:w-full lg:h-full lg:max-h-[25rem] lg:max-w-[25rem]">
                  <img src={cause.gif} alt="" className="w-full h-full" />
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
