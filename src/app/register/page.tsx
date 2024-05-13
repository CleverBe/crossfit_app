"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  RegisterUserInputClient,
  registerUserSchemaClient,
} from "@/schemas/auth"
import { signUpUserFn } from "@/services/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const Page = () => {
  const router = useRouter()

  const form = useForm<RegisterUserInputClient>({
    resolver: zodResolver(registerUserSchemaClient),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      matchPwd: "",
    },
  })

  const onSubmit = async (values: RegisterUserInputClient) => {
    try {
      await signUpUserFn(values)

      toast.success("Account created")
      router.push("/login")
    } catch (err) {
      toast.error("Something went wrong")
    }
  }

  return (
    <section className="flex h-full items-center justify-center pt-10">
      <div className="w-full max-w-md rounded-md border border-gray-200 bg-gray-50 p-5 dark:border-gray-600 dark:bg-gray-800">
        <h1 className="mb-5 text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
          Create your Account
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jason" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="jason@gmail.com"
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
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mypassword"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="matchPwd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mypassword"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting}
              className="w-full"
              variant="default"
            >
              Sign Up
            </Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already registered?{" "}
              <Link
                href="/login"
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                Login here
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default Page
