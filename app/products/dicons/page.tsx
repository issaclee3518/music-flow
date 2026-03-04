import Link from "next/link";
import { LayoutGrid, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiconsPage() {
  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-primary/60 hover:text-ali">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-popover">
            <LayoutGrid className="h-6 w-6 text-ali" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dicons</h1>
            <p className="text-primary/60">Design icons for your projects</p>
          </div>
        </div>
        <p className="text-primary/80 mb-8">
          Your complete platform for design icons. Explore the collection and
          use Dicons in your next project.
        </p>
        <Link href="/">
          <Button variant="default" size="lg">
            Get started
          </Button>
        </Link>
      </div>
    </main>
  );
}
