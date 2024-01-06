"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { eventDefaultValues } from "@/constants";
import { useUploadThing } from "@/lib/uploadthing";
import { eventFormSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { FC, startTransition, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "../ui/textarea";
import Dropdown from "./Dropdown";
import FileUploader from "./FileUploader";

import {
  createCategory,
  getAllCategories,
} from "@/lib/actions/category.actions";
import { createEvent } from "@/lib/actions/event.actions";
import { ICategory } from "@/lib/database/models/category.models";
import { useRouter } from "next/navigation";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox";
import Alert from "./Alert";

type EventFormProps = {
  userId: string;
  type: "create" | "update";
};

const EventForm: FC<EventFormProps> = (props) => {
  const { type, userId } = props;

  const [files, setFiles] = useState<File[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState("");

  const { startUpload } = useUploadThing("imageUploader");
  const router = useRouter();

  const openAlert = () => setShowAlert(true);
  const closeAlert = () => setShowAlert(false);

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories();

      categoryList && setCategories(categoryList as ICategory[]);
    };

    getCategories();
  }, []);

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: eventDefaultValues,
  });

  const handleAddCategory = () => {
    createCategory({ categoryName: newCategory.trim() }).then((category) => {
      setCategories((prevState) => [...prevState, category]);
      closeAlert();
    });
  };

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    const eventData = values;

    let uploadedImageUrl = values.imageUrl;

    if (files.length > 0) {
      const uploadedImages = await startUpload(files);

      if (!uploadedImages) return;

      uploadedImageUrl = uploadedImages[0].url;
    }

    if (type === "create") {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: "/profile",
        });

        if (newEvent) {
          form.reset();
          router.push(`/events/${newEvent._id}`);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Event title"
                    {...field}
                    className="input-field"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Dropdown
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="Category"
                    options={categories}
                  >
                    <>
                      <Button
                        onClick={openAlert}
                        variant="ghost"
                        className="p-medium-14 flex rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500"
                      >
                        Add new category
                      </Button>

                      <Alert
                        open={showAlert}
                        title="New Category"
                        onConfirm={() => startTransition(handleAddCategory)}
                        onCancel={closeAlert}
                        confirmLabel="Add"
                        description={
                          <Input
                            type="text"
                            placeholder="Category name"
                            className="input-field mt-3"
                            onChange={(e) => setNewCategory(e.target.value)}
                          />
                        }
                      />
                    </>
                  </Dropdown>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    {...field}
                    placeholder="Description"
                    className="textarea rounded-2xl"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <FileUploader
                    onChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="location"
                      width={24}
                      height={24}
                    />

                    <Input
                      {...field}
                      placeholder="Event location or Online"
                      className="input-field"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Start Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      End Date:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time"
                      dateFormat="MM/dd/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <label
                                htmlFor="isFree"
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Free Ticket
                              </label>
                              <Checkbox
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id="isFree"
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="link"
                      width={24}
                      height={24}
                    />

                    <Input
                      {...field}
                      placeholder="URL"
                      className="input-field"
                    />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="button col-span-2 w-full capitalize"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting.." : `${type} Event`}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;
