"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AI_MODELS = [
  {
    modelName: "gemini-2.5-flash",
    ModelTitle: "Gemini 2.5 Flash",
  },
  {
    modelName: "gemini-2.5-flash-lite",
    ModelTitle: "Gemini 2.5 Flash Lite",
  },
  {
    modelName: "gemini-3-flash",
    ModelTitle: "Gemini 3 Flash",
  },
  {
    modelName: "gemini-3.1-flash",
    ModelTitle: "Gemini 3.1 Flash",
  },
  {
    modelName: "gemini-3.1-flash-lite",
    ModelTitle: "Gemini 3.1 Flash Lite",
  },
  {
    modelName: "gemini-3.5-flash",
    ModelTitle: "Gemini 3.5 Flash",
  },
];

const DEFAULT_MODEL = "gemini-3.1-flash-lite";

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full md:max-w-58">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent position="popper" className="w-full">
        <SelectGroup>
          <SelectLabel>Models</SelectLabel>
          {AI_MODELS.map((model) => (
            <SelectItem key={model.modelName} value={model.modelName}>
              {model.ModelTitle}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export { AI_MODELS, DEFAULT_MODEL };