import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const FormCreate = () => {
  return (
    <Tabs defaultValue="customer" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="customer">Customer</TabsTrigger>
        <TabsTrigger value="plan">Plan</TabsTrigger>
        <TabsTrigger value="pago">Pago</TabsTrigger>
      </TabsList>
      <TabsContent value="customer">
        <div>
          <div>
            <h2>customer</h2>
            <div>
              Make changes to your account here. Click save when youre done.
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </div>
          <div>
            <Button>Save changes</Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="plan">
        <div>
          <div>
            <h2>Plan</h2>
            <div>
              Change your password here. After saving, youll be logged out.
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </div>
          <div>
            <Button>Save password</Button>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="pago">
        <div>
          <div>
            <h2>Pago</h2>
            <div>
              Change your password here. After saving, youll be logged out.
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </div>
          <div>
            <Button>Save password</Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
