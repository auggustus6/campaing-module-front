import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { CrudBuilderField } from './models/CrudBuilderField';
import { useEffect, useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { CrudDefaultContainer } from './components/CrudDefaultContainer';
import { CrudBuilderSchema } from './schemaBuilder/crudSchema';
import { ZodType, z } from 'zod';
import React from 'react';

export const CBScreenStateOptions = ['view', 'update', 'create'] as const;
export type CBScreenState = 'view' | 'update' | 'create';

/* 
  T - data from hookForm onSubmit
  K - zod schema
*/
type Props<T, K extends ZodType<any, any, any>> = {
  title?: React.ReactNode;
  schema: CrudBuilderSchema<K>;
  data?: T & {
    [key: string]: any;
  };

  render: ({
    field,
    disabled,
    loading,
    errorMessage,
    data,
  }: {
    hook: UseFormReturn<z.infer<K>, any, any>;
    field: CrudBuilderField;
    disabled?: boolean;
    loading?: boolean;
    errorMessage?: string;
    data?: T & {
      [key: string]: any;
    };
  }) => React.ReactNode;

  onCreate?: (data: z.infer<K> & { [key: string]: any }) => Promise<void>;
  onEdit?: (data: z.infer<K>) => Promise<void>;
  onRemove?: () => Promise<void>;
  screenState: CBScreenState;

  container?: ({
    children,
    handleSubmit,
  }: {
    children: React.ReactNode;
    handleSubmit: () => void;
  }) => React.ReactNode;
  isLoading?: boolean;

  buttons: ({
    hook,
    loading,
    onRemove,
  }: {
    hook: UseFormReturn<z.infer<K>, any, any>;
    loading?: boolean;
    onRemove?: () => void;
  }) => React.ReactNode;

  onInit?: (hook: UseFormReturn<z.infer<K>, any, any>) => void;
};

export const CrudBuilder = <T, K extends ZodType<any, any, any>>({
  render,
  schema,
  isLoading,
  screenState,
  onCreate,
  onEdit,
  onRemove,
  buttons,
  title,
  data,
  onInit,
  container = ({ children, handleSubmit }) => (
    <CrudDefaultContainer handleSubmit={handleSubmit} title={title}>
      {children}
    </CrudDefaultContainer>
  ),
}: Props<T, K>) => {
  const toast = useToast();
  const navigate = useNavigate();
  const hook = useForm<any>({
    resolver: zodResolver(schema.schema as any),
  });

  useEffect(() => {
    onInit?.(hook);
  }, []);

  const { mutate, isLoading: isSubmitting } = useMutation({
    mutationFn: async ({
      values,
      isRemove,
    }: {
      values?: T;
      isRemove?: boolean;
    }) => {
      console.log(screenState, onCreate, onEdit, onRemove);

      // using this function to remove too
      if (isRemove && onRemove) {
        console.log('isRemove && onRemove');
        await onRemove?.();
        toast.success('Removido com sucesso');
        navigate('..');
        return;
      }

      if (!values) {
        console.log('!values');
        return;
      }

      if (onCreate && screenState === 'create') {
        console.log("onCreate && screenState === 'create'");
        await onCreate(values);
        toast.success('Criado com sucesso');
        navigate('..');
        return;
      }
      if (onEdit && screenState === 'update') {
        console.log("onEdit && screenState === 'update'");
        await onEdit(values);
        toast.success('Editado com sucesso');
        navigate('..');
        return;
      }
    },
    onError: () => {
      if (screenState === 'create') {
        console.log("screenState === 'create'");
        toast.error('Erro ao criar');
        return;
      }
      if (screenState === 'update') {
        console.log("screenState === 'update'");
        toast.error('Erro ao editar');
        return;
      }

      console.log("toast.error('Erro ao remover');");
      toast.error('Erro ao remover');
    },
  });

  const isLoadState = useMemo(
    () => isLoading || isSubmitting,
    [isLoading, isSubmitting]
  );

  const components = schema.fields.map((field) => {
    const shouldHide =
      (field.hideOn?.create && screenState === 'create') ||
      (field.hideOn?.view && screenState === 'view') ||
      (field.hideOn?.update && screenState === 'update');

    if (shouldHide) {
      return null;
    }

    const shouldDisable =
      (field.disableOn?.create && screenState === 'create') ||
      (field.disableOn?.view && screenState === 'view') ||
      (field.disableOn?.update && screenState === 'update');

    return render({
      field,
      loading: isLoadState,
      disabled: shouldDisable,
      hook,
      errorMessage: hook.formState.errors[field.name]?.message?.toString(),
      data,
    });
  });

  const buttonsComponents = buttons({
    hook,
    loading: isLoadState,
    onRemove: () =>
      mutate({
        isRemove: true,
      }),
  });

  return container({
    children: (
      <>
        {components}
        {buttonsComponents}
      </>
    ),
    handleSubmit: hook.handleSubmit((data) => {
      console.log('hook.handleSubmit');
      return mutate({ values: data });
    }),
  });
};
