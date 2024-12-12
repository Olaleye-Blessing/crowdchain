import { lists } from "../_utils/list";

export default function Instructions() {
  return (
    <ul className="sm:grid md:grid-cols-2 md:gap-8 lg:grid-cols-3">
      {lists.map((list) => {
        const key = list.title.replaceAll(" ", "_");
        return (
          <section
            id={key}
            key={key}
            className="mb-4 last:mb-0 bg-white more__shadow hover:shadow-sm transition-shadow duration-700 rounded-md p-2 md:mb-0"
          >
            <header>
              <h2>{list.title}</h2>
            </header>
            <ul className="pl-[0.2rem]">
              <li>
                <span>Faucet Website: </span>
                <a
                  href={list.faucet_website_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {list.faucet_website}
                </a>
              </li>
              <li>
                Steps
                <ol className="ml-[1.2rem]">
                  {list.steps.map((step, i) => {
                    return <li key={i}>{step}</li>;
                  })}
                </ol>
              </li>
            </ul>
          </section>
        );
      })}
    </ul>
  );
}
