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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CreateUserInput, Role, createUserSchemaClient } from "@/schemas/users"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useUserModalCreate } from "../_hooks/useUserModal"
import { handleGeneralErrors } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { createUserFn } from "@/services/users"

export const FormCreate = () => {
  const router = useRouter()
  const userModal = useUserModalCreate()

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchemaClient),
    values: {
      nombre: "",
      email: "",
      password: "",
      role: Role.MANAGER,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createUserFn,
  })

  const onSubmit: SubmitHandler<CreateUserInput> = async (values) => {
    const formData = new FormData()

    formData.append("nombre", values.nombre)
    formData.append("email", values.email)
    formData.append("password", values.password)
    formData.append("role", values.role)
    if (values.imagen?.[0]) {
      formData.append("imagen", values.imagen?.[0])
    }

    mutate(formData, {
      onSuccess: () => {
        form.reset()
        router.refresh()
        toast.success(`Usuario ${values.nombre} creado.`)
        userModal.onClose()
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
                <Input placeholder="Carlos Perez" {...field} />
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
              <FormLabel>Correo electrónico</FormLabel>
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
          name="password"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="****" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Rol</FormLabel>
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
                      placeholder="Select a role"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Role).map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-10 space-y-2">
          <Label
            htmlFor="image"
            className={form.formState.errors.imagen && "text-destructive"}
          >
            Imagen
          </Label>
          <Input
            id="image"
            type="file"
            {...form.register("imagen")}
            className="w-full"
          />
          {form.formState.errors.imagen && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.imagen.message?.toString()}
            </p>
          )}
        </div>
        <div className="col-span-12 flex w-full items-center justify-end">
          <Button disabled={isPending} type="submit">
            Crear
          </Button>
        </div>
      </form>
    </Form>
  )
}
