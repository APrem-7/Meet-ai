import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { createMeeting, updateMeeting } from '@/app/api/agents/meetings';
import { fetchAgents } from '@/app/api/agents/agents';
import { meetingInsertSchema } from '../schema';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { GeneratedAvatar } from '@/components/generated-avatar';
import { AgentSearchButton } from './agent-search';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  instructions: string;
}

interface MeetingFormProps {
  onSuccess: () => void;
  onError: () => void;
  initialValues?: z.infer<typeof meetingInsertSchema>;
  onCancel?: () => void;
  meetingId?: string;
  isUpdate?: boolean;
}

export const MeetingForm = ({
  onSuccess,
  onError,
  initialValues,
  onCancel,
  isUpdate,
  meetingId,
}: MeetingFormProps) => {
  const [avatarSeed, setAvatarSeed] = useState(initialValues?.name || 'agent'); //TODO:might need to change
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const queryClient = useQueryClient();

  const createMeetingMutation = useMutation({
    mutationFn: createMeeting,

    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ['meetings'],
      });

      if (data?.id) {
        await queryClient.invalidateQueries({
          queryKey: ['meetings', data.id],
        });
      }
      onSuccess?.();
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
      onError?.();
    },
  });

  const updateMeetingMutation = useMutation({
    mutationFn: ({
      meetingId,
      values,
    }: {
      meetingId: string;
      values: z.infer<typeof meetingInsertSchema>;
    }) => updateMeeting(meetingId, values),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['meetings'],
      });

      if (meetingId) {
        await queryClient.invalidateQueries({
          queryKey: ['meetings', meetingId],
        });
      }

      onSuccess?.();
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong');
      onError?.();
    },
  });

  const form = useForm<z.infer<typeof meetingInsertSchema>>({
    resolver: zodResolver(meetingInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      agentId: initialValues?.agentId ?? '',
    },
  });

  // Set selected agent when form loads or changes
  useEffect(() => {
    if (initialValues?.agentId) {
      // We could fetch the agent details here if needed
      // For now, we'll just store the ID
    }
  }, [initialValues?.agentId]);

  const isEdit = !!meetingId;
  const isPending = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof meetingInsertSchema>) => {
    setAvatarSeed(values.name?.trim() || 'agent');

    if (isUpdate && meetingId) {
      await updateMeetingMutation.mutateAsync({
        meetingId,
        values,
      });
    } else {
      await createMeetingMutation.mutateAsync(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="agentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Agent</FormLabel>
              <FormControl>
                <AgentSearchButton
                  selectedAgent={selectedAgent}
                  onSelect={(agent) => {
                    setSelectedAgent(agent);
                    field.onChange(agent.id);
                  }}
                />
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
            {isEdit ? 'Update Meeting' : 'Create Meeting'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
