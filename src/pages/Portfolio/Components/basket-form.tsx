import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBasketSchema } from '@/schema';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { BasketType } from '../portfolio-utils/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useCreateBasketPost,
  useUpdateBasketPatch,
} from '@/Queries/portfolio-queries';

const BasketForm = ({
  editPayload,
  isBasketDialogOpen,
  setIsBasketDialogOpen,
}: {
  editPayload?: BasketType;
  isBasketDialogOpen: boolean;
  setIsBasketDialogOpen: (value: boolean) => void;
}) => {
  const [pending, setPending] = useState(false);
  const { mutate: createBasket } = useCreateBasketPost();
  const { mutate: updateBasket } = useUpdateBasketPatch();
  const form = useForm({
    resolver: zodResolver(createBasketSchema),
    defaultValues: {
      basketName: editPayload?.basketName || '',
    },
  });
  const { handleSubmit, reset, setValue } = form;
  // const basketName = watch("basketName");
  useEffect(() => {
    if (editPayload) {
      setValue('basketName', editPayload.basketName);
    }
  }, [editPayload, setValue]);

  const onSubmit = async (data: z.infer<typeof createBasketSchema>) => {
    setPending(true);
    if (editPayload) {
      updateBasket({
        data: { basketName: data.basketName },
        params: { id: editPayload.id },
        successTrigger: () => {
          setIsBasketDialogOpen(false);
          reset({ basketName: '' });
        },
      });
    } else {
      await new Promise(resolve => setTimeout(resolve, 1000));
      createBasket({
        data: { basketName: data.basketName },
        successTrigger: () => {
          setIsBasketDialogOpen(false);
          reset({ basketName: '' });
        },
      });
      console.log('create');
    }
    console.log(data);
    setPending(false);
  };

  return (
    <Dialog open={isBasketDialogOpen} onOpenChange={setIsBasketDialogOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="secondary" className="relative top-[12px]">
          <Plus className="mr-2 h-4 w-4" /> Create Basket
        </Button>
      </DialogTrigger> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editPayload ? 'Edit Basket' : 'Create Basket'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="basketName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Basket Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter basket name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={pending}
                className="text-white text-lg transition-colors duration-300 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                {editPayload
                  ? pending
                    ? 'Updating...'
                    : 'Update'
                  : pending
                    ? 'Creating...'
                    : 'Create Basket'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BasketForm;
