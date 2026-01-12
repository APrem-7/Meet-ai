import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {createAgent} from "@/app/api/agents/agents"
import {agentInsertSchema} from "@/modules/agents/schema"
import { useForm } from "react-hook-form"

interface AgentFormProps{
  onSuccess?: () => {},
  onCancel?: () => {},
  initialValues : {
    name : string,
    instruction : string
  }
}

export const AgentForm = ({
  onSuccess,
  onCancel,
  initialValues,
}: AgentFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver: zodResolver(agentInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      instruction: initialValues?.instruction ?? "",
    },
  });

  const createAgentMutation = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["existingAgents"] });
      onSuccess?.();
    },
  });

  type AgentFormData = z.infer<typeof agentInsertSchema>;

  const onSubmit = form.handleSubmit((values: AgentFormData) => {
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
