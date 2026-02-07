export default function Input({
  label,
  type = "text",
  placeholder,
  name,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  name?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm text-slate-300">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-2 outline-none focus:border-blue-500"
      />
    </div>
  );
}