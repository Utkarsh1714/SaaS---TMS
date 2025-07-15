// DepartmentSelect.jsx
import CreatableSelect from "react-select/creatable";

const departmentOptions = [
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "HR", label: "HR" },
  { value: "Finance", label: "Finance" },
  { value: "IT", label: "IT" },
  { value: "Operations", label: "Operations" },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    padding: "4px",
    borderColor: "#D1D5DB", // Tailwind gray-300
    boxShadow: "none",
    "&:hover": { borderColor: "#D1D5DB" },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "#FEF08A", // Tailwind yellow-200
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "#92400E", // Tailwind yellow-800
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "#92400E",
    ":hover": {
      backgroundColor: "#FCD34D", // yellow-300
      color: "#78350F",
    },
  }),
};

export default function DepartmentSelect({
  selectedDepartments,
  setSelectedDepartments,
  isMulti = false,
}) {
  return (
    <label className="block text-left mt-4 w-full">
      <span className="text-gray-700">Department(s)</span>
      <CreatableSelect
        isMulti={isMulti}
        options={departmentOptions}
        value={selectedDepartments}
        onChange={setSelectedDepartments}
        styles={customStyles}
        placeholder="Select or type your departments"
        className="mt-1"
      />
    </label>
  );
}
