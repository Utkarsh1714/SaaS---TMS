// RoleSelect.jsx
import CreatableSelect from 'react-select/creatable';

const roleOptions = [
  { value: 'Manager', label: 'Manager' },
  { value: 'Team Leader', label: 'Team Leader' },
  { value: 'Employee', label: 'Employee' },
];

const customStyles = {
  control: (provided) => ({
    ...provided,
    padding: '4px',
    borderColor: '#D1D5DB',
    boxShadow: 'none',
    '&:hover': { borderColor: '#D1D5DB' },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#FEF08A',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: '#92400E',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: '#92400E',
    ':hover': {
      backgroundColor: '#FCD34D',
      color: '#78350F',
    },
  }),
};

export default function RoleSelect({ selectedRoles, setSelectedRoles }) {
  return (
    <label className="block text-left mt-4 w-full">
      <span className="text-gray-700">Role(s)</span>
      <CreatableSelect
        isMulti={false}
        options={roleOptions}
        value={selectedRoles}
        onChange={setSelectedRoles}
        styles={customStyles}
        placeholder="Select or type your roles"
        className="mt-1"
      />
    </label>
  );
}
