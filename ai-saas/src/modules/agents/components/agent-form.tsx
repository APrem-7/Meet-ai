import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createAgent, updateAgent } from '@/app/api/agents/agents';
import { agentInsertSchema } from '../schema';

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
import { useState } from 'react';
interface AgentFormProps {
  onSuccess: () => void;
  onError: () => void;
  initialValues?: z.infer<typeof agentInsertSchema>;
  onCancel?: () => void;
  agentId?: string;
  isUpdate?: boolean;
}

export const AgentForm = ({
  onSuccess,
  onError,
  initialValues,
  onCancel,
  isUpdate,
  agentId,
}: AgentFormProps) => {
  const [avatarSeed, setAvatarSeed] = useState(initialValues?.name || 'agent');
  const queryClient = useQueryClient();

  const createAgentMutation = useMutation({
    mutationFn: createAgent,

    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['agents'],
      });

      if (data?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['agents', data.id],
        });
      }
      onSuccess?.();
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
      onError?.();
    },
  });

  const updateAgentMutation = useMutation({
    mutationFn: ({
      agentId,
      values,
    }: {
      agentId: string;
      values: z.infer<typeof agentInsertSchema>;
    }) => updateAgent(agentId, values),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['agents'],
      });

      if (agentId) {
        await queryClient.invalidateQueries({
          queryKey: ['agents', agentId],
        });
      }

      onSuccess?.();
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
      onError?.();
    },
  });

  const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      instruction: initialValues?.instruction ?? '',
    },
  });

  const isEdit = !!agentId;
  const isPending = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof agentInsertSchema>) => {
    setAvatarSeed(values.name?.trim() || 'agent');

    if (isUpdate && agentId) {
      await updateAgentMutation.mutateAsync({
        agentId,
        values,
      });
    } else {
      await createAgentMutation.mutateAsync(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <GeneratedAvatar
          seed={avatarSeed}
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
                <Input
                  {...field}
                  placeholder="Enter agent name"
                  onBlur={(e) => {
                    field.onBlur();
                    setAvatarSeed(e.target.value.trim() || 'agent');
                  }}
                />
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
            <Button variant="ghost" onClick={() => onCancel()}>
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
