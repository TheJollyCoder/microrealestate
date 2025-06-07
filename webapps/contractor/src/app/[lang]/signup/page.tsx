'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import * as z from 'zod';
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
import { cn } from '@/utils';
import config from '@/config';
import useTranslation from '@/utils/i18n/client/useTranslation';

const signUpFormSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function Signup() {
  const { t } = useTranslation();
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      await axios.post(`${config.GATEWAY_URL}/authenticator/signup`, values);
      window.location.href = `${config.BASE_PATH}/en/signin`;
    } catch (error) {
      alert('Signup failed');
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center mt-48')}>
      <div
        className={cn(
          'flex items-center mb-6 text-2xl text-gray-900 dark:text-white font-semibold'
        )}
      >
        <Image
          src={`${config.BASE_PATH}/favicon.svg`}
          alt="Logo"
          width={40}
          height={40}
          className={cn('mr-2')}
        />
        {config.APP_NAME}
      </div>

      <div
        className={cn(
          'w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700'
        )}
      >
        <div className={cn('p-6 space-y-4 md:space-y-6 sm:p-8')}>
          <h1
            className={cn(
              'text-xl  leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'
            )}
          >
            {t('Create an account')}
          </h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-4 md:space-y-6')}>
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('First name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t('Last name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t('Email')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t('Password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className={cn(
                  'w-full text-white bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary dark:focus:ring-primary-800'
                )}
              >
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
