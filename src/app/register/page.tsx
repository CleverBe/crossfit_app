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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="flex h-[calc(100vh-210px)] items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Create your Account</CardTitle>
        </CardHeader>
        <CardContent>
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
                      <Input autoFocus placeholder="Jason" {...field} />
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
