
import { AreaChart } from 'lucide-react';

export default function MarketDataPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-lg">
          <AreaChart className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Job Market Insights
          </h1>
          <p className="text-muted-foreground">
            Search for real-time job listings and analyze market trends.
          </p>
        </div>
      </div>
      <div className="text-center py-20">
        <p className="text-muted-foreground">Content for Job Market Insights will be here.</p>
      </div>
    </div>
  );
}
