import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { agentInsertSchema } from "../../schema";

interface AgentFormProps {
    onSubmit: (data: any) => void;
    onCancel: () => void;
    initialValues?: AgentGetOne;//from the yt guy our will be different later on
}

export const AgentForm = ({onSubmit, onCancel, initialValues}: AgentFormProps) => {
    const form = useForm<z.infer<typeof agentInsertSchema>>({
    resolver: zodResolver(agentInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instruction: initialValues?.instruction ?? ""
        }
    })

    const isEdit = !!initialValues.id;
    const isPending = form;
}