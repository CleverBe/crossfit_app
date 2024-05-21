"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { handleGeneralErrors } from "@/lib/utils"
import {
  CreateAsistenciaInputClient,
  createAsistenciaSchemaClient,
} from "@/schemas/asistencias"
import { createAsistenciaFn } from "@/services/asistencias"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const FormCard = () => {
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(createAsistenciaSchemaClient),
    defaultValues: {
      codigo: "",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createAsistenciaFn,
  })

  const onSubmit = (data: CreateAsistenciaInputClient) => {
    mutate(data, {
      onSuccess: () => {
        form.reset()
        router.refresh()
        toast.success(`Su asistencia ha sido registrada.`, {
          duration: 4000,
        })
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
    <div className="flex h-[calc(100vh-210px)] items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          {/* <CardTitle>Sign in to your account</CardTitle> */}
          <p>Por favor ingrese su codigo para registrar su asistencia</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 md:space-y-6"
            >
              <FormField
                control={form.control}
                name="codigo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codigo</FormLabel>
                    <FormControl>
                      <Input autoFocus autoComplete="off" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} className="w-full">
                Enviar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
