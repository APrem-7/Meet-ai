import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createAgent } from '@/app/api/agents/agents';
import { agentInsertSchema } from '../../schema';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { GeneratedAvatar } from '@/components/generated-avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AgentFormProps {
  onSuccess: () => {};
  onError: () => {};

  initialValues?: any; //from the yt guy our will be different later on
  onCancel?: () => {};
}

export const AgentForm = ({
  onSuccess,
  onError,
  initialValues,
  onCancel,
}: AgentFormProps) => {
  const queryClient = useQueryClient();

  const createAgentMutation = useMutation({
    mutationFn: createAgent,

    onSuccess: async () => {
      // 1️⃣ Refetch agent list
      await queryClient.invalidateQueries({
        queryKey: ['agents'],
      });

      // 2️⃣ Refetch single agent if editing
      if (initialValues?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['agent', initialValues.id],
        });
      }

      // 3️⃣ Optional callback
      onSuccess?.();
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
    },
  });

  const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      instruction: initialValues?.instruction ?? '',
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof agentInsertSchema>) => {
    try {
      if (isEdit) {
        console.log('TODO: updateAgent', values);
        // await updateAgent(initialValues.id, values);
      } else {
        await createAgentMutation.mutateAsync(values);
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to submit form:', error);
      onError();
    }
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
                <Input {...field} placeholder="Enter agent name" />
              </FormControl>
              <FormMessage />
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
                <Input {...field} placeholder="Enter agent instruction" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between gap-x-2">
          {onCancel && (
            <Button variant="ghost" onClick={() => onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isEdit ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
