import { z } from "zod";
import { Widget } from "../App";
export const createValidationSchema = (widgets: Widget[]) => {
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
        case "email":
          acc[widget.name] = z
            .string()
            .email(`${widget.name} must be a valid email address`);
          break;
        case "phone":
          acc[widget.name] = z
            .string()
            .refine(
              (val) => /^[0-9]{10,15}$/.test(val),
              `${widget.name} must be a valid phone number with 10 to 15 digits`
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
