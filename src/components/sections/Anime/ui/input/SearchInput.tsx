"use client";

import { useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { Input, InputProps, Kbd, Spinner } from "@heroui/react";
import { cn } from "@/utils/helpers";
import { useHotkeys } from "@mantine/hooks";
import { useRouter } from "@bprogress/next";
import { usePathname } from "next/navigation";

interface SearchInputProps extends InputProps {
  isLoading?: boolean;
}

const SearchInput = ({
  value,
  onChange,
  className,
  autoFocus,
  placeholder = "Search...",
  isLoading,
  isDisabled,
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const pathName = usePathname();

  useHotkeys([
    [
      "ctrl+K",
      () => {
        if (pathName !== "/search") {
          router.push("/search");
        } else {
          inputRef.current?.focus();
        }
      },
      { preventDefault: true },
    ],
  ]);

  return (
    <Input
      ref={inputRef}
      isDisabled={isDisabled}
      autoComplete="off"
      autoFocus={autoFocus}
      className={cn(className, "w-full")}
      placeholder={placeholder}
      value={value}
      radius="full"
      onChange={onChange}
      classNames={{
        inputWrapper: "bg-secondary-background",
        input: "text-sm",
      }}
      aria-label="Search"
      type="search"
      labelPlacement="outside"
      endContent={<Kbd className="hidden md:inline-block">CTRL+K</Kbd>}
      startContent={
        <div className="pointer-events-none flex flex-shrink-0 items-center pr-1 text-default-400">
          {isLoading ? <Spinner color="default" size="sm" /> : <FaSearch />}
        </div>
      }
    />
  );
};

export default SearchInput;
