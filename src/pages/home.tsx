import type { JSX } from "react";
import { Button } from "../components/ui/button";
import { IconPlus } from "@tabler/icons-react";

export default function Home(): JSX.Element {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight text-balance">Home Page</h1>
        <Button>
          <IconPlus />
          Add New
        </Button>
      </div>
      Table Here
    </div>
  );
}
