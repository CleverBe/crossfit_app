"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
  Role,
  UserFromApi,
  UpdateUserInput,
  updateUserSchemaClient,
} from "@/schemas/users"
import { updateUserFn } from "@/services/users"
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
import { useSession } from "next-auth/react"

interface Props {
  user: UserFromApi
  onClose: () => void
}

export const FormUpdate = ({ user, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { status, update } = useSession()

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchemaClient),
    values: {
      nombre: user.nombre,
      email: user.email,
      password: "",
      role: user.role,
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateUserFn,
  })

  const onSubmit = async (values: UpdateUserInput) => {
    if (status === "authenticated") {
      const formData = new FormData()

      formData.append("id", user.id)
      formData.append("nombre", values.nombre)
      formData.append("email", values.email)
      if (values.password) {
        formData.append("password", values.password)
      }
      formData.append("role", values.role)
      if (values.imagen?.[0]) {
        formData.append("imagen", values.imagen?.[0])
      }

      mutate(formData, {
        onSuccess: (data) => {
          update({
            nombre: values.nombre,
            email: values.email,
            role: values.role,
            imagen: data.image,
          })
          queryClient.invalidateQueries({ queryKey: ["users"] })

          form.reset()
          router.refresh()
          toast.success(`Usuario ${values.nombre} actualizado.`)
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
      })
    }
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
            <FormItem className="col-span-6">
              <FormLabel>Correo electrónico</FormLabel>
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
          name="password"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Dejar en blanco si no deseas cambiar
              </FormDescription>
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
                disabled={form.formState.isSubmitting}
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
            Actualizar
          </Button>
        </div>
      </form>
    </Form>
  )
}

FormUpdate.Skeleton = function FormUpdateSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-6 space-y-2">
        <Label>Nombre</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Label>Correo electrónico</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Label>Contraseña</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Label>Rol</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-10 space-y-2">
        <Label>Imagen</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-12 flex items-center justify-end">
        <Skeleton className="h-10 w-32 bg-neutral-200" />
      </div>
    </div>
  )
}
