import { useState } from "react";
import "./index.css";
import { z } from "zod";
type WidgetType = "text" | "button" | "label" | "radio" | "password";

interface Widget {
  id: number;
  type: WidgetType;
  name: string;
  options?: string[]; // For radio options
}

function App() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [toggle, setToggle] = useState(false);
  const [currentWidget, setCurrentWidget] = useState<{
    type: WidgetType;
    name: string;
    options: string[];
  }>({ type: "text", name: "", options: [] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createValidationSchema = () => {
    const schema = z.object(
      widgets.reduce((acc, widget) => {
        switch (widget.type) {
          case "text":
            acc[widget.name] = z
              .string()
              .min(4, `${widget.name} must be atleast 4 character`)
              .nonempty(`${widget.name} cannot be empty`);
            break;
          case "password":
            acc[widget.name] = z
              .string()
              .min(8, `${widget.name} must be atleast 8 character`)
              .nonempty(`${widget.name} cannot be empty`);
            break;
          case "radio":
            acc[widget.name] = z
              .string()
              .refine(
                (val) => widget.options?.includes(val),
                `${widget.name} must be one of the provided options`
              );
            break;
          default:
            break;
        }
        return acc;
      }, {} as Record<string, z.ZodTypeAny>)
    );
    return schema;
  };

  const handleOnDrag = (e: React.DragEvent, widgetType: WidgetType) => {
    e.dataTransfer.setData("widgetType", widgetType);
    e.dataTransfer.setData("widgetName", currentWidget.name || "Unnamed Field");
  };

  const handleOnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const widgetType = e.dataTransfer.getData("widgetType") as WidgetType;
    const widgetName = e.dataTransfer.getData("widgetName");

    if (widgetType) {
      setWidgets((prevWidgets) => [
        ...prevWidgets,
        {
          id: prevWidgets.length + 1,
          type: widgetType,
          name: widgetName,
          options:
            currentWidget.options.length > 0
              ? [...currentWidget.options]
              : undefined,
        },
      ]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddOption = () => {
    setCurrentWidget((prev) => ({
      ...prev,
      options: [...prev.options, `Option ${prev.options.length + 1}`],
    }));
  };

  const handleOptionChange = (index: number, value: string) => {
    setCurrentWidget((prev) => {
      const updatedOptions = [...prev.options];
      updatedOptions[index] = value;
      return { ...prev, options: updatedOptions };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const schema = createValidationSchema();

    try {
      schema.parse(formData); // Validate formData
      alert("Form submitted successfully!");
      setErrors({}); // Clear errors if validation succeeds
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "text":
        return (
          <label key={widget.id} className="block my-2 ">
            {widget.name}:{" "}
            <div className="mx-8 flex flex-col max-w-[200px] ">
              <input
                type="text"
                name={widget.name}
                className="border px-2 py-1"
                onChange={(e) => handleInputChange(widget.name, e.target.value)}
              />
              {errors[widget.name] && (
                <p className="text-red-500 text-sm capitalize   ">
                  !!{errors[widget.name]}!!
                </p>
              )}
            </div>
          </label>
        );
      case "password":
        return (
          <label key={widget.id} className="block my-2 ">
            {widget.name}:{" "}
            <div className="mx-8 flex flex-col max-w-[200px] ">
              <input
                type="password"
                name={widget.name}
                className="border px-2 py-1"
                onChange={(e) => handleInputChange(widget.name, e.target.value)}
              />
              {errors[widget.name] && (
                <p className="text-red-500 text-sm">{errors[widget.name]}</p>
              )}
            </div>
          </label>
        );
      case "radio":
        return (
          <div key={widget.id} className="block my-2">
            <p>{widget.name}:</p>
            {widget.options?.map((option, index) => (
              <label key={index} className="mr-4">
                <input
                  type="radio"
                  name={widget.name}
                  value={option}
                  onChange={(e) =>
                    handleInputChange(widget.name, e.target.value)
                  }
                />
                {option}
              </label>
            ))}
            {errors[widget.name] && (
              <p className="text-red-500 text-sm">{errors[widget.name]}</p>
            )}
          </div>
        );
      case "button":
        return (
          <button
            key={widget.id}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 my-2"
          >
            Submit
          </button>
        );
      case "label":
        return (
          <div key={widget.id} className="my-2 text-gray-800">
            {widget.name}
          </div>
        );
      default:
        return null;
    }
  };
  const previewForm = () => {
    return (
      <form className="space-y-2" onSubmit={handleSubmit}>
        {widgets.map((widget) => renderWidget(widget))}
      </form>
    );
  };
  if (toggle) {
    return (
      <>
        <div className="flex flex-col ">
          <button
            onClick={() => setToggle(!toggle)}
            className="bg-gray-200 p-4 m-1 hover:bg-red-300"
          >
            Back to create form
          </button>
          <div className="flex bg-gray-300 m-1 px-2">
            {previewForm()}
            {widgets.length == 0 && (
              <p className="text-red-500 text-center w-full text-lg ">
                No form created{" "}
              </p>
            )}
          </div>
        </div>
      </>
    );
  }
  /* const validationSchema = createValidationSchema(widgets);
const jsonSchema = zodToJsonSchema(validationSchema); */

  return (
    <div className="flex gap-4 p-4">
      <div className="space-y-4">
        <div className="p-4 bg-red-200">
          <label className="block">Choose Widget Type:</label>
          <select
            className="border px-2 py-1 w-full"
            onChange={(e) =>
              setCurrentWidget((prev) => ({
                ...prev,
                type: e.target.value as WidgetType,
              }))
            }
          >
            <option value="text">Text Input</option>
            <option value="password">Password</option>
            <option value="radio">Radio</option>
            <option value="label">Label</option>
            <option value="button">Button</option>
          </select>
          <label className="block mt-2">Widget Name:</label>
          <input
            type="text"
            className="border px-2 py-1 w-full"
            placeholder="Enter field name"
            value={currentWidget.name}
            onChange={(e) =>
              setCurrentWidget((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          {currentWidget.type === "radio" && (
            <div>
              <p className="mt-2">Radio Options:</p>
              {currentWidget.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  className="border px-2 py-1 w-full mt-1"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
              ))}
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 mt-2"
                onClick={handleAddOption}
              >
                Add Option
              </button>
            </div>
          )}

          <div
            className="mt-4 bg-blue-500 text-white text-center py-2 cursor-pointer"
            draggable
            onDragStart={(e) =>
              handleOnDrag(e, currentWidget.type as WidgetType)
            }
          >
            Drag Me
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <button
          onClick={() => setToggle(!toggle)}
          className="bg-gray-200 p-4 m-1 hover:bg-red-300"
        >
          Preview
        </button>
        <div
          className="flex-1 p-4 bg-gray-400 h-64"
          onDrop={handleOnDrop}
          onDragOver={handleDragOver}
        >
          {previewForm()}
        </div>
        <button
          onClick={() => setWidgets([])}
          className="bg-gray-200 p-4 m-1 hover:bg-red-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
