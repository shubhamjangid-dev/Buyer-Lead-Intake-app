import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <div className="w-full flex flex-col items-center justify-center p-12 space-y-6">
      <h1 className="text-6xl font-bold">Buyer Lead Intake</h1>

      <div className="flex gap-4">
        <Link href="/buyers/new">
          <Button className="px-6 py-3 text-lg">+ Create</Button>
        </Link>

        <Link href="/buyers">
          <Button
            variant="outline"
            className="px-6 py-3 text-lg"
          >
            View All
          </Button>
        </Link>
      </div>
    </div>
  );
}
