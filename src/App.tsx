import { useState } from "react";
import "./index.css";
import { z } from "zod";
import SiderComponent from "./SiderComponent";
import { WidgetType } from "./SiderComponent";
import { createValidationSchema } from "./component/validation";
import RenderWidget from "./component/Widget";
export interface Widget {
  id: number;
  type: WidgetType;
  name: string;
  options: string[]; // For radio options
}

function App() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [toggle, setToggle] = useState(false);
  const [currentWidget, setCurrentWidget] = useState<Widget>({
    id: 0,
    type: "text",
    name: "",
    options: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
          options: [...currentWidget.options],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const schema = createValidationSchema(widgets);

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

  const previewForm = () => {
    return (
      <form className="space-y-2" onSubmit={handleSubmit}>
        {widgets.map((widget) => (
          <RenderWidget
            widget={widget}
            handleInputChange={handleInputChange}
            errors={errors}
          />
        ))}
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
      <SiderComponent
        setCurrentWidget={setCurrentWidget}
        currentWidget={currentWidget}
      />
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
          onClick={() => {
            setWidgets([]);
            setFormData({});
            setErrors({});
          }}
          className="bg-gray-200 p-4 m-1 hover:bg-red-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default App;
