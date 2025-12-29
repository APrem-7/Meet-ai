import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {createAgent} from "@/app/api/agents/agents"
import {agentsInsertSchema} from "@/modules/agents/schemas"
import { useForm } from "react-hook-form"

interface AgentFormProps{
  onSuccess?: () => {},
  onCancel?: () => {},
  initialValues : {
    name : string,
    instructions : string
  }
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof agentsInsertSchema>>({
    resolver: zodResolver(agentsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instructions: initialValues?.instructions ?? "",
    },
  });

  const createAgentMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["existingAgents"] });
      onSuccess?.();
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    createAgentMutation.mutate(values);
  });

  return (
    <form onSubmit={onSubmit}>
      {/* inputs */}
      <button type="submit">
        Create
      </button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};
