/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FieldValues } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { withRHF, type WithRHFProps } from "./withRHF";
import type { FormOption } from "./types";


// RHFInput - Input field with RHF
export const RHFInput = withRHF<FieldValues, React.ComponentProps<typeof Input>>(
    Input,
    (field, props) => (
        <Input
            {...field}
            placeholder={props.placeholder}
            disabled={props.disabled}
            className={props.className}
        />
    ),
);

// RHFTextarea - Textarea field with RHF
export const RHFTextarea = withRHF<
  FieldValues,
  React.ComponentProps<typeof Textarea>
>(Textarea, (field, props) => (
    <Textarea
        {...field}
        placeholder={props.placeholder}
        disabled={props.disabled}
        className={props.className}
    />
));

// RHFCheckbox - Checkbox field with RHF
export function RHFCheckbox<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
}: WithRHFProps<T>) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem
                    className={cn(
                        "flex flex-row items-start space-x-3 space-y-0",
                        containerClassName,
                    )}
                >
                    <FormControl>
                        <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                            className={className}
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        {label && (
                            <FormLabel className={cn(labelClassName)}>
                                {label}
                                {required && <span className="text-destructive ml-1">*</span>}
                            </FormLabel>
                        )}
                        {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    </div>
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFSelect - Select field with RHF
export function RHFSelect<T extends FieldValues>({
    name,
    control,
    label,
    description,
    placeholder,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    options = [],
}: WithRHFProps<T> & { options?: FormOption[] }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={disabled}
                    >
                        <FormControl>
                            <SelectTrigger className={className}>
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFRadioGroup - Radio group field with RHF
export function RHFRadioGroup<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    options = [],
}: WithRHFProps<T> & { options?: FormOption[] }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn("space-y-3", containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className={cn("flex flex-col space-y-1", className)}
                            disabled={disabled}
                        >
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    className="flex items-center space-x-2"
                                >
                                    <RadioGroupItem value={option.value} id={option.value} />
                                    <Label htmlFor={option.value}>{option.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFSwitch - Switch field with RHF
export function RHFSwitch<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
}: WithRHFProps<T>) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem
                    className={cn(
                        "flex flex-row items-center justify-between rounded-lg border p-4",
                        containerClassName,
                    )}
                >
                    <div className="space-y-0.5">
                        {label && (
                            <FormLabel className={cn("text-base", labelClassName)}>
                                {label}
                                {required && <span className="text-destructive ml-1">*</span>}
                            </FormLabel>
                        )}
                        {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disabled}
                            className={className}
                        />
                    </FormControl>
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}


