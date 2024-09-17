import { z } from "zod"
import { formatTimeAddZero, isPositiveNumber, isValidHour } from "./reusable"

export const getPlanStatsSchema = z.object({
  id: z.string(),
  back_squat: z.string(),
  bench_press: z.string(),
  press_strit: z.string(),
  clean: z.string(),
  front_squat: z.string(),
  push_press: z.string(),
  thuster: z.string(),
  dead_lift: z.string(),
  snatch: z.string(),
  squat: z.string(),
  sit_ups: z.string(),
  pushups: z.string(),
  su: z.string(),
  burpees: z.string(),
  wall_sit: z.string(),
  plank: z.string(),
  fourHundredMts: z.string(),
})

export type PlanStatsFromApi = z.infer<typeof getPlanStatsSchema>

export const updatePlanStatsSchema = z.object({
  back_squat: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  bench_press: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  press_strit: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  clean: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  front_squat: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  push_press: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  thuster: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  dead_lift: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  snatch: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  squat: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  sit_ups: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  pushups: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  su: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  burpees: z
    .string()
    .optional()
    .refine((val) => {
      if (val === "" || val === undefined) return true

      return isPositiveNumber(val)
    })
    .transform((val) => (val === "" ? undefined : val)),
  wall_sit: z
    .object({
      minutes: z
        .string()
        .optional()
        .refine((val) => {
          if (val === "" || val === undefined) return true

          return isValidHour(val)
        })
        .transform((val) =>
          val === ""
            ? undefined
            : typeof val === "string"
              ? formatTimeAddZero(val)
              : val,
        ),
      seconds: z
        .string()
        .optional()
        .refine((val) => {
          if (val === "" || val === undefined) return true

          return isValidHour(val)
        })
        .transform((val) => (val === "" ? undefined : val)),
    })
    .optional(),
  plank: z
    .object({
      minutes: z
        .string()
        .optional()
        .refine((val) => {
          if (val === "" || val === undefined) return true

          return isValidHour(val)
        })
        .transform((val) =>
          val === ""
            ? undefined
            : typeof val === "string"
              ? formatTimeAddZero(val)
              : val,
        ),
      seconds: z
        .string()
        .optional()
        .refine((val) => {
          if (val === "" || val === undefined) return true

          return isValidHour(val)
        })
        .transform((val) => (val === "" ? undefined : val)),
    })
    .optional(),
  fourHundredMts: z
    .object({
      minutes: z
        .string()
        .optional()
        .refine((val) => {
          if (val === "" || val === undefined) return true

          return isValidHour(val)
        })
        .transform((val) =>
          val === ""
            ? undefined
            : typeof val === "string"
              ? formatTimeAddZero(val)
              : val,
        ),
      seconds: z
        .string()
        .optional()
        .refine((val) => {
          if (val === "" || val === undefined) return true

          return isValidHour(val)
        })
        .transform((val) => (val === "" ? undefined : val)),
    })
    .optional(),
})

export type UpdatePlanStats = z.input<typeof updatePlanStatsSchema>
