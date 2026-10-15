"use client";

import * as React from "react";
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext =
  React.createContext<FormFieldContextValue | null>(null);

function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  if (!fieldContext) {
    throw new Error("useFormField must be used inside a FormField");
  }
  if (!itemContext) {
    throw new Error("useFormField must be used inside a FormItem");
  }

  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    id: itemContext.id,
    name: fieldContext.name,
    formItemId: `${itemContext.id}-form-item`,
    formDescriptionId: `${itemContext.id}-form-item-description`,
    formMessageId: `${itemContext.id}-form-item-message`,
    ...fieldState,
  };
}

type FormItemContextValue = { id: string };
const FormItemContext = React.createContext<FormItemContextValue | null>(null);

function FormItem({ children }: { children: React.ReactNode }) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className="space-y-2">{children}</div>
    </FormItemContext.Provider>
  );
}

function FormLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { error, formItemId } = useFormField();

  return (
    <label
      htmlFor={formItemId}
      className={`text-sm font-medium ${error ? "text-red-600" : "text-slate-700"} ${className}`}
    >
      {children}
    </label>
  );
}

function FormControl({
  children,
}: {
  children: React.ReactElement<Record<string, unknown>>;
}) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return React.cloneElement(
    children,
    {
      id: formItemId,
      "aria-describedby": error
        ? `${formDescriptionId} ${formMessageId}`
        : formDescriptionId,
      "aria-invalid": Boolean(error),
    } as Partial<Record<string, unknown>>,
  );
}

function FormDescription({ children }: { children: React.ReactNode }) {
  const { formDescriptionId } = useFormField();

  return (
    <p id={formDescriptionId} className="text-xs text-slate-500">
      {children}
    </p>
  );
}

function FormMessage() {
  const { error, formMessageId } = useFormField();
  const message = error?.message as string | undefined;

  if (!message) {
    return null;
  }

  return (
    <p id={formMessageId} className="text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
};
