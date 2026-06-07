import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TaskSkeleton() {
  return (
    <Card className="border border-border/50">
      <CardContent className="flex items-start gap-3 p-4">
        <Skeleton className="size-6 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-5 w-2/3 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-4 w-full max-w-[60%] rounded-md" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
