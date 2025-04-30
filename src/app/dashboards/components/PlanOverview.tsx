import { Button } from '@/components/ui/button';

interface PlanOverviewProps {
  planName: string;
  usedRequests: number;
  totalRequests: number;
  onManagePlan?: () => void;
}

export function PlanOverview({ 
  planName = 'Researcher', 
  usedRequests = 24, 
  totalRequests = 1000,
  onManagePlan 
}: PlanOverviewProps) {
  
  const usagePercentage = (usedRequests / totalRequests) * 100;
  
  return (
    <div className="mb-8">
      <div className="rounded-lg bg-gradient-to-br from-purple-600 via-purple-500 to-amber-300 p-8 text-white">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm mb-2 uppercase">CURRENT PLAN</div>
            <h1 className="text-3xl font-bold mb-6">{planName}</h1>
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm">
                API Limit
              </div>
              <div className="bg-white/20 rounded-full h-2 w-full">
                <div 
                  className="bg-white rounded-full h-full" 
                  style={{ width: `${usagePercentage}%` }} 
                />
              </div>
              <div className="text-sm">{usedRequests}/{totalRequests} Requests</div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={onManagePlan}
            className="bg-transparent text-white border-white hover:bg-white/10 transition-colors"
          >
            Manage Plan
          </Button>
        </div>
      </div>
    </div>
  );
} 