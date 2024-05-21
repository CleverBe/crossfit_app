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

interface Props {
  user: UserFromApi
  onClose: () => void
}

export const FormUpdate = ({ user, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()

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
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] })

        form.reset()
        router.refresh()
        toast.success(`User ${values.nombre} updated.`)
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
          name="password"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormDescription>
                Leave password empty if you dont want to change it
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
              <FormLabel>Role</FormLabel>
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
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            {...form.register("imagen")}
            className="w-full"
          />
        </div>
        <div className="col-span-12 flex w-full items-center justify-end">
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
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-6 space-y-2">
        <Label>Username</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Label>Email</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Label>Password</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-6 space-y-2">
        <Label>Role</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-10 space-y-2">
        <Label>Image</Label>
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-12 flex items-center justify-end">
        <Skeleton className="h-10 w-32 bg-neutral-200" />
      </div>
    </div>
  )
}
