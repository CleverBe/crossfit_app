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
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { handleGeneralErrors } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  InstructorFromApi,
  UpdateInstructorInput,
  updateInstructorSchemaClient,
} from "@/schemas/instructores"
import { updateInstructorFn } from "@/services/instructores"
import { Genero } from "@prisma/client"

interface Props {
  instructor: InstructorFromApi
  onClose: () => void
}

export const FormUpdate = ({ instructor, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm<UpdateInstructorInput>({
    resolver: zodResolver(updateInstructorSchemaClient),
    values: {
      nombre: instructor.nombre,
      apellido: instructor.apellido,
      email: instructor.email,
      celular: instructor.celular,
      genero: instructor.genero,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateInstructorFn,
  })

  const onSubmit = async (values: UpdateInstructorInput) => {
    mutate(
      { id: instructor.id, ...values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["instructores"] })

          form.reset()
          router.refresh()
          toast.success(`Instructor ${values.nombre} updated.`)
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
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="MyName" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="MyName" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="myUsername@gmail.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genero</FormLabel>
              <Select
                disabled={form.formState.isSubmitting}
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

        {/* TODO: ALLOW USER CHANGE INSTRUCTOR STATUS */}

        <FormField
          control={form.control}
          name="celular"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input placeholder="MyName" {...field} />
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
        <Label>Nombre</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="space-y-2">
        <Label>Apellido</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="space-y-2">
        <Label>Genero</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="space-y-2">
        <Label>Celular</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="flex items-center justify-end">
        <Skeleton className="h-10 w-32 bg-neutral-200" />
      </div>
    </div>
  )
}
