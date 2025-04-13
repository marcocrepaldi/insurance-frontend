// src/app/(main)/quotes/hooks/useServiceFields.tsx
import { useFormContext } from "react-hook-form"
import { quoteServiceSchemas } from "../schemas/quoteServiceSchemas"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Fragment } from "react"

export function ServiceFields({ serviceType }: { serviceType: keyof typeof quoteServiceSchemas | null }) {
  const {
    register,
    formState: { errors },
  } = useFormContext()

  if (!serviceType || !(serviceType in quoteServiceSchemas)) return null

  const schema = quoteServiceSchemas[serviceType]
  const fields = Object.entries(schema.shape)
  const serviceDetailsErrors = (errors?.serviceDetails ?? {}) as Record<string, { message?: string }>

  return (
    <Fragment>
      {fields.map(([field]) => (
        <div key={field}>
          <Label>{field}</Label>
          <Input {...register(`serviceDetails.${field}`)} />
          {serviceDetailsErrors?.[field]?.message && (
            <p className="text-sm text-red-500">
              {String(serviceDetailsErrors[field].message)}
            </p>
          )}
        </div>
      ))}
    </Fragment>
  )
}