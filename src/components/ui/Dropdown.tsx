export default function Dropdown({
  className,
  name,
  label,
  options,
  onChange,
  defaultValue,
}: {
  className: string;
  name: string;
  label: string;
  options: { label: string; value: string }[];
  onChange?: (e: any) => void;
  defaultValue: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium leading-6 text-black dark:text-white"
      >
        {label}
      </label>
      <div className="mt-2">
        <select
          id={name}
          name={name}
          className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
          onChange={onChange}
          value={defaultValue}
        >
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
