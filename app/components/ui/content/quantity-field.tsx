"use client";

import clsx from "clsx";
import { Checkbox } from "../checkbox";
import { Field, FieldContent, FieldLabel } from "../field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "../input-group";
import { Label } from "../label";
import { useState } from "react";

type QuantityFieldProps = {
  value?: number | null;
};

export function QuantityField({ value }: QuantityFieldProps) {
  const [isChecked, setIsChecked] = useState(value === null);

  return (
    <div className="flex gap-4 items-end">
      <Field aria-disabled={isChecked} className={clsx(isChecked && "pointer-events-none opacity-60")}>
        <Label htmlFor="quantity">Количество</Label>
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>шт.</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            id="quantity"
            name="quantity"
            placeholder="0"
            required={!isChecked}
            defaultValue={(typeof value === "number" && value) || ""}
          />
        </InputGroup>
      </Field>

      <Field orientation="horizontal" className="py-2">
        <Checkbox
          id="quantity-checkbox"
          name="countless"
          checked={isChecked}
          onCheckedChange={() => setIsChecked(prev => !prev)}
        />
        <FieldContent>
          <FieldLabel htmlFor="quantity-checkbox">Неограничено</FieldLabel>
        </FieldContent>
      </Field>
    </div>
  );
}
