
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { cn } from "../lib/utils";
import { Check, ChevronDown, X } from "lucide-react";

// --- Button ---
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"; size?: "default" | "sm" | "lg" | "icon" }>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };
    return (
      <button
        className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Input ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        style={{ 
          backgroundColor: '#ffffff', 
          color: '#000000', 
          height: '40px', 
          opacity: 1,
          borderColor: '#e2e8f0'
        }}
        className={cn(
          "flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "!bg-white !text-black !placeholder-gray-500", // NUCLEAR OPTION: Force white bg and black text
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Card ---
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
));
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
));
export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));

// --- Badge ---
export const Badge = ({ className, variant = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />
  );
};

// --- Textarea ---
export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return (
    <textarea
      style={{ 
        backgroundColor: '#ffffff', 
        color: '#000000', 
        opacity: 1,
        borderColor: '#e2e8f0'
      }}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "!bg-white !text-black !placeholder-gray-500", // NUCLEAR OPTION
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

// --- Label ---
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
));

// --- Tabs ---
const TabsContext = createContext<{ value: string; onValueChange: (value: string) => void } | null>(null);

export const Tabs = ({ className, value, onValueChange, children }: any) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ className, children }: any) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, className }: any) => {
  const context = useContext(TabsContext);
  if (!context) return null;
  const isActive = context.value === value;
  
  return (
    <button
      type="button"
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
};

// --- Select ---
const SelectContext = createContext<{ 
  value: any; 
  onValueChange: (val: any) => void; 
  open: boolean; 
  setOpen: (open: boolean) => void;
} | null>(null);

export const Select = ({ value, onValueChange, children }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ className, children }: any) => {
  const context = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => context?.setOpen(!context.open)}
      className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-black ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
};

export const SelectValue = ({ placeholder, children }: any) => {
  const context = useContext(SelectContext);
  return <span className="pointer-events-none block truncate">{children || context?.value || placeholder}</span>;
};

export const SelectContent = ({ children }: any) => {
  const context = useContext(SelectContext);
  if (!context?.open) return null;
  
  return (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={() => context.setOpen(false)} />
      <div className="absolute z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 w-full mt-1 max-h-64 overflow-y-auto bg-white">
        <div className="p-1">
          {children}
        </div>
      </div>
    </>
  );
};

export const SelectItem = ({ value, children, className }: any) => {
  const context = useContext(SelectContext);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        context?.onValueChange(value);
        context?.setOpen(false);
      }}
      className={cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer", className)}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {context?.value === value && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
};

// --- Popover ---
const PopoverContext = createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
} | null>(null);

export const Popover = ({ open, onOpenChange, children }: any) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : uncontrolledOpen;
  const handleOpenChange = isControlled ? onOpenChange : setUncontrolledOpen;

  return (
    <PopoverContext.Provider value={{ open: currentOpen, onOpenChange: handleOpenChange }}>
      <div className="relative inline-block w-full">{children}</div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({ asChild, children }: any) => {
  const context = useContext(PopoverContext);
  
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: (e: any) => {
      context?.onOpenChange(!context.open);
      if (child.props.onClick) child.props.onClick(e);
    }
  });
};

export const PopoverContent = ({ className, children, align = "start" }: any) => {
  const context = useContext(PopoverContext);
  if (!context?.open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[9998]" onClick={() => context.onOpenChange(false)} />
      <div className={cn(
        "absolute z-[9999] w-full rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95 mt-1 bg-white", 
        align === "end" ? "right-0" : "left-0",
        className
      )}>
        {children}
      </div>
    </>
  );
};

// --- Command ---
export const Command = ({ className, children }: any) => (
  <div className={cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground bg-white", className)}>
    {children}
  </div>
);

export const CommandInput = ({ className, ...props }: any) => (
  <div className="flex items-center border-b px-3">
    <input
      style={{ 
        backgroundColor: '#ffffff', 
        color: '#000000', 
        height: '40px', 
        opacity: 1,
        width: '100%',
        outline: 'none'
      }}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "!bg-white !text-black !placeholder-gray-500", // NUCLEAR OPTION
        className
      )}
      {...props}
    />
  </div>
);

export const CommandList = ({ className, children }: any) => (
  <div className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}>
    {children}
  </div>
);

export const CommandEmpty = (props: any) => (
  <div className="py-6 text-center text-sm" {...props} />
);

export const CommandGroup = ({ children }: any) => (
  <div className="overflow-hidden p-1 text-foreground">
    {children}
  </div>
);

export const CommandItem = ({ className, onSelect, children }: any) => (
  <div
    onClick={onSelect}
    className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer", className)}
  >
    {children}
  </div>
);
