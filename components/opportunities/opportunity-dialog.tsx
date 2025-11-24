"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Opportunity, OpportunityFormData } from "@/types/opportunities"
import { apiClient } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"

const opportunitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  accountName: z.string().min(1, "Account name is required"),
  stage: z.enum(["Prospecting", "Qualification", "Proposal", "Negotiation", "Closed Won", "Closed Lost"]),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  probability: z.coerce.number().min(0).max(100, "Probability must be between 0 and 100"),
  expectedCloseDate: z.string().min(1, "Expected close date is required"),
  contactId: z.string().optional(),
  notes: z.string().optional(),
})

interface OpportunityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  opportunity: Opportunity | null
  onSave: (opportunity: Opportunity) => void
}

export function OpportunityDialog({ open, onOpenChange, opportunity, onSave }: OpportunityDialogProps) {
  const { toast } = useToast()
  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      name: "",
      accountName: "",
      stage: "Prospecting",
      amount: 0,
      probability: 0,
      expectedCloseDate: "",
      contactId: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (opportunity) {
      form.reset({
        name: opportunity.name,
        accountName: opportunity.accountName,
        stage: opportunity.stage,
        amount: opportunity.amount,
        probability: opportunity.probability,
        expectedCloseDate: opportunity.expectedCloseDate,
        contactId: opportunity.contactId || "",
        notes: opportunity.notes || "",
      })
    } else {
      form.reset({
        name: "",
        accountName: "",
        stage: "Prospecting",
        amount: 0,
        probability: 0,
        expectedCloseDate: "",
        contactId: "",
        notes: "",
      })
    }
  }, [opportunity, form])

  const onSubmit = async (data: OpportunityFormData) => {
    try {
      let savedOpportunity: Opportunity

      if (opportunity) {
        savedOpportunity = await apiClient.put<Opportunity>(`/api/opportunities/${opportunity.id}`, data)
        toast({
          title: "Opportunity updated",
          description: "The opportunity has been updated successfully.",
        })
      } else {
        savedOpportunity = await apiClient.post<Opportunity>("/api/opportunities", data)
        toast({
          title: "Opportunity created",
          description: "The opportunity has been created successfully.",
        })
      }

      onSave(savedOpportunity)
      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save opportunity",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{opportunity ? "Edit Opportunity" : "Create Opportunity"}</DialogTitle>
          <DialogDescription>
            {opportunity ? "Update the opportunity details below." : "Add a new opportunity to your pipeline."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opportunity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Q4 Enterprise Deal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Corporation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Prospecting">Prospecting</SelectItem>
                        <SelectItem value="Qualification">Qualification</SelectItem>
                        <SelectItem value="Proposal">Proposal</SelectItem>
                        <SelectItem value="Negotiation">Negotiation</SelectItem>
                        <SelectItem value="Closed Won">Closed Won</SelectItem>
                        <SelectItem value="Closed Lost">Closed Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedCloseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Close Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="50000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="probability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Probability (%)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" placeholder="75" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add any additional notes..." className="resize-none" rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{opportunity ? "Update Opportunity" : "Create Opportunity"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
