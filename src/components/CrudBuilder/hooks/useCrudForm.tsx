import React, { useState } from 'react';
import { CrudSchema } from '../schemaBuilder/crudSchema';

// type UseCrudFormInput = {
  
// };

type useCrudFormOutput = {
  erros: any;
  register: any;
  handleSubmit: any;
  setValue: any;
  getValue: any;
  watch: any;
}

export function useCrudForm<T extends CrudSchema<T>>(schema: CrudSchema<T>) {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});

  function register(field: string){
    const ref = React.useRef();
    return {
      ref,
      name: field,
      // onChange: (e: any) => {
      //   setValues((prev) => ({ ...prev, [field]: e.target.value }));
      // },
    }
  }

  function setValue(field: string, value: any){
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  

  function handleSubmit(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    console.log(values);
  }

  return <div>useCrudForm</div>;
}
