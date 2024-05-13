"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { handleGeneralErrors } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  DescuentoFromApi,
  UpdateDescuentoInput,
  updateDescuentoSchemaClient,
} from "@/schemas/descuentos"
import { updateDescuentoFn } from "@/services/descuentos"

interface Props {
  descuento: DescuentoFromApi
  onClose: () => void
}

export const FormUpdate = ({ descuento, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm<UpdateDescuentoInput>({
    resolver: zodResolver(updateDescuentoSchemaClient),
    values: {
      titulo: descuento.titulo,
      porcentaje: descuento.porcentaje,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateDescuentoFn,
  })

  const onSubmit = async (values: UpdateDescuentoInput) => {
    mutate(
      { id: descuento.id, ...values },
      {
        onSuccess: () => {
          // TODO: VERIFICAR QUERYKEYS DE TODOS LOS COMPONENTES
          queryClient.invalidateQueries({ queryKey: ["descuentos"] })
          form.reset()
          router.refresh()
          toast.success(`Descuento updated.`)
          onClose()
        },
        onError: (err: unknown) => {
          const errorMessage = handleGeneralErrors(err)

          if (Array.isArray(errorMessage)) {
            errorMessage.forEach((error) => {
              toast.error(error.message)
            })
          } else {
            toast.error(errorMessage)
          }
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titulo</FormLabel>
              <FormControl>
                <Input placeholder="Por pareja, por familiar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="porcentaje"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Porcentaje</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-end">
          <Button disabled={isPending} type="submit">
            Update
          </Button>
        </div>
      </form>
    </Form>
  )
}

FormUpdate.Skeleton = function FormUpdateSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Titulo</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="space-y-2">
        <Label>Porcentaje</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="flex items-center justify-end">
        <Skeleton className="h-10 w-32 bg-neutral-200" />
      </div>
    </div>
  )
}
