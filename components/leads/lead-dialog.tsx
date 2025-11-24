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
import type { Lead, LeadFormData } from "@/types/leads"
import { apiClient } from "@/lib/api/client"
import { useToast } from "@/hooks/use-toast"

const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Converted", "Lost"]),
  source: z.string().min(1, "Source is required"),
  score: z.coerce.number().min(0).max(100),
  estimatedValue: z.coerce.number().optional(),
  expectedCloseDate: z.string().optional(),
  notes: z.string().optional(),
})

interface LeadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: Lead | null
  onSave: (lead: Lead) => void
}

export function LeadDialog({ open, onOpenChange, lead, onSave }: LeadDialogProps) {
  const { toast } = useToast()
  const form = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "New",
      source: "",
      score: 0,
      estimatedValue: undefined,
      expectedCloseDate: "",
      notes: "",
    },
  })

  useEffect(() => {
    if (lead) {
      form.reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "",
        company: lead.company || "",
        status: lead.status,
        source: lead.source,
        score: lead.score,
        estimatedValue: lead.estimatedValue,
        expectedCloseDate: lead.expectedCloseDate || "",
        notes: lead.notes || "",
      })
    } else {
      form.reset({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "New",
        source: "",
        score: 0,
        estimatedValue: undefined,
        expectedCloseDate: "",
        notes: "",
      })
    }
  }, [lead, form])

  const onSubmit = async (data: LeadFormData) => {
    try {
      let savedLead: Lead

      if (lead) {
        savedLead = await apiClient.put<Lead>(`/api/leads/${lead.id}`, data)
        toast({
          title: "Lead updated",
          description: "The lead has been updated successfully.",
        })
      } else {
        savedLead = await apiClient.post<Lead>("/api/leads", data)
        toast({
          title: "Lead created",
          description: "The lead has been created successfully.",
        })
      }

      onSave(savedLead)
      form.reset()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save lead",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{lead ? "Edit Lead" : "Create Lead"}</DialogTitle>
          <DialogDescription>
            {lead ? "Update the lead details below." : "Add a new lead to your pipeline."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Qualified">Qualified</SelectItem>
                        <SelectItem value="Converted">Converted</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source</FormLabel>
                    <FormControl>
                      <Input placeholder="Website, Referral..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score (0-100)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" placeholder="75" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estimatedValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Value</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10000" {...field} />
                    </FormControl>
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
              <Button type="submit">{lead ? "Update Lead" : "Create Lead"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
