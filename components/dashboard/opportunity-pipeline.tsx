interface PipelineStage {
  stage: string
  count: number
  value: number
}

interface OpportunityPipelineProps {
  stages: PipelineStage[]
}

export function OpportunityPipeline({ stages }: OpportunityPipelineProps) {
  if (stages.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No pipeline data available
      </div>
    )
  }

  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0)

  return (
    <div className="space-y-4">
      {stages.map((stage) => {
        const percentage = totalValue > 0 ? (stage.value / totalValue) * 100 : 0

        return (
          <div key={stage.stage} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">{stage.stage}</span>
              <span className="text-muted-foreground">
                {stage.count} deals • ${stage.value.toLocaleString()}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
