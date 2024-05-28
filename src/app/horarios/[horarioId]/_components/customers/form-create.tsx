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
import { createCustomerFn, getCustomersFn } from "@/services/customer"
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
import { useRef, useState } from "react"
import { useOnClickOutside } from "usehooks-ts"

interface Props {
  periodo: string
}

export const FormCreate = ({ periodo }: Props) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const ref = useRef(null)

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

  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomersFn,
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

  const handleClickOutside = () => {
    setSuggestions([])
  }

  useOnClickOutside(ref, handleClickOutside)

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

  const handleSuggestions = (value: string) => {
    const customersNames =
      customers?.map((customer) => customer.nombre_completo) ?? []

    if (value.length > 0) {
      const filteredSuggestions = customersNames.filter((suggestion) => {
        const suggestionLowerCase = suggestion.toLowerCase()
        const valueLowerCase = value.toLowerCase()

        return (
          suggestionLowerCase.includes(valueLowerCase) &&
          suggestionLowerCase !== valueLowerCase
        )
      })
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }

  const handleClickOnSuggestion = (name: string) => {
    setSuggestions([])

    const customerData = customers?.find(
      (customer) => customer.nombre_completo === name,
    )

    if (!customerData) return

    form.setValue("nombre_completo", customerData.nombre_completo)
    form.setValue("cedula", customerData.cedula)
    form.setValue("celular", customerData.celular)
    form.setValue("fecha_nacimiento", customerData.fecha_nacimiento)
    form.setValue("genero", customerData.genero)
    form.setValue("peso_cliente", customerData.peso ?? "")
    form.setValue("estatura", customerData.estatura ?? "")
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Tabs defaultValue="customer" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="customer"
              className={cn(errorOnCustomerTab && "text-red-400")}
            >
              Cliente
            </TabsTrigger>
            <TabsTrigger
              value="plan"
              className={cn(errorOnPlanTab && "text-red-400")}
            >
              Plan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="customer">
            <div className="grid grid-cols-12 gap-2">
              <FormField
                control={form.control}
                name="nombre_completo"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <div ref={ref}>
                        <Input
                          autoFocus
                          autoComplete="off"
                          type="text"
                          aria-autocomplete="list"
                          aria-controls="autocomplete-list"
                          className={cn(
                            "outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                            suggestions.length > 0 &&
                              "rounded-b-none border-b-0",
                          )}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value

                            handleSuggestions(value)

                            field.onChange(e)
                          }}
                        />
                        {suggestions.length > 0 && (
                          <ul
                            className="max-h-28 w-full overflow-y-auto rounded-b-md border border-input bg-background p-0.5"
                            id="autocomplete-list"
                            role="listbox"
                          >
                            {suggestions.map((name) => (
                              <li
                                className="flex items-center rounded-sm px-3 py-0.5 hover:bg-accent"
                                key={name}
                                onClick={() => handleClickOnSuggestion(name)}
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
                      <Input {...field} />
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
            </div>
          </TabsContent>
          <TabsContent value="plan">
            <div className="grid grid-cols-12 gap-2">
              <FormField
                control={form.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem className="col-span-6">
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
                  <FormItem className="col-span-6">
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
                <div className="col-span-12 py-1.5 text-xl font-semibold">
                  {`Total a pagar: ${costoDelPlan} - ${descuentoPorcentaje}% = ${costoDelPlan * (1 - descuentoPorcentaje / 100)} Bs`}
                </div>
              )}
              <div className="col-span-12 flex w-full items-center justify-end">
                <Button disabled={isPending} type="submit">
                  Registrar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  )
}
