import React from "react";
import { Widget } from "./App";
type Props = {
  currentWidget: Widget;
  setCurrentWidget: React.Dispatch<React.SetStateAction<Widget>>;
};
export type WidgetType =
  | "text"
  | "button"
  | "label"
  | "radio"
  | "password"
  | "email"
  | "phone";
function SiderComponent({ currentWidget, setCurrentWidget }: Props) {
  const handleOnDrag = (e: React.DragEvent, widgetType: WidgetType) => {
    e.dataTransfer.setData("widgetType", widgetType);
    e.dataTransfer.setData("widgetName", currentWidget.name || "Unnamed Field");
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
  return (
    <div>
      <div className="space-y-4">
        <div className="p-4 bg-red-200">
          <label className="block">Choose Widget Type:</label>
          <select
            className="border px-2 py-1 w-full"
            value={currentWidget.type}
            onChange={(e) =>
              setCurrentWidget((prev) => ({
                ...prev,
                type: e.target.value as WidgetType,
              }))
            }
          >
            <option value="label">Label</option>
            <option value="text">Text Input</option>
            <option value="password">Password</option>
            <option value="radio">Radio</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="button">Button</option>
          </select>
          {currentWidget.type != "email" && (
            <div>
              <label className="block mt-2">Widget Name:</label>
              <input
                type="text"
                className="border px-2 py-1 w-full"
                placeholder="Enter field name"
                value={currentWidget.name}
                onChange={(e) =>
                  setCurrentWidget((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
          )}
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
    </div>
  );
}

export default SiderComponent;
