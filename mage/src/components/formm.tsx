import { WorkflowFormSchema } from '@/lib/types'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Props = {
    title?: string; // Optional title for the form
    onSubmit: (values: z.infer<typeof WorkflowFormSchema>) => void; // Function to handle form submission
    isSaving: boolean; // State to indicate if the form is currently saving
  };
const Workflowform = ({ title, onSubmit, isSaving }: Props) => {
    const form = useForm<z.infer<typeof WorkflowFormSchema>>({
      mode: 'onChange',
      resolver: zodResolver(WorkflowFormSchema),
      defaultValues: {
        name: '',
      },
    });
  
    const handleSubmit = async (values: z.infer<typeof WorkflowFormSchema>) => {
      if (onSubmit) {
        onSubmit(values); // Pass form data to parent
      }
    };

  return (
    <Card className="w-full max-w-[650px] royal-twilight text-gray-300 border-white">
      {title && (
        <CardHeader>
          <CardTitle className='font-semibold text-2xl '>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4 text-left"
          >
           <FormField
              disabled={isSaving}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <Button className="mt-4" disabled={isSaving} type="submit">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                'Save'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default Workflowform