import Link from "next/link";
import { pages } from "./pages";

const Pages = () => {
  return (
    <ul className="md:flex md:items-center md:justify-start md:mr-auto md:ml-4">
      {pages.map((page) => {
        return (
          <li key={page.path} className="">
            <Link href={page.path} className="w-full block py-2 px-4">
              {page.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Pages;
