interface LocationDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    type: 'country' | 'city';
  }
  
  export function LocationDropdown({ value, onChange, options, type }: LocationDropdownProps) {
    return (
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded-lg"
      >
        <option value="">{`Select ${type}...`}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }