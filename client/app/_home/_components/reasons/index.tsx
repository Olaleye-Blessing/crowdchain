import { reasons } from "./reasons";

export default function Reasons() {
  return (
    <section>
      <div className="layout">
        <header className="flex items-center justify-center text-center mb-8">
          <h2>Why Choose ČrôwdChǎin?</h2>
        </header>
        <ul className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {reasons.map((r) => {
            return (
              <li key={r.title}>
                <p className="text-lg font-bold mb-4">{r.title}</p>
                <p className="text-sm font-bold text-muted-foreground">
                  {r.message}
                </p>
                <figure className="mt-6">
                  <r.icon className={`w-10 h-10 ${r.iconClassName}`} />
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
