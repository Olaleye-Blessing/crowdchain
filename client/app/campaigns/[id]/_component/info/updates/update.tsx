import MDXVisual from "@/components/markdown/visual";
import { IUpdate } from "@/interfaces/update";

export default function Update(update: IUpdate) {
  const date = new Date(update.timestamp);
  const readableDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <li className="update flex flex-col sm:flex-row sm:items-start sm:justify-start">
      <div
        aria-hidden
        className="hidden sm:flex sm:w-8 sm:self-stretch sm:flex-col sm:items-center sm:justify-center pt-[0.4rem]"
      >
        <div className="w-2 h-2 rounded-full bg-primary md:w-4 md:h-4" />
        <div className="mx-auto w-[0.1rem] h-full bg-border mt-[0.4rem]" />
      </div>
      <div className="update__content w-full">
        <time
          className="block text-muted-foreground mb-[-0.6rem]"
          dateTime={date.toString()}
        >
          {readableDate}
        </time>
        <h3 className="break-all">{update.title}</h3>
        <div className="overflow-y-auto max-h-[50rem]">
          <MDXVisual markdown={update.content} />
        </div>
      </div>
      <div aria-hidden className="h-[0.1rem] bg-border w-full my-2 sm:hidden" />
    </li>
  );
}
