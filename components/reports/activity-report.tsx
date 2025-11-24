import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ActivityData {
  user: string
  contacts: number
  leads: number
  opportunities: number
  tasks: number
}

interface ActivityReportProps {
  data: ActivityData[]
}

export function ActivityReport({ data }: ActivityReportProps) {
  const totals = data.reduce(
    (acc, curr) => ({
      contacts: acc.contacts + curr.contacts,
      leads: acc.leads + curr.leads,
      opportunities: acc.opportunities + curr.opportunities,
      tasks: acc.tasks + curr.tasks,
    }),
    { contacts: 0, leads: 0, opportunities: 0, tasks: 0 },
  )

  return (
    <div className="rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground">Team Member</TableHead>
            <TableHead className="text-right text-foreground">Contacts</TableHead>
            <TableHead className="text-right text-foreground">Leads</TableHead>
            <TableHead className="text-right text-foreground">Opportunities</TableHead>
            <TableHead className="text-right text-foreground">Tasks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((activity) => (
            <TableRow key={activity.user}>
              <TableCell className="font-medium text-foreground">{activity.user}</TableCell>
              <TableCell className="text-right text-foreground">{activity.contacts}</TableCell>
              <TableCell className="text-right text-foreground">{activity.leads}</TableCell>
              <TableCell className="text-right text-foreground">{activity.opportunities}</TableCell>
              <TableCell className="text-right text-foreground">{activity.tasks}</TableCell>
            </TableRow>
          ))}
          <TableRow className="border-t-2 font-semibold">
            <TableCell className="text-foreground">Total</TableCell>
            <TableCell className="text-right text-foreground">{totals.contacts}</TableCell>
            <TableCell className="text-right text-foreground">{totals.leads}</TableCell>
            <TableCell className="text-right text-foreground">{totals.opportunities}</TableCell>
            <TableCell className="text-right text-foreground">{totals.tasks}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
