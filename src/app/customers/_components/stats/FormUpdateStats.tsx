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
import { Skeleton } from "@/components/ui/skeleton"
import { handleGeneralErrors } from "@/lib/utils"
import { PlanFromApi } from "@/schemas/plan"
import { UpdatePlanStats, updatePlanStatsSchema } from "@/schemas/stats"
import { updateCustomerPlanStatsFn } from "@/services/customer"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface Props {
  plan: PlanFromApi
  onClose: () => void
}

export const FormUpdateStats = ({ plan, onClose }: Props) => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm<UpdatePlanStats>({
    resolver: zodResolver(updatePlanStatsSchema),
    values: {
      back_squat: plan.estadisticas.back_squat,
      bench_press: plan.estadisticas.bench_press,
      press_strit: plan.estadisticas.press_strit,
      clean: plan.estadisticas.clean,
      front_squat: plan.estadisticas.front_squat,
      push_press: plan.estadisticas.push_press,
      thuster: plan.estadisticas.thuster,
      dead_lift: plan.estadisticas.dead_lift,
      snatch: plan.estadisticas.snatch,
      squat: plan.estadisticas.squat,
      sit_ups: plan.estadisticas.sit_ups,
      pushups: plan.estadisticas.pushups,
      su: plan.estadisticas.su,
      burpees: plan.estadisticas.burpees,
      wall_sit: {
        minutes: plan.estadisticas.wall_sit.slice(0, 2),
        seconds: plan.estadisticas.wall_sit.slice(3, 5),
      },
      plank: {
        minutes: plan.estadisticas.plank.slice(0, 2),
        seconds: plan.estadisticas.plank.slice(3, 5),
      },
      fourHundredMts: {
        minutes: plan.estadisticas.fourHundredMts.slice(0, 2),
        seconds: plan.estadisticas.fourHundredMts.slice(3, 5),
      },
    },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: updateCustomerPlanStatsFn,
  })

  const onSubmit = async (values: UpdatePlanStats) => {
    mutate(
      { id: plan.id, ...values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["planes"] })
          form.reset()
          router.refresh()
          toast.success(`Datos actualizados.`)
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
        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://i.pinimg.com/originals/9c/03/18/9c031803079f20de203ac00a52edfbe5.gif"
            alt="back_squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="back_squat"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Back Squat (Kg)`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://i.pinimg.com/originals/77/d6/03/77d60369394fe80af1db02d91b558c70.gif"
            alt="back_squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="bench_press"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Bench Press (Kg)`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://fitnessprogramer.com/wp-content/uploads/2021/07/Barbell-Standing-Military-Press.gif"
            alt="back_squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="press_strit"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Press strit (Kg)`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://i.pinimg.com/originals/d2/e7/a8/d2e7a8e355e3f08175e3bd3295321bca.gif"
            alt="back_squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="clean"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Clean (Kg)`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://fitnessprogramer.com/wp-content/uploads/2021/06/front-squat.gif"
            alt="back_squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="front_squat"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Front Squat`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://fitnessprogramer.com/wp-content/uploads/2023/10/Dumbbell-Push-Press.gif"
            alt="back_squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="push_press"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Push Press (Kg)`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://fitnessprogramer.com/wp-content/uploads/2021/05/Kettlebell-Thruster.gif"
            alt="back_squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="thuster"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Thuster (Kg)`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://www.kettlebellkings.com/cdn/shop/articles/barbell-deadlift-movement.gif?v=1692228918"
            alt="back_squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="dead_lift"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Dead Lift (Kg)`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://i.pinimg.com/originals/b1/d1/9d/b1d19dc3b07cf95faf6bffff0f9aee58.gif"
            alt="back_squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="snatch"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Snatch (Kg)`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://i.pinimg.com/originals/6e/96/43/6e9643c4cc8664470cd8ca1e8e59e6fc.gif"
            alt="squat"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="squat"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Squat`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://fitnessprogramer.com/wp-content/uploads/2021/02/Sit-ups.gif"
            alt="sit_ups"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="sit_ups"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Sit Ups`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://fitnessprogramer.com/wp-content/uploads/2021/06/Push-Up-Plus.gif"
            alt="pushups"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="pushups"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Pushups`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://i.pinimg.com/originals/b1/08/36/b1083670d171f4e6b23780847b90e518.gif"
            alt="su"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="su"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`SU`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://i.pinimg.com/originals/f0/a3/da/f0a3da2890f6edf4c7b45845fa14e39c.gif"
            alt="burpees"
            className="size-16 rounded-md shadow-md"
          />
          <FormField
            control={form.control}
            name="burpees"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{`Burpees`}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://www.spotebi.com/wp-content/uploads/2015/05/wall-sit-exercise-illustration.gif"
            alt="wall_sit"
            className="size-16 rounded-md shadow-md"
          />
          <div>
            <FormLabel>{`Wall Sit`}</FormLabel>
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="wall_sit.minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Minutos"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wall_sit.seconds"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Segundos"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://fitnessvolt.com/wp-content/uploads/2023/08/How-to-Do-Weighted-Planks.gif"
            alt="plank"
            className="size-16 rounded-md shadow-md"
          />
          <div>
            <FormLabel>{`Plank`}</FormLabel>
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="plank.minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Minutos"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="plank.seconds"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Segundos"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="col-span-6 flex w-full items-center space-x-2">
          <img
            src="https://fitnessprogramer.com/wp-content/uploads/2021/07/Run.gif"
            alt="fourHundredMts"
            className="size-16 rounded-md shadow-md"
          />
          <div>
            <FormLabel>{`400 Metros`}</FormLabel>
            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name="fourHundredMts.minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Minutos"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fourHundredMts.seconds"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className="w-full"
                        placeholder="Segundos"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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

FormUpdateStats.Skeleton = function FormUpdateStatsSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-12 space-y-2">
        <Skeleton className="h-5 w-32 bg-neutral-200" />
        <Skeleton className="h-10 bg-neutral-200" />
      </div>

      <div className="col-span-12 flex items-center justify-end">
        <Skeleton className="h-10 w-32 bg-neutral-200" />
      </div>
    </div>
  )
}
