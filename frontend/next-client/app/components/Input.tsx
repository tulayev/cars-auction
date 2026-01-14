import { HelperText, Label, TextInput } from 'flowbite-react';
import { useController, UseControllerProps } from 'react-hook-form';

interface Props extends UseControllerProps {
  label: string;
  type?: string;
  showLabel?: boolean;
};

export default function Input(props: Props) {
  const {field, fieldState} = useController({...props});

  return (
    <div className="mb-3 block">
      {props.showLabel && (
        <div className="mb-2 block">
          <Label htmlFor={field.name}>{props.label}</Label>
        </div>
      )}
      <TextInput 
        {...props}
        {...field}
        type={props.type || 'text'}
        value={field.value || ''}
        placeholder={props.label}
        color={fieldState?.error ? 'failure' : !fieldState.isDirty ? '' : 'success'}
      />
      <HelperText color="failure">
        {fieldState.error?.message}
      </HelperText>
    </div>
  )
}
