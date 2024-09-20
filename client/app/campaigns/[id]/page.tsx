import { IPage } from "@/interfaces/page";
import Main from "./_component/main";

export default function Page({ params }: IPage<{ id: string }>) {
  return (
    <main>
      <Main id={params.id} />
    </main>
  );
}
