import Example from "@/components/Example";
import { Counter } from "@/components/Counter";
import { Routes } from "@/models/types";

export const routers: Routes[] = [
  {
    href: "/",
    id: "home",
    name: "Home",
    element: <Counter />,
  },
  {
    href: "/example",
    id: "example",
    name: "Example",
    element: <Example />,
  },

  // Add other routes as needed
];
