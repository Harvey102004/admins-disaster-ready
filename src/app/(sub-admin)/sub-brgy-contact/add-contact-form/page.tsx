"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { brgyContactSchema } from "@/lib/schema/brgyContacts";
import { z } from "zod";

import { addBrgyContact } from "@/server/api/brgyContacts";

type BrgyContactForm = z.infer<typeof brgyContactSchema>;

export default function AddContactForm({ onClose }: { onClose?: () => void }) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrgyContactForm>({
    resolver: zodResolver(brgyContactSchema),
    defaultValues: {
      lat: 14.1717,
      long: 121.2436,
    },
  });

  const mutation = useMutation({
    mutationFn: addBrgyContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brgyContacts"] });
      reset();
    },
  });

  const onSubmit = (data: BrgyContactForm) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Barangay *</label>
        <select {...register("barangay")}>
          <option value="">-- Select Barangay --</option>
          <option value="anos">Brgy. Anos</option>
          <option value="bambang">Brgy. Bambang</option>
          <option value="batong-malake">Brgy. Batong Malake</option>
          {/* ... other options */}
        </select>
        {errors.barangay && <p>{errors.barangay.message}</p>}
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>Brgy Captain</label>
        <input type="text" {...register("captain")} />
      </div>

      <div>
        <label>Brgy Secretary</label>
        <input type="text" {...register("secretary")} />
      </div>

      <div>
        <label>Facebook Page</label>
        <input
          type="url"
          {...register("facebook")}
          placeholder="https://facebook.com/yourpage"
        />
        {errors.facebook && <p>{errors.facebook.message}</p>}
      </div>

      <div>
        <label>Landline</label>
        <input type="tel" {...register("landline")} />
      </div>

      <div>
        <label>Contact Number</label>
        <input type="tel" {...register("contact")} />
      </div>

      <input type="hidden" {...register("lat")} />
      <input type="hidden" {...register("long")} />

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
