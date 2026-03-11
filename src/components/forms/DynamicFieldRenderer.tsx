/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Control, FieldValues } from "react-hook-form";
import type { FormFieldConfig } from "./types";
import {
    RHFInput,
    RHFTextarea,
    RHFCheckbox,
    RHFSelect,
    RHFRadioGroup,
    RHFSwitch,
    RHFMultiSelect,
    RHFMultiCheckbox,
    RHFMultiRadio,
    RHFNumber,
    RHFEmail,
    RHFPassword,
    RHFUrl,
    RHFDate,
    RHFTime,
    RHFDateTime,
    RHFColor,
    RHFRange,
    RHFFile,
    RHFHidden,
} from "./FormField";



interface DynamicFieldRendererProps<T extends FieldValues> {
  field: FormFieldConfig;
  control: Control<T>;
}

export function DynamicFieldRenderer<T extends FieldValues>({
    field,
    control,
}: DynamicFieldRendererProps<T>) {
     
    const commonProps: any = {
        name: field.name as any,
        control,
        label: field.label,
        placeholder: field.placeholder,
        description: field.description,
        disabled: field.disabled,
        required: field.required,
        className: field.className,
        containerClassName: field.containerClassName,
        labelClassName: field.labelClassName,
        descriptionClassName: field.descriptionClassName,
        errorClassName: field.errorClassName,
        errorMsg: field.errorMsg,
    };

    switch (field.type) {
        case "input":
            return <RHFInput {...commonProps} />;

        case "textarea":
            return <RHFTextarea {...commonProps} />;

        case "select":
            return <RHFSelect {...commonProps} options={field.options} />;

        case "multi-select":
            return <RHFMultiSelect {...commonProps} options={field.options} />;

        case "checkbox":
            return <RHFCheckbox {...commonProps} />;

        case "multi-checkbox":
            return <RHFMultiCheckbox {...commonProps} options={field.options} />;

        case "radio":
            return <RHFRadioGroup {...commonProps} options={field.options} />;

        case "multi-radio":
            return <RHFMultiRadio {...commonProps} options={field.options} />;

        case "switch":
            return <RHFSwitch {...commonProps} />;

        case "number":
            return (
                <RHFNumber
                    {...commonProps}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                />
            );

        case "email":
            return <RHFEmail {...commonProps} />;

        case "password":
            return <RHFPassword {...commonProps} />;

        case "url":
            return <RHFUrl {...commonProps} />;

        case "date":
            return (
                <RHFDate
                    {...commonProps}
                    min={field.min as string}
                    max={field.max as string}
                />
            );

        case "time":
            return (
                <RHFTime
                    {...commonProps}
                    min={field.min as string}
                    max={field.max as string}
                />
            );

        case "datetime":
            return (
                <RHFDateTime
                    {...commonProps}
                    min={field.min as string}
                    max={field.max as string}
                />
            );

        case "color":
            return <RHFColor {...commonProps} />;

        case "range":
            return (
                <RHFRange
                    {...commonProps}
                    min={field.min as number}
                    max={field.max as number}
                    step={field.step}
                />
            );

        case "file":
            return (
                <RHFFile
                    {...commonProps}
                    accept={field.accept}
                    multiple={field.multiple}
                />
            );

        case "hidden":
            return <RHFHidden {...commonProps} />;

        default:
            // console.warn(`Unknown field type: ${field.type}`);
            return null;
    }
}
