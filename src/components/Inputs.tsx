"use client";

import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FiSearch } from "react-icons/fi";

type InputType = {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  classname?: string;
};

interface SearchProps {
  value: string;
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  classname?: string;
}

export const TextInput = ({
  label,
  icon,
  name,
  register,
  errors,
  placeholder,
  classname,
}: InputType) => {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-3 text-sm">
        <div className="text-dark-blue">{icon}</div>
        <p className="text-xs">{label}</p>
      </div>
      <input
        {...register(name)}
        type="text"
        autoComplete="off"
        className={`${errors[name] ? "border-red-500/50" : "focus:border-dark-blue border-dark-blue/50 dark:border-gray-500/30"} ${classname} w-full border px-4 py-3 text-sm outline-none placeholder:text-xs`}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="mt-1.5 text-xs text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export const NumberInput = ({
  label,
  icon,
  name,
  register,
  errors,
  placeholder,
}: InputType) => {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-3 text-sm">
        <div className="text-dark-blue">{icon}</div>
        <p className="text-xs">{label}</p>
      </div>
      <input
        {...register(name)}
        type="number"
        autoComplete="off"
        className={`${errors[name] ? "border-red-500/50" : "focus:border-dark-blue border-dark-blue/50 dark:border-gray-500/30"} w-full border px-4 py-3 text-sm outline-none placeholder:text-xs`}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="mt-1.5 text-xs text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export const TextAreaInput = ({
  label,
  icon,
  name,
  register,
  errors,
  placeholder,
  classname,
}: InputType) => {
  return (
    <div className="h-full w-full">
      <div className="mb-3 flex items-center gap-3 text-sm">
        <div className="text-dark-blue text-lg">{icon}</div>
        <p className="text-xs">{label}</p>
      </div>
      <textarea
        {...register(name)}
        className={`${errors[name] ? "border-red-500/50" : "focus:border-dark-blue border-dark-blue/50 dark:border-gray-500/30"} scrollBar h-[160px] w-full resize-none border px-4 py-3 text-xs leading-relaxed tracking-normal text-gray-800 outline-none placeholder:text-xs dark:text-gray-300 ${classname}`}
        placeholder={placeholder}
      ></textarea>
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name].message as string}
        </p>
      )}
    </div>
  );
};

export const DateTimeInput = ({
  label,
  icon,
  name,
  register,
  errors,
}: InputType) => {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-3 text-sm">
        <div className="text-dark-blue">{icon}</div>
        <p className="text-xs">{label}</p>
      </div>
      <input
        {...register(name)}
        type="datetime-local"
        autoComplete="off"
        className={`${errors[name] ? "border-red-500/50" : "focus:border-dark-blue border-dark-blue/50 dark:border-gray-500/30"} w-full border px-4 py-3 text-xs outline-none`}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name].message as string}
        </p>
      )}
    </div>
  );
};

export const FileInput = ({
  label,
  icon,
  name,
  register,
  errors,
}: InputType) => {
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center gap-3 text-sm">
        <div className="text-dark-blue">{icon}</div>
        <p className="text-xs">{label}</p>
      </div>

      <input
        type="file"
        autoComplete="off"
        {...register(name)}
        accept="image/png, image/jpeg"
        className={`${errors[name] ? "border-red-500/50" : "border-dark-blue/50 dark:border-gray-500/30"} file:bg-dark-blue/10 w-full border px-4 py-2 text-xs outline-none file:rounded-xs file:p-1 file:px-2 file:text-xs dark:file:bg-gray-800`}
      />
      {errors[name] && (
        <p className="mt-1 text-xs text-red-500">
          {errors[name].message as string}
        </p>
      )}
    </div>
  );
};

export const HiddenInput = ({ register, name }: InputType) => {
  return <input type="hidden" {...register(name)} />;
};

export const SearchInput = ({
  value,
  onchange,
  placeholder,
  classname,
}: SearchProps) => {
  return (
    <div className={`relative min-w-[300px] ${classname}`}>
      <input
        type="search"
        onChange={onchange}
        value={value}
        placeholder={placeholder}
        className={`search-input border-dark-blue/50 focus:border-dark-blue w-full rounded-full border px-10 py-3 pl-12 text-xs outline-none placeholder:text-xs`}
      />
      <FiSearch className="text-dark-blue absolute top-1/2 left-7 -translate-1/2" />
    </div>
  );
};
