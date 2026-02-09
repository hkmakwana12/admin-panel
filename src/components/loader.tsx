import { Spinner } from "./ui/spinner";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  );
}
