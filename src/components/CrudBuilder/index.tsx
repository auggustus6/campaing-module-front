import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { CrudBuilderField } from './models/CrudBuilderField';
import { useMemo } from 'react';
import { useToast } from '../../context/ToastContext';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

type ScreenState = 'view' | 'update' | 'create';

type Props<T, K extends FieldValues> = {
  zodSchema: K;
  fields: CrudBuilderField[];
  render: ({
    field,
    disabled,
    loading,
    errorMessage,
  }: {
    hook: UseFormReturn<any, any, undefined>;
    field: CrudBuilderField;
    disabled?: boolean;
    loading?: boolean;
    errorMessage?: string;
  }) => React.ReactNode;
  onCreate?: (data: T) => Promise<void>;
  onEdit?: (data: T) => Promise<void>;
  onRemove?: (data: T) => Promise<void>;
  screenState: ScreenState;
  container?: (children: React.ReactNode) => React.ReactNode;
  isLoading?: boolean;
};

export const CrudBuilder = <T, K extends FieldValues = FieldValues>({
  zodSchema,
  container = (children) => children,
  render,
  fields,
  isLoading,
  screenState,
  onCreate,
  onEdit,
  onRemove,
}: Props<T, K>) => {
  const toast = useToast();
  const navigate = useNavigate();
  const hook = useForm<any>({
    resolver: zodResolver(zodSchema as any),
  });

  const { mutate: onSubmit, isLoading: isSubmitting } = useMutation({
    mutationFn: async (values: T) => {
      // using this function to remove too
      if (!onRemove && !values) {
        console.log('renderizeiaqui');
        return;
      }

      if (onCreate && screenState === 'create') {
        await onCreate(values);
        toast.success('Criado com sucesso');
        navigate('..');
        return;
      }
      if (onEdit && screenState === 'update') {
        await onEdit(values);
        toast.success('Editado com sucesso');
        navigate('..');
        return;
      }

      await onRemove?.(values);
      toast.success('Removido com sucesso');
      navigate('..');
    },
    onError: () => {
      if (screenState === 'create') {
        toast.error('Erro ao criar');
        return;
      }
      if (screenState === 'update') {
        toast.error('Erro ao editar');
        return;
      }
      toast.error('Erro ao remover');
    },
  });

  console.log('lul');

  const isLoadState = useMemo(
    () => isLoading || isSubmitting,
    [isLoading, isSubmitting]
  );

  const components = fields.map((field) => {
    if (field.hideOn?.create && screenState === 'create') {
      return null;
    }
    if (field.hideOn?.view && screenState === 'view') {
      return null;
    }
    if (field.hideOn?.update && screenState === 'update') {
      return null;
    }

    if (field.disableOn?.create && screenState === 'create') {
      return render({
        field,
        disabled: true,
        loading: isLoadState,
        hook,
        errorMessage: hook.formState.errors[field.label]?.message?.toString(),
      });
    }
    if (field.disableOn?.view && screenState === 'view') {
      return render({
        field,
        disabled: true,
        loading: isLoadState,
        hook,
        errorMessage: hook.formState.errors[field.label]?.message?.toString(),
      });
    }
    if (field.disableOn?.update && screenState === 'update') {
      return render({
        field,
        disabled: true,
        loading: isLoadState,
        hook,
        errorMessage: hook.formState.errors[field.label]?.message?.toString(),
      });
    }

    return render({
      field,
      loading: isLoadState,
      hook,
      errorMessage: hook.formState.errors[field.label]?.message?.toString(),
    });
  });

  return (
    <form onSubmit={hook.handleSubmit(onSubmit as any)}>
      {container(components)}
      <button type="submit">enviar</button>
    </form>
  );
};
