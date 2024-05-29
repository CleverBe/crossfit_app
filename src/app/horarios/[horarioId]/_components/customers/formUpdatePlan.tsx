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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  PlanFromApi,
  UpdatePlanSchemaInput,
  updatePlanSchemaClient,
} from "@/schemas/plan"
import { updatePlanFn } from "@/services/plan"
import { TipoDePago } from "@prisma/client"
import { getTiposDePlanesFn } from "@/services/tipoDePlanes"
import { getDescuentosFn } from "@/services/descuentos"
import { formatDays } from "@/utils"

interface Props {
  plan: PlanFromApi
  onClose: () => void
}

export const FormUpdatePlan = ({ plan, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: tiposDePlanes } = useQuery({
    queryKey: ["tiposDePlanes"],
    queryFn: getTiposDePlanesFn,
  })

  const { data: descuentos } = useQuery({
    queryKey: ["descuentos"],
    queryFn: getDescuentosFn,
  })

  const form = useForm<UpdatePlanSchemaInput>({
    resolver: zodResolver(updatePlanSchemaClient),
    values: {
      fecha_inicio: plan.fecha_inicio,
      fecha_fin: plan.fecha_fin,
      peso_cliente: plan.peso_cliente ?? "",
      estatura: plan.estatura_cliente ?? "",
      tipoDePago: plan.pago.tipo_de_pago,
      tipoDePlanId: plan.tipoDePlan.id,
      descuentoId: plan.descuento?.id ?? "unassigned",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updatePlanFn,
  })

  const onSubmit = async (values: UpdatePlanSchemaInput) => {
    mutate(
      { id: plan.id, ...values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["planes"] })
          form.reset()
          router.refresh()
          toast.success(`Plan updated.`)
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

  const costoDelPlan =
    tiposDePlanes?.find((item) => item.id === form.watch("tipoDePlanId"))
      ?.costo ?? 0

  const descuentoPorcentaje =
    descuentos?.find((item) => item.id === form.watch("descuentoId"))
      ?.porcentaje ?? 0

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-12 gap-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="fecha_inicio"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Fecha inicio</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fecha_fin"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Fecha fin</FormLabel>
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
        <FormField
          control={form.control}
          name="tipoDePago"
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormLabel>Tipo de Pago</FormLabel>
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
                      placeholder="Seleccione un tipo de pago"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(TipoDePago).map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
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
          name="tipoDePlanId"
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormLabel>Tipo de Plan</FormLabel>
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
                      placeholder="Seleccione un tipo de plan"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">
                    Seleccione un tipo de plan
                  </SelectItem>
                  {tiposDePlanes?.map((tipoDePlan) => (
                    <SelectItem key={tipoDePlan.id} value={tipoDePlan.id}>
                      {`${tipoDePlan.tipo} - ${tipoDePlan.cantidadDeClases} clases - ${formatDays(tipoDePlan.dias)} - ${tipoDePlan.costo} Bs`}
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
          name="descuentoId"
          render={({ field }) => (
            <FormItem className="col-span-12">
              <FormLabel>Descuento</FormLabel>
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
                      placeholder="Seleccione un descuento"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="unassigned">Sin descuento</SelectItem>
                  {descuentos?.map((descuento) => (
                    <SelectItem key={descuento.id} value={descuento.id}>
                      {`${descuento.titulo} - ${descuento.porcentaje} %`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("tipoDePlanId") !== "unassigned" && (
          <div className="col-span-12 py-1.5 text-xl font-semibold">
            {`Costo total: ${costoDelPlan} - ${descuentoPorcentaje}% = ${costoDelPlan * (1 - descuentoPorcentaje / 100)} bs`}
          </div>
        )}
        <div className="col-span-12 flex w-full items-center justify-end">
          <Button disabled={isPending} type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  )
}

FormUpdatePlan.Skeleton = function FormUpdatePlanSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-2">
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
      <div className="col-span-12 space-y-2">
        <Skeleton className="h-5 w-32 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-12 space-y-2">
        <Skeleton className="h-5 w-32 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div className="col-span-12 space-y-2">
        <Skeleton className="h-5 w-32 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>
      <div>
        <Skeleton className="h-10 w-64 bg-neutral-200" />
      </div>
      <div className="col-span-12 flex items-center justify-end">
        <Skeleton className="h-10 w-32 bg-neutral-200" />
      </div>
    </div>
  )
}
