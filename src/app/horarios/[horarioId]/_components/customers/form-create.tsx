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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn, handleGeneralErrors } from "@/lib/utils"
import {
  CreateCustomerInput,
  CreateCustomerOutput,
  createCustomerSchemaClient,
} from "@/schemas/customer"
import { createCustomerFn } from "@/services/customer"
import { getDescuentosFn } from "@/services/descuentos"
import { getTiposDePlanesFn } from "@/services/tipoDePlanes"
import { zodResolver } from "@hookform/resolvers/zod"
import { Genero, TipoDePago } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useParams, useRouter } from "next/navigation"
import { SubmitHandler, useForm } from "react-hook-form"
import { toast } from "sonner"
import { useCustomerModalCreate } from "../../_hooks/useCustomerModal"
import { formatDays } from "@/utils"
import { z } from "zod"

interface Props {
  periodo: string
}

export const FormCreate = ({ periodo }: Props) => {
  const params = useParams<{ horarioId: string }>()
  const router = useRouter()
  const modalCreate = useCustomerModalCreate()

  const { data: descuentos } = useQuery({
    queryKey: ["descuentos"],
    queryFn: getDescuentosFn,
  })

  const { data: tiposDePlanes } = useQuery({
    queryKey: ["tipoDePlanes"],
    queryFn: getTiposDePlanesFn,
  })

  const form = useForm<CreateCustomerInput>({
    resolver: zodResolver(createCustomerSchemaClient),
    values: {
      nombre_completo: "",
      genero: Genero.MASCULINO,
      celular: "",
      fecha_nacimiento: "",
      peso_cliente: "",
      estatura: "",
      fecha_inicio: "",
      fecha_fin: "",
      cedula: "",
      tipoDePago: TipoDePago.EFECTIVO,
      tipoDePlanId: "unassigned",
      descuentoId: "unassigned",
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: createCustomerFn,
  })

  const onSubmit: SubmitHandler<CreateCustomerInput> = async (data) => {
    const values = data as CreateCustomerOutput

    mutate(
      { ...values, horarioId: params.horarioId, periodoCode: periodo },
      {
        onSuccess: () => {
          form.reset()

          router.refresh()
          toast.success(`Customer created.`)

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
      },
    )
  }

  const costoDelPlan =
    tiposDePlanes?.find((item) => item.id === form.watch("tipoDePlanId"))
      ?.costo ?? 0

  const descuentoPorcentaje =
    descuentos?.find((item) => item.id === form.watch("descuentoId"))
      ?.porcentaje ?? 0

  const errorOnCustomerTab = [
    form.formState.errors["nombre_completo"],
    form.formState.errors["genero"],
    form.formState.errors["celular"],
    form.formState.errors["cedula"],
    form.formState.errors["fecha_nacimiento"],
  ].some((val) => val !== undefined)

  const errorOnPlanTab = [
    form.formState.errors["fecha_inicio"],
    form.formState.errors["fecha_fin"],
    form.formState.errors["peso_cliente"],
    form.formState.errors["estatura"],
  ].some((val) => val !== undefined)

  const errorOnPagoTab = [
    form.formState.errors["tipoDePago"],
    form.formState.errors["tipoDePlanId"],
    form.formState.errors["descuentoId"],
  ].some((val) => val !== undefined)

  const names = ["lucas", "juan", "andres", "jason"]

  const filteredNames = names.filter(
    (name) =>
      name.includes(form.getValues("nombre_completo")) &&
      name !== form.getValues("nombre_completo"),
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="customer" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="customer"
              className={cn(errorOnCustomerTab && "text-red-400")}
            >
              Customer
            </TabsTrigger>
            <TabsTrigger
              value="plan"
              className={cn(errorOnPlanTab && "text-red-400")}
            >
              Plan
            </TabsTrigger>
            <TabsTrigger
              value="pago"
              className={cn(errorOnPagoTab && "text-red-400")}
            >
              Pago
            </TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="nombre_completo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <div>
                        <Input
                          autoFocus
                          autoComplete="off"
                          type="text"
                          aria-autocomplete="list"
                          aria-controls="autocomplete-list"
                          className={cn(
                            "outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                            form.getValues("nombre_completo").length > 0 &&
                              filteredNames.length > 0 &&
                              "rounded-b-none border-b-0",
                          )}
                          {...field}
                        />
                        {form.getValues("nombre_completo").length > 0 &&
                          filteredNames.length > 0 && (
                            <ul
                              className="w-full rounded-b-md border border-input bg-background p-0.5"
                              id="autocomplete-list"
                              role="listbox"
                            >
                              {filteredNames.map((name) => (
                                <li
                                  className="flex items-center rounded-sm px-3 py-0.5 hover:bg-muted-foreground"
                                  key={name}
                                  onClick={() => {
                                    form.setValue("nombre_completo", name)
                                  }}
                                >
                                  {name}
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
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
                  <FormItem>
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
                name="cedula"
                render={({ field }) => (
                  <FormItem>
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
                name="fecha_nacimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value="plan">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
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
                  <FormItem>
                    <FormLabel>Fecha de finalización</FormLabel>
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
                  <FormItem>
                    <FormLabel>Peso Kilogramos {"(opcional)"}</FormLabel>
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
                  <FormItem>
                    <FormLabel>Estatura Centimetros {"(opcional)"}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value="pago">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="tipoDePago"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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
                            {`${tipoDePlan.tipo} - ${tipoDePlan.costo} bs - ${formatDays(tipoDePlan.dias)}`}
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
                  <FormItem>
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
                        <SelectItem value="unassigned">
                          Sin descuento
                        </SelectItem>
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
                <div className="my-2 text-xl font-semibold">
                  {`Total a pagar: ${costoDelPlan} - ${descuentoPorcentaje}% = ${costoDelPlan * (1 - descuentoPorcentaje / 100)} bs`}
                </div>
              )}
              <div className="flex w-full items-center justify-end">
                <Button disabled={isPending} type="submit">
                  Create
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
