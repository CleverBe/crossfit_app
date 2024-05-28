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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { handleGeneralErrors } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { useInstructorModalCreate } from "../_hooks/use-user-modal"
import {
  CreateInstructorInput,
  createInstructorSchemaClient,
} from "@/schemas/instructores"
import { createInstructorFn } from "@/services/instructores"
import { Genero } from "@prisma/client"

export const FormCreate = () => {
  const router = useRouter()
  const modalCreate = useInstructorModalCreate()

  const form = useForm<CreateInstructorInput>({
    resolver: zodResolver(createInstructorSchemaClient),
    values: {
      nombre: "",
      apellido: "",
      email: "",
      celular: "",
      genero: Genero.MASCULINO,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createInstructorFn,
  })

  const onSubmit: SubmitHandler<CreateInstructorInput> = async (values) => {
    mutate(values, {
      onSuccess: () => {
        form.reset()
        router.refresh()
        toast.success(`Instructor ${values.nombre} created.`)
        modalCreate.onClose()
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
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Carlos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="apellido"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Perez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="carlosperez@gmail.com"
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
            <FormItem className="col-span-6">
              <FormLabel>Género</FormLabel>
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
          name="celular"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Celular</FormLabel>
              <FormControl>
                <Input placeholder="66776677" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-12 flex w-full items-center justify-end">
          <Button disabled={isPending} type="submit">
            Crear
          </Button>
        </div>
      </form>
    </Form>
  )
}
