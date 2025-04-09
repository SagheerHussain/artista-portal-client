import { useState, useEffect } from "react";

const DynamicForm = ({ title, fields, initialValues, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialValues || {});

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    } else {
      const emptyFields = {};
      fields.forEach((field) => {
        emptyFields[field.name] = "";
      });
      setFormData(emptyFields);
    }
  }, [initialValues, fields]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div key={field.name} className="mb-2">
            <label className="block text-sm font-medium">{field.label}:</label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              >
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {initialValues ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicForm;
