import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganizationEdit,
  OrganizationEditSchema,
} from "../models/Organization";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/TextArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import SpinnerIcon from "../assets/icons/SpinnerIcon";
import { useNavigate } from "react-router-dom";
import { Label } from "./ui/Label";

interface OrganizationFormProps {
  onSubmit: SubmitHandler<OrganizationEdit>;
  isSubmitting: boolean;
  defaultValues?: OrganizationEdit;
}

export default function OrganizationForm({
  onSubmit,
  isSubmitting,
  defaultValues,
}: OrganizationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OrganizationEdit>({
    resolver: zodResolver(OrganizationEditSchema),
    defaultValues,
  });

  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex mb-4">
        <div className="basis-1/2 flex flex-col gap-4 pr-8 border-r-2">
          <h2 className="text-xl">Details</h2>
          <div>
            <label htmlFor="name" className="sr-only">
              Name
            </label>
            <Input {...register("name")} placeholder="Name" />
            {errors.name && (
              <p className="text-destructive text-sm my-1">
                {errors.name?.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input {...register("email")} placeholder="Email" />
            {errors.email && (
              <p className="text-destructive text-sm my-1">
                {errors.email?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="Address" className="sr-only">
              Address
            </label>
            <Input {...register("address")} placeholder="Address" />
            {errors.address && (
              <p className="text-destructive text-sm my-1">
                {errors.address?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="Phone" className="sr-only">
              Phone
            </label>
            <Input {...register("phone")} placeholder="Phone" />
            {errors.phone && (
              <p className="text-destructive text-sm my-1">
                {errors.phone?.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="Website" className="sr-only">
              Website
            </label>
            <Input {...register("website")} placeholder="Website" />
            {errors.website && (
              <p className="text-destructive text-sm my-1">
                {errors.website?.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select orgnization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nonprofit">Nonprofit</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-destructive text-sm my-1">
                {errors.type?.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="Mission">Mission</label>
            <Textarea
              {...register("mission")}
              placeholder="Write organization's mission here"
            />
            {errors.mission && (
              <p className="text-destructive text-sm my-1">
                {errors.mission?.message}
              </p>
            )}
          </div>
        </div>
        <div className="basis-1/2 pl-8 flex flex-col gap-4">
          <h2 className="text-xl">Socials</h2>
          <div>
            <label htmlFor="facebook" className="sr-only">
              Facebook
            </label>
            <Input {...register("facebook")} placeholder="Facebook" />
            {errors.facebook && (
              <p className="text-destructive text-sm my-1">
                {errors.facebook?.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="instagram" className="sr-only">
              Instagram
            </label>
            <Input {...register("instagram")} placeholder="Instagram" />
            {errors.instagram && (
              <p className="text-destructive text-sm my-1">
                {errors.instagram?.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="LinkedId" className="sr-only">
              LinkedId
            </label>
            <Input {...register("linkedin")} placeholder="LinkedId" />
            {errors.linkedin && (
              <p className="text-destructive text-sm my-1">
                {errors.linkedin?.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="YouTube" className="sr-only">
              YouTube
            </label>
            <Input {...register("youtube")} placeholder="YouTube" />
            {errors.youtube && (
              <p className="text-destructive text-sm my-1">
                {errors.youtube?.message}
              </p>
            )}
          </div>
          <div>
            <Controller
              control={control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <div>
                  <Label>Image</Label>
                  <Input
                    {...fieldProps}
                    placeholder="Picture"
                    type="file"
                    accept="image/*, application/pdf"
                    onChange={(event) =>
                      onChange(event.target.files && event.target.files[0])
                    }
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center w-full justify-end gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? <SpinnerIcon /> : "Submit"}
        </Button>
      </div>
    </form>
  );
}
