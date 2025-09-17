import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from "@/components/ui/theme-provider";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-4">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}