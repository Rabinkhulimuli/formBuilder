import { Widget } from "../App";

type RenderWidgetType = {
  widget: Widget;
  handleInputChange: (name: string, value: string) => void;
  errors: Record<string, string>;
};

export default function RenderWidget({
  widget,
  handleInputChange,
  errors,
}: RenderWidgetType) {
  switch (widget.type) {
    case "label":
      return (
        <div key={widget.id} className="my-2 text-gray-800">
          {widget.name}
        </div>
      );
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
              <p className="text-red-500 text-sm capitalize">
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
    
    case "email":
      return (
        <label key={widget.id} className="block my-2 ">
          Email
          <div className="mx-8 flex flex-col max-w-[200px] ">
            <input
              type="email"
              name="email"
              className="border px-2 py-1"
              onChange={(e) =>
                handleInputChange(widget.name, e.target.value)
              }
            />
            {errors["email"] && (
              <p className="text-red-500 text-sm">{errors["email"]}</p>
            )}
          </div>
        </label>
      );
    case "phone":
      return (
        <label key={widget.id} className="block my-2 ">
          {widget.name}:{" "}
          <div className="mx-8 flex flex-col max-w-[200px] ">
            <input
              type="tel"
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
    default:
      return null;
  }
}
