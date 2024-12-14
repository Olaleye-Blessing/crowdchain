import { Search as SearchIcon } from "lucide-react";
import { Input } from "../ui/input";

export default function Search() {
  return (
    <form className="px-4 mt-2 md:mt-0 md:flex-1 md:max-w-[23rem] md:px-0">
      <fieldset disabled className="relative">
        <Input
          name="search"
          type="search"
          id="search"
          placeholder="Search campaigns by full title"
        />
        <span className="absolute top-[0.7rem] right-[0.2rem] text-gray-600">
          <SearchIcon className="w-4 h-4" />
        </span>
      </fieldset>
    </form>
  );
}
