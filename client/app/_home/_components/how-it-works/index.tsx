import { steps } from "./steps";

export default function HowItWorks() {
  return (
    <section className="py-12">
      <div className="layout">
        <header className="flex items-center justify-center text-center mb-8">
          <h2>How It Works</h2>
        </header>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            return (
              <li
                key={index}
                className="flex flex-col items-center justify-center text-center"
              >
                <p className="flex items-center justify-center text-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold mb-4">
                  {index + 1}
                </p>
                <p className="text-lg font-bold mb-4">{step.title}</p>
                <p className="text-sm text-gray-500">{step.paragraph}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
