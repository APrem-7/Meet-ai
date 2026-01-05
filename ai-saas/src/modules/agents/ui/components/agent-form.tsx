import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { agentInsertSchema } from '../../schema';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
interface AgentFormProps {
  onSuccess: () => {};
  onError: () => {};
  initialValues?: any; //from the yt guy our will be different later on
}

export const AgentForm = ({
  onSuccess,
  onError,
  initialValues,
}: AgentFormProps) => {
  const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      instruction: initialValues?.instruction ?? '',
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = form.formState.isSubmitting;

  const onSubmit = (values: z.infer<typeof agentInsertSchema>) => {
    console.log('Form submitted with values:', values);
    // TODO: Implement actual submission logic
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <GeneratedAvatar
          seed={initialValues?.name || 'agent'}
          variant="bottsNeutral"
          className="border size-16"
        />
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="instruction"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instruction</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
