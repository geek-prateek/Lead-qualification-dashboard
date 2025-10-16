import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Simplified sidebar components without external dependencies
const SidebarContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export function SidebarProvider({ children, ...props }: React.ComponentProps<"div">) {
  const [open, setOpen] = React.useState(true);
  
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
      {...props}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { open, setOpen } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("md:hidden", className)}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

export function SidebarHeader({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="flex h-16 shrink-0 items-center px-6" {...props}>
      {children}
    </div>
  );
}

export function SidebarContent({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto" {...props}>
      {children}
    </div>
  );
}

export function SidebarFooter({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="flex shrink-0 flex-col gap-2 p-4" {...props}>
      {children}
    </div>
  );
}

export function SidebarGroup({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="px-3 py-2" {...props}>
      {children}
    </div>
  );
}

export function SidebarGroupContent({ children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className="space-y-1" {...props}>
      {children}
    </div>
  );
}

export function SidebarMenu({ children, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul className="space-y-1" {...props}>
      {children}
    </ul>
  );
}

export function SidebarMenuItem({ children, ...props }: React.ComponentProps<"li">) {
  return (
    <li {...props}>
      {children}
    </li>
  );
}

const sidebarMenuButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
}

export function SidebarMenuButton({ 
  className, 
  variant, 
  size, 
  asChild = false, 
  ...props 
}: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(sidebarMenuButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}