"use client";
import { useMemo } from "react";
import Select, { SingleValue } from "react-select";

type Props = {
  onChange: (value?: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
};

export const SelectRoom = ({
  value,
  onChange,
  disabled,
  options = [],
  placeholder,
}: Props) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);
  return (
    <Select
      placeholder={placeholder}
      className="text-sm h-10 dark:text-black"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#16a34a",
          ":hover": {
            borderColor: "#16a34a",
          },
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      isDisabled={disabled}
    />
  );
};
