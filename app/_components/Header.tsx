// components/Header.tsx

import { Bot } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header = ({ title = "AI Assistant" }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 border-b bg-white">
      <div className="flex items-center space-x-2 max-w-3xl mx-auto w-full">
        <Bot className="w-8 h-8 text-blue-500" />
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </header>
  );
};

export default Header;