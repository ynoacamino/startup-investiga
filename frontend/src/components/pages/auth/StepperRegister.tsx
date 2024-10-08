/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable react/jsx-no-bind */

'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordField, passwordSchema } from '@/components/ui/PasswordField';
import { getPhoneData, PhoneInput } from '@/components/ui/phone-input';
import { Step, StepItem, Stepper, useStepper } from '@/components/ui/stepper';
import { updateDataUser } from '@/lib/updateUser';
import { UpdateDataFormUser } from '@/types/pb';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building, Star, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ComboboxDegrees } from './ComboboxDegrees';
import { ComboboxInstitutions } from './ComboboxInstitutions';
import GoogleButton from './GoogleButton';

interface StepperDemoProps {
  isOAuthLogin?: boolean;
}

export default function StepperDemo({
  isOAuthLogin = false,
}: StepperDemoProps) {
  const [formData, setFormData] = useState<UpdateDataFormUser>({});

  const steps = [
    { label: 'Personal', icon: User },
    { label: 'Académico', icon: Building },
    ...(isOAuthLogin ? [] : [{ label: 'Cuenta', icon: Star }]),
  ] satisfies StepItem[];

  function handleUpdateData(newData: any) {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }

  return (
    <div className="container relative bg-white">
      <div className="flex w-full flex-col gap-4">
        <Stepper variant="circle-alt" initialStep={0} steps={steps}>
          {steps.map((stepProps, index) => {
            if (index === 0) {
              return (
                <Step key={stepProps.label} {...stepProps}>
                  <FirstStepForm onUpdateData={handleUpdateData} />
                </Step>
              );
            }
            if (index === 1) {
              return (
                <Step key={stepProps.label} {...stepProps}>
                  <SecondStepForm
                    onUpdateData={handleUpdateData}
                    formData={formData}
                    isOAuthLogin={isOAuthLogin}
                  />
                </Step>
              );
            }
            return (
              <Step key={stepProps.label} {...stepProps}>
                <ThreeStepForm
                  onUpdateData={handleUpdateData}
                  formData={formData}
                />
              </Step>
            );
          })}
        </Stepper>
      </div>
    </div>
  );
}

const FirstFormSchema = z.object({
  name: z
    .string()
    .min(5, { message: 'Al menos 5 caracteres' })
    .max(25, { message: 'Máximo 25 caracteres' }),
  lastname: z
    .string()
    .min(5, { message: 'Al menos 5 caracteres' })
    .max(25, { message: 'Máximo 25 caracteres' }),
  phone: z.string(),
});

function FirstStepForm({
  onUpdateData,
}: {
  onUpdateData: (data: any) => void;
}) {
  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
    defaultValues: {
      name: '',
      lastname: '',
      phone: '',
    },
  });

  function onSubmit(data: z.infer<typeof FirstFormSchema>) {
    const phoneData = getPhoneData(data.phone);

    if (!phoneData.isValid) {
      form.setError('phone', {
        type: 'manual',
        message: 'Número de teléfono inválido',
      });
      return;
    }

    onUpdateData(data);
    nextStep();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombres</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa tus nombres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellidos</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa tus apellidos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <PhoneInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions isFirstStep />
      </form>
    </Form>
  );
}

const SecondFormSchema = z.object({
  institution: z
    .string()
    .min(1, { message: 'Debe seleccionar una institución.' }),
  degree: z
    .string()
    .min(1, { message: 'Debe seleccionar un grado académico.' }),
});

function SecondStepForm({
  onUpdateData,
  formData,
  isOAuthLogin,
}: {
  onUpdateData: (data: any) => void;
  formData: UpdateDataFormUser;
  isOAuthLogin: boolean;
}) {
  const route = useRouter();
  const { nextStep } = useStepper();
  const form = useForm<z.infer<typeof SecondFormSchema>>({
    resolver: zodResolver(SecondFormSchema),
    defaultValues: {
      institution: '',
      degree: '',
    },
  });

  async function onSubmit(data: z.infer<typeof SecondFormSchema>) {
    const updatedData = { ...formData, ...data };
    onUpdateData(data);

    if (isOAuthLogin) {
      await updateDataUser(updatedData);
      route.replace('/');
      route.refresh();
    }

    nextStep();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institución</FormLabel>
              <FormControl>
                <ComboboxInstitutions
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grado académico</FormLabel>
              <FormControl>
                <ComboboxDegrees
                  value={field.value}
                  onValueChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  );
}

const ThreeFormSchema = z.object({
  username: z
    .string()
    .min(5, {
      message: 'El nombre de usuario debe tener al menos 5 caracteres.',
    })
    .max(30, {
      message: 'El nombre de usuario no puede tener más de 30 caracteres.',
    }),
  email: z
    .string()
    .email({
      message: 'El correo electrónico no es válido',
    })
    .min(5, {
      message: 'El correo electrónico debe tener al menos 5 caracteres.',
    })
    .max(50, {
      message: 'El correo electrónico no puede tener más de 50 caracteres.',
    }),
  password: passwordSchema,
  passwordConfirm: passwordSchema,
});

function ThreeStepForm({
  onUpdateData,
  formData,
}: {
  onUpdateData: (data: any) => void;
  formData: UpdateDataFormUser;
}) {
  const route = useRouter();
  const [error, setError] = useState('');

  const form = useForm<z.infer<typeof ThreeFormSchema>>({
    resolver: zodResolver(ThreeFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  async function onSubmit(data: z.infer<typeof ThreeFormSchema>) {
    const updatedData = { ...formData, ...data };
    onUpdateData(updatedData);

    if (updatedData.password !== updatedData.passwordConfirm) {
      form.setError('passwordConfirm', {
        type: 'manual',
        message: 'Las contraseñas no coinciden',
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        setError('Nombre de usuario o correo ya registrados');
        return;
      }

      route.replace('/');
      route.refresh();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de usuario</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa un nombre de usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input placeholder="Example@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordField placeholder="Crea una contraseña" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <PasswordField
                  label="Confirma tu contraseña"
                  placeholder="Repite tu contraseña"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <StepperFormActions />

        <GoogleButton classname="w-full" formDataRegister={formData} />
        {error && <p className="error">{error}</p>}
      </form>
    </Form>
  );
}

function StepperFormActions({ isFirstStep = false }) {
  const { isLastStep, prevStep } = useStepper();

  return (
    <div
      className={`flex items-center ${
        isFirstStep ? 'justify-end mr-5' : 'justify-around'
      } space-x-2`}
    >
      {!isFirstStep && (
        <Button variant="outline" type="button" onClick={prevStep}>
          Atrás
        </Button>
      )}
      <Button type="submit">{isLastStep ? 'Registrarme' : 'Siguiente'}</Button>
    </div>
  );
}
