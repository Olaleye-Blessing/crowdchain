import { Button } from "@/components/ui/button";

interface SampleProps {
  totalSample: number;
  loadSample: (type: "with" | "without" | "random") => void;
}

export default function Sample({ totalSample, loadSample }: SampleProps) {
  return (
    <div className="flex flex-col text-center">
      <p className="text-sm text-muted-foreground mb-2">
        There are {totalSample} available samples.
      </p>
      <div className="text-sm text-muted-foreground mb-2">
        <Button
          type="button"
          variant={"outline"}
          className="mb-2 mr-2"
          onClick={() => loadSample("with")}
        >
          Load Sample With Milestones
        </Button>
        <Button
          type="button"
          variant={"outline"}
          className="mb-2 mr-2"
          onClick={() => loadSample("random")}
        >
          Load Random
        </Button>
        <Button
          type="button"
          variant={"outline"}
          className="mb-2 mr-2"
          onClick={() => loadSample("without")}
        >
          Load Sample Without Milestones
        </Button>
      </div>
    </div>
  );
}
