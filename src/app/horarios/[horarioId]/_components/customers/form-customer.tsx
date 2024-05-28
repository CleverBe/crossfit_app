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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { handleGeneralErrors } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  CustomerFromApi,
  updateCustomerSchemaClient,
  updateCustomerSchemaClientInput,
} from "@/schemas/customer"
import { updateCustomerFn } from "@/services/customer"
import { Genero } from "@prisma/client"

interface Props {
  customer: CustomerFromApi
  onClose: () => void
}

export const FormUpdateCustomer = ({ customer, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm<updateCustomerSchemaClientInput>({
    resolver: zodResolver(updateCustomerSchemaClient),
    values: {
      nombre_completo: customer.nombre_completo,
      genero: customer.genero,
      celular: customer.celular,
      cedula: customer.cedula,
      fecha_nacimiento: customer.fecha_nacimiento,
      peso_cliente: customer.peso ?? "",
      estatura: customer.estatura ?? "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateCustomerFn,
  })

  const onSubmit = async (values: updateCustomerSchemaClientInput) => {
    mutate(
      { id: customer.id, ...values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["customers"] })
          form.reset()
          router.refresh()
          toast.success(`Cliente updated.`)
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
      <form
        className="grid grid-cols-12 gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="nombre_completo"
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormLabel>Nombre completo</FormLabel>
              <FormControl>
                <Input placeholder="MyName" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cedula"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Cedula</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="celular"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input placeholder="MyPhoneNumber" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="genero"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Genero</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={field.value}
                      placeholder="Seleccione un genero"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Genero).map((genero) => (
                    <SelectItem key={genero} value={genero}>
                      {genero}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fecha_nacimiento"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Fecha de nacimiento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="peso_cliente"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Peso Kg {"(opcional)"}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="estatura"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Estatura Cm {"(opcional)"}</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-12 flex w-full items-center justify-end">
          <Button disabled={isPending} type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  )
}

FormUpdateCustomer.Skeleton = function FormUpdateCustomerSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12 space-y-2">
        <Skeleton className="h-5 w-32 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Skeleton className="h-5 w-20 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Skeleton className="h-5 w-20 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Skeleton className="h-5 w-20 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Skeleton className="h-5 w-20 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Skeleton className="h-5 w-20 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Skeleton className="h-5 w-20 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-12 flex items-center justify-end">
        <Skeleton className="h-10 w-32 bg-neutral-200" />
      </div>
    </div>
  )
}