// RHFMultiSelect - Multi-select field with RHF
export function RHFMultiSelect<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    options = [],
}: WithRHFProps<T> & { options?: FormOption[] }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <div className={cn("flex flex-wrap gap-2", className)}>
                            {options.map((option) => (
                                <label
                                    key={option.value}
                                    className="flex items-center space-x-2 rounded border px-3 py-2 cursor-pointer hover:bg-secondary hover:border-primary transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={(field.value || []).includes(option.value)}
                                        onChange={(e) => {
                                            const current = field.value || [];
                                            if (e.target.checked) {
                                                field.onChange([...current, option.value]);
                                            } else {
                                                field.onChange(
                                                    current.filter((v: string) => v !== option.value),
                                                );
                                            }
                                        }}
                                        disabled={disabled}
                                        className="rounded"
                                    />
                                    <span>{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFMultiCheckbox - Multi-checkbox field with RHF
export function RHFMultiCheckbox<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    options = [],
}: WithRHFProps<T> & { options?: FormOption[] }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn("space-y-3", containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <div className={cn("space-y-2", className)}>
                            {options.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={(field.value || []).includes(option.value)}
                                        onCheckedChange={(checked: any) => {
                                            const current = field.value || [];
                                            if (checked) {
                                                field.onChange([...current, option.value]);
                                            } else {
                                                field.onChange(
                                                    current.filter((v: string) => v !== option.value),
                                                );
                                            }
                                        }}
                                        disabled={disabled}
                                    />
                                    <Label>{option.label}</Label>
                                </div>
                            ))}
                        </div>
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFMultiRadio - Multi-radio field with RHF (allows multiple selections)
export function RHFMultiRadio<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    options = [],
}: WithRHFProps<T> & { options?: FormOption[] }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn("space-y-3", containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <div className={cn("flex flex-col space-y-1", className)}>
                            {options.map((option) => (
                                <div
                                    key={option.value}
                                    className="flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={option.value}
                                        checked={(field.value || []).includes(option.value)}
                                        onCheckedChange={(checked: any) => {
                                            const current = field.value || [];
                                            if (checked) {
                                                field.onChange([...current, option.value]);
                                            } else {
                                                field.onChange(
                                                    current.filter((v: string) => v !== option.value),
                                                );
                                            }
                                        }}
                                        disabled={disabled}
                                    />
                                    <Label htmlFor={option.value}>{option.label}</Label>
                                </div>
                            ))}
                        </div>
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFNumber - Number input field with RHF
export function RHFNumber<T extends FieldValues>({
    name,
    control,
    label,
    description,
    placeholder,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    min,
    max,
    step,
}: WithRHFProps<T> & { min?: number; max?: number; step?: number }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input
                            type="number"
                            {...field}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={className}
                            min={min}
                            max={max}
                            step={step}
                        />
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFEmail - Email input field with RHF
export function RHFEmail<T extends FieldValues>({
    name,
    control,
    label,
    description,
    placeholder,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
}: WithRHFProps<T>) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input
                            type="email"
                            {...field}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={className}
                        />
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFPassword - Password input field with RHF
export function RHFPassword<T extends FieldValues>({
    name,
    control,
    label,
    description,
    placeholder,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
}: WithRHFProps<T>) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input
                            type="password"
                            {...field}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={className}
                        />
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFUrl - URL input field with RHF
export function RHFUrl<T extends FieldValues>({
    name,
    control,
    label,
    description,
    placeholder,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
}: WithRHFProps<T>) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input
                            type="url"
                            {...field}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={className}
                        />
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFDate - Date input field with RHF
export function RHFDate<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    min,
    max,
}: WithRHFProps<T> & { min?: string; max?: string }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input
                            type="date"
                            {...field}
                            disabled={disabled}
                            className={className}
                            min={min}
                            max={max}
                        />
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFTime - Time input field with RHF
export function RHFTime<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    min,
    max,
}: WithRHFProps<T> & { min?: string; max?: string }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input
                            type="time"
                            {...field}
                            disabled={disabled}
                            className={className}
                            min={min}
                            max={max}
                        />
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFDateTime - DateTime input field with RHF
export function RHFDateTime<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    min,
    max,
}: WithRHFProps<T> & { min?: string; max?: string }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input
                            type="datetime-local"
                            {...field}
                            disabled={disabled}
                            className={className}
                            min={min}
                            max={max}
                        />
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFColor - Color picker field with RHF
export function RHFColor<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
}: WithRHFProps<T>) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <div className="flex items-center gap-2">
                            <Input
                                type="color"
                                {...field}
                                disabled={disabled}
                                className={cn("h-10 w-20 cursor-pointer", className)}
                            />
                            <span className="text-sm text-gray-600">{field.value}</span>
                        </div>
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFRange - Range slider field with RHF
export function RHFRange<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    min = 0,
    max = 100,
    step = 1,
}: WithRHFProps<T> & { min?: number; max?: number; step?: number }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <div className="space-y-2">
                            <input
                                type="range"
                                value={field.value}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                disabled={disabled}
                                className={cn("w-full", className)}
                                min={min}
                                max={max}
                                step={step}
                            />
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>{min}</span>
                                <span className="font-semibold">{field.value}</span>
                                <span>{max}</span>
                            </div>
                        </div>
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFFile - File input field with RHF
export function RHFFile<T extends FieldValues>({
    name,
    control,
    label,
    description,
    disabled,
    required,
    className,
    containerClassName,
    labelClassName,
    descriptionClassName,
    errorClassName,
    errorMsg,
    accept,
    multiple,
}: WithRHFProps<T> & { accept?: string; multiple?: boolean }) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <FormItem className={cn(containerClassName)}>
                    {label && (
                        <FormLabel className={cn(labelClassName)}>
                            {label}
                            {required && <span className="text-destructive ml-1">*</span>}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input
                            type="file"
                            onChange={(e) => {
                                if (multiple) {
                                    field.onChange(e.target.files);
                                } else {
                                    field.onChange(e.target.files?.[0]);
                                }
                            }}
                            disabled={disabled}
                            className={className}
                            accept={accept}
                            multiple={multiple}
                        />
                    </FormControl>
                    {description && <FormDescription className={cn(descriptionClassName)}>{description}</FormDescription>}
                    <FormMessage className={cn(errorClassName)}>{errorMsg}</FormMessage>
                </FormItem>
            )}
        />
    );
}

// RHFHidden - Hidden input field with RHF
export function RHFHidden<T extends FieldValues>({
    name,
    control,
}: WithRHFProps<T>) {
    return (
        <FormField
            control={control as any}
            name={name}
            render={({ field }: { field: any }) => (
                <input type="hidden" {...field} />
            )}
        />
    );
}
