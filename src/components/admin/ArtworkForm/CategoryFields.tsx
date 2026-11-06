import React from 'react';
import type { CategoryDefinition, CategoryDetails } from '../../../types/artwork';
import { describedBy, FormField } from '../../common/FormField';
import { Input } from '../../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/Select';
import { Switch } from '../../ui/Switch';
import { Textarea } from '../../ui/Textarea';

/** Renders the configurable, category-specific fields defined in data/categories. */
export function CategoryFields({
  definition,
  details,
  onChange




}: {definition: CategoryDefinition;details: CategoryDetails;onChange: (key: string, value: string | boolean) => void;}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {definition.fields.map((field) => {
        const id = `af-detail-${field.key}`;
        const value = details[field.key];
        if (field.type === 'boolean') {
          return (
            <div key={field.key} className="flex items-center justify-between gap-4 rounded-sm border border-border p-3 sm:col-span-2">
              <label htmlFor={id} className="text-sm">
                {field.label}
                {field.helpText && <span className="block text-xs text-muted-foreground">{field.helpText}</span>}
              </label>
              <Switch id={id} checked={value === true} onCheckedChange={(v) => onChange(field.key, v)} />
            </div>);

        }
        return (
          <FormField
            key={field.key}
            id={id}
            label={field.label}
            optional
            hint={field.helpText}
            className={field.type === 'textarea' ? 'sm:col-span-2' : undefined}>
            
            {field.type === 'textarea' ?
            <Textarea
              id={id}
              rows={3}
              value={typeof value === 'string' ? value : ''}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.key, e.target.value)}
              aria-describedby={describedBy(id, undefined, field.helpText)} /> :

            field.type === 'select' ?
            <Select value={typeof value === 'string' && value ? value : undefined} onValueChange={(v) => onChange(field.key, v)}>
                <SelectTrigger id={id} className="h-10 w-full" aria-describedby={describedBy(id, undefined, field.helpText)}>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((o) =>
                <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                )}
                </SelectContent>
              </Select> :

            <Input
              id={id}
              className="h-10"
              value={typeof value === 'string' ? value : ''}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.key, e.target.value)}
              aria-describedby={describedBy(id, undefined, field.helpText)} />

            }
          </FormField>);

      })}
    </div>);

}