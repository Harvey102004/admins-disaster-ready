import { FiSearch } from "react-icons/fi";

interface SearchProps {
  value: string;
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export default function SearchInput({
  value,
  onchange,
  placeholder,
}: SearchProps) {
  return (
    <div className="relative min-w-[300px]">
      <input
        type="search"
        onChange={onchange}
        value={value}
        placeholder={placeholder}
        className="search-input border-dark-blue/50 focus:border-dark-blue w-full rounded-full border px-10 py-4 pl-12 text-xs outline-none placeholder:text-xs"
      />
      <FiSearch className="text-dark-blue absolute top-1/2 left-7 -translate-1/2" />
    </div>
  );
}
