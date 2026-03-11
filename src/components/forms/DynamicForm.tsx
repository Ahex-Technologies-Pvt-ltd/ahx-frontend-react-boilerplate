/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { DynamicFormProps } from "./types";
import { DynamicFieldRenderer } from "./DynamicFieldRenderer";



export function DynamicForm<T extends FieldValues>({
    schema,
    defaultValues,
    fields,
    onSubmit,
    submitButtonText = "Submit",
    className,
}: DynamicFormProps<T>) {
    const form = useForm({
        resolver: zodResolver(schema as any),
        defaultValues: defaultValues as any,
        mode: "onChange", // Enable real-time validation
        reValidateMode: "onChange", // Revalidate on every change
    });

    // Watch all form fields and formState to trigger re-render
    const isFormValid = form.formState.isValid;
    const isSubmitting = form.formState.isSubmitting;

    const handleSubmit = form.handleSubmit((data) => {
        onSubmit(data);
    });

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
                {fields.map((field) => (
                    <DynamicFieldRenderer
                        key={field.name}
                        field={field}
                        control={form.control}
                    />
                ))}
                <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!isFormValid || isSubmitting}
                >
                    {submitButtonText}
                </Button>
            </form>
        </Form>
    );
}
