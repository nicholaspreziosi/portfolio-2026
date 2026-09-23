"use client";

import { useLayoutEffect } from "react";
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/ui/shared/components/avatar";
import { Badge } from "@/ui/shared/components/badge";
import { Button } from "@/ui/shared/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/ui/shared/components/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/shared/components/command";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/ui/shared/components/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/shared/components/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/ui/shared/components/field";
import { Input } from "@/ui/shared/components/input";
import { Label } from "@/ui/shared/components/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/shared/components/popover";
import { Progress } from "@/ui/shared/components/progress";
import { ScrollArea } from "@/ui/shared/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/shared/components/select";
import { Separator } from "@/ui/shared/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/shared/components/sheet";
import { Skeleton } from "@/ui/shared/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/shared/components/tabs";
import { Textarea } from "@/ui/shared/components/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/shared/components/tooltip";

function KeepPageScroll() {
  useLayoutEffect(() => {
    const root = document.querySelector("[cmdk-root]");
    root?.querySelectorAll<HTMLElement>("[cmdk-item], [cmdk-group-heading]").forEach((item) => {
      item.scrollIntoView = () => {};
    });
  }, []);

  return null;
}

export function ComponentShowcase() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-24">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Components</h2>
        <p className="text-sm text-neutral-500">Stock shadcn/ui, before customization.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Button</CardTitle>
            <CardDescription>Gradient, secondary, and the stock variants.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Button variant="gradient">
              Gradient
              <ArrowDownIcon data-icon="inline-end" />
            </Button>
            <Button variant="secondary">
              Secondary
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button>
              Default
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="outline">
              Outline
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button variant="ghost">
              Ghost
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badge and avatar</CardTitle>
            <CardDescription>Status chips and a fallback avatar.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Avatar>
              <AvatarFallback>NP</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overlays</CardTitle>
            <CardDescription>Tooltip, popover, dropdown, sheet, and drawer.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Tooltip</Button>
              </TooltipTrigger>
              <TooltipContent>A short hint</TooltipContent>
            </Tooltip>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <p className="text-sm">Popover content sits above the page.</p>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet</SheetTitle>
                  <SheetDescription>A panel from the edge of the screen.</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline">Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer</DrawerTitle>
                  <DrawerDescription>A panel that slides up from the bottom.</DrawerDescription>
                </DrawerHeader>
              </DrawerContent>
            </Drawer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Toast and progress</CardTitle>
            <CardDescription>Sonner toast and a progress bar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" onClick={() => toast("Saved")}>
              Show toast
            </Button>
            <Progress value={60} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Form</CardTitle>
            <CardDescription>Field, label, input, textarea, and select.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4 md:grid-cols-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="showcase-name">Name</FieldLabel>
                  <Input id="showcase-name" placeholder="Nick Preziosi" />
                </Field>
                <Field>
                  <Label htmlFor="showcase-email">Email</Label>
                  <Input id="showcase-email" type="email" placeholder="nick@example.com" />
                </Field>
              </FieldGroup>
              <Field>
                <FieldLabel>Project type</FieldLabel>
                <Select defaultValue="product">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="showcase-note">Note</FieldLabel>
                <Textarea id="showcase-note" placeholder="A short note" />
              </Field>
              <Button type="submit" className="w-fit">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabs and separator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="work">
              <TabsList>
                <TabsTrigger value="work">Work</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              <TabsContent value="work" className="text-sm">
                Selected work
              </TabsContent>
              <TabsContent value="about" className="text-sm">
                About the practice
              </TabsContent>
            </Tabs>
            <Separator />
            <p className="text-sm text-neutral-500">Content below the separator.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skeleton and scroll area</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <ScrollArea className="h-28 rounded-md border">
              <ul className="space-y-2 p-3 text-sm">
                {["Work", "About", "Contact", "Process", "Writing", "Notes"].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Command</CardTitle>
            <CardDescription>A filterable list.</CardDescription>
          </CardHeader>
          <CardContent>
            <Command className="max-w-sm rounded-lg border">
              <KeepPageScroll />
              <CommandInput placeholder="Search pages" />
              <CommandList>
                <CommandEmpty>No results.</CommandEmpty>
                <CommandGroup heading="Pages">
                  <CommandItem>Work</CommandItem>
                  <CommandItem>About</CommandItem>
                  <CommandItem>Contact</CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
