import { useState, ChangeEvent, FormEvent } from 'react';

export interface BookingFormData {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

interface UseBookingFormReturn {
  formData: BookingFormData;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: FormEvent) => void;
  resetForm: () => void;
}

const INITIAL_FORM_STATE: BookingFormData = {
  name: '',
  email: '',
  company: '',
  service: '',
  message: '',
};

export function useBookingForm(
  onSubmit?: (data: BookingFormData) => void
): UseBookingFormReturn {
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM_STATE);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('Form submitted:', formData);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
  };
}
