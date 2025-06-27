"use client";

import { useState } from "react";
import { FaFacebook } from "react-icons/fa6";

interface TextInputProps {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  value?: string;
  onchange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}

export const TextInput = ({
  type,
  name,
  label,
  placeholder,
  icon,
  value,
  onchange,
}: TextInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="text-dark-blue">{icon}</div>
        <label htmlFor={name} className="text-xs">
          {label} *
        </label>
      </div>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onchange}
        placeholder={placeholder}
        autoComplete="off"
        className="border-dark-blue dark:bg-light-black w-[250px] rounded border p-3 text-sm outline-none placeholder:text-xs placeholder:text-gray-600 dark:border-gray-500/50"
      />
    </div>
  );
};

type FacebookInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FacebookInput = ({ value, onChange }: FacebookInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="text-dark-blue">
            <FaFacebook />
          </div>
          <label htmlFor="fbLink" className="text-xs">
            Facebook Link *
          </label>
        </div>
        <input
          type="url"
          name="facebook"
          id="fbLink"
          onChange={onChange}
          value={value}
          placeholder="https://www.facebook.com/@"
          pattern="https:\/\/www\.facebook\.com\/[a-zA-Z0-9\.]+"
          autoComplete="off"
          className="border-dark-blue dark:bg-light-black w-[250px] rounded border p-3 text-sm outline-none placeholder:text-xs placeholder:text-gray-600 dark:border-gray-500/50"
        />
      </div>
    </div>
  );
};
