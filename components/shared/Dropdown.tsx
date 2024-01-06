import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ICategory } from "@/lib/database/models/category.models";
import { FC, PropsWithChildren } from "react";

type DropdownProps = {
  value?: string;
  onChange?: () => void;
  placeholder?: string;
  options: ICategory[];
} & PropsWithChildren;

const Dropdown: FC<DropdownProps> = (props) => {
  const { children, onChange, value, placeholder, options } = props;

  return (
    <Select onValueChange={onChange} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.length > 0 &&
          options.map((option) => (
            <SelectItem
              key={option._id}
              value={option._id}
              className="select-item p-regular-14"
            >
              {option.name}
            </SelectItem>
          ))}

        {children}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
