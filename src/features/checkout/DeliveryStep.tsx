import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Check, AlertCircle } from 'lucide-react';
import { useCheckout } from './CheckoutContext';
import { useAuth } from '../../context/AuthContext';
import {
  validateName,
  validatePhone,
  validateAddress,
  validateCity,
  validatePincode,
} from './validation';

export const DeliveryStep: React.FC = () => {
  const { state, updateDelivery, goToStep } = useCheckout();
  const { user, savedAddress, saveDeliveryAddress } = useAuth();

  const { deliveryDetails } = state;

  // Track touched fields for polite inline validation feedback
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Prefill from user session or saved address on mount
  useEffect(() => {
    const updates: Partial<typeof deliveryDetails> = {};

    if (!deliveryDetails.name && user?.name) {
      updates.name = user.name;
    }

    if (savedAddress) {
      if (!deliveryDetails.name && savedAddress.name) updates.name = savedAddress.name;
      if (!deliveryDetails.phone && savedAddress.phone)
        updates.phone = savedAddress.phone;
      if (!deliveryDetails.address && savedAddress.address)
        updates.address = savedAddress.address;
      if (!deliveryDetails.city && savedAddress.city) updates.city = savedAddress.city;
      if (!deliveryDetails.pincode && savedAddress.pincode)
        updates.pincode = savedAddress.pincode;
    }

    if (Object.keys(updates).length > 0) {
      updateDelivery(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, savedAddress]);

  // Validate single field
  const runFieldValidation = (field: string, value: string) => {
    let res: { isValid: boolean; error: string | null } = { isValid: true, error: null };
    switch (field) {
      case 'name':
        res = validateName(value);
        break;
      case 'phone':
        res = validatePhone(value);
        break;
      case 'address':
        res = validateAddress(value);
        break;
      case 'city':
        res = validateCity(value);
        break;
      case 'pincode':
        res = validatePincode(value);
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: res.error }));
    return res.isValid;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = String(
      (deliveryDetails as unknown as Record<string, unknown>)[field] || ''
    );
    runFieldValidation(field, val);
  };

  const handleChange = (field: string, value: string) => {
    updateDelivery({ [field]: value });
    if (touched[field]) {
      runFieldValidation(field, value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    const allTouched: Record<string, boolean> = {
      name: true,
      phone: true,
      address: true,
      city: true,
      pincode: true,
    };
    setTouched(allTouched);

    const isNameValid = runFieldValidation('name', deliveryDetails.name);
    const isPhoneValid = runFieldValidation('phone', deliveryDetails.phone);
    const isAddressValid = runFieldValidation('address', deliveryDetails.address);
    const isCityValid = runFieldValidation('city', deliveryDetails.city);
    const isPincodeValid = runFieldValidation('pincode', deliveryDetails.pincode);

    if (isNameValid && isPhoneValid && isAddressValid && isCityValid && isPincodeValid) {
      if (deliveryDetails.saveAddress) {
        saveDeliveryAddress({
          name: deliveryDetails.name,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          city: deliveryDetails.city,
          pincode: deliveryDetails.pincode,
        });
      }
      goToStep(3);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-4">
        <div>
          <h2 className="font-sora text-lg font-bold text-[#F5F5F5]">Delivery Details</h2>
          <p className="font-mono text-xs text-[#A3A3A3]">
            Where should our courier rush your hot wood-fired order?
          </p>
        </div>
        <span className="rounded-full border border-[#262626] bg-[#141414] px-3 py-1 font-mono text-xs text-[#FFD60A]">
          Step 2 of 4
        </span>
      </div>

      {user && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs font-mono text-amber-300">
          <MapPin className="h-4 w-4 shrink-0 text-amber-400" />
          <span>
            Ordering as logged-in member: <strong>{user.name}</strong> ({user.email})
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div className="sm:col-span-1">
          <label
            htmlFor="delivery-name"
            className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1.5"
          >
            Full Name <span className="text-[#FFD60A]">*</span>
          </label>
          <input
            id="delivery-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="e.g. Aditi Sharma"
            value={deliveryDetails.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            aria-invalid={Boolean(touched.name && errors.name)}
            aria-describedby={errors.name ? 'error-delivery-name' : undefined}
            className={`w-full rounded-xl border bg-[#141414] px-4 py-2.5 font-inter text-sm text-[#F5F5F5] placeholder-[#737373] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
              touched.name && errors.name
                ? 'border-rose-500'
                : 'border-[#262626] hover:border-[#383838]'
            }`}
          />
          {touched.name && errors.name && (
            <p
              id="error-delivery-name"
              className="mt-1 flex items-center gap-1 font-mono text-xs text-rose-400"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* 10-Digit Mobile Phone */}
        <div className="sm:col-span-1">
          <label
            htmlFor="delivery-phone"
            className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1.5"
          >
            10-Digit Phone <span className="text-[#FFD60A]">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 font-mono text-xs text-[#737373] select-none">
              +91
            </span>
            <input
              id="delivery-phone"
              name="phone"
              type="tel"
              required
              maxLength={10}
              autoComplete="tel-national"
              placeholder="9876543210"
              value={deliveryDetails.phone}
              onChange={(e) => handleChange('phone', e.target.value.replace(/\D/g, ''))}
              onBlur={() => handleBlur('phone')}
              aria-invalid={Boolean(touched.phone && errors.phone)}
              aria-describedby={errors.phone ? 'error-delivery-phone' : undefined}
              className={`w-full rounded-xl border bg-[#141414] pl-12 pr-4 py-2.5 font-mono text-sm text-[#F5F5F5] placeholder-[#737373] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
                touched.phone && errors.phone
                  ? 'border-rose-500'
                  : 'border-[#262626] hover:border-[#383838]'
              }`}
            />
          </div>
          {touched.phone && errors.phone && (
            <p
              id="error-delivery-phone"
              className="mt-1 flex items-center gap-1 font-mono text-xs text-rose-400"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* Street Address Line */}
        <div className="sm:col-span-2">
          <label
            htmlFor="delivery-address"
            className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1.5"
          >
            Street Address / Flat / Floor <span className="text-[#FFD60A]">*</span>
          </label>
          <textarea
            id="delivery-address"
            name="address"
            required
            rows={2}
            autoComplete="street-address"
            placeholder="Flat 402, Oakwood Towers, 2nd Main Road, SRM Nagar"
            value={deliveryDetails.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
            aria-invalid={Boolean(touched.address && errors.address)}
            aria-describedby={errors.address ? 'error-delivery-address' : undefined}
            className={`w-full rounded-xl border bg-[#141414] px-4 py-2.5 font-inter text-sm text-[#F5F5F5] placeholder-[#737373] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD60A] resize-none ${
              touched.address && errors.address
                ? 'border-rose-500'
                : 'border-[#262626] hover:border-[#383838]'
            }`}
          />
          {touched.address && errors.address && (
            <p
              id="error-delivery-address"
              className="mt-1 flex items-center gap-1 font-mono text-xs text-rose-400"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.address}</span>
            </p>
          )}
        </div>

        {/* City */}
        <div className="sm:col-span-1">
          <label
            htmlFor="delivery-city"
            className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1.5"
          >
            City <span className="text-[#FFD60A]">*</span>
          </label>
          <input
            id="delivery-city"
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            placeholder="e.g. Chennai"
            value={deliveryDetails.city}
            onChange={(e) => handleChange('city', e.target.value)}
            onBlur={() => handleBlur('city')}
            aria-invalid={Boolean(touched.city && errors.city)}
            aria-describedby={errors.city ? 'error-delivery-city' : undefined}
            className={`w-full rounded-xl border bg-[#141414] px-4 py-2.5 font-inter text-sm text-[#F5F5F5] placeholder-[#737373] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
              touched.city && errors.city
                ? 'border-rose-500'
                : 'border-[#262626] hover:border-[#383838]'
            }`}
          />
          {touched.city && errors.city && (
            <p
              id="error-delivery-city"
              className="mt-1 flex items-center gap-1 font-mono text-xs text-rose-400"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.city}</span>
            </p>
          )}
        </div>

        {/* Postal Pincode (6 digits) */}
        <div className="sm:col-span-1">
          <label
            htmlFor="delivery-pincode"
            className="block font-mono text-xs font-semibold text-[#F5F5F5] mb-1.5"
          >
            Postal PIN Code <span className="text-[#FFD60A]">*</span>
          </label>
          <input
            id="delivery-pincode"
            name="pincode"
            type="text"
            required
            maxLength={6}
            autoComplete="postal-code"
            placeholder="e.g. 600089"
            value={deliveryDetails.pincode}
            onChange={(e) => handleChange('pincode', e.target.value.replace(/\D/g, ''))}
            onBlur={() => handleBlur('pincode')}
            aria-invalid={Boolean(touched.pincode && errors.pincode)}
            aria-describedby={errors.pincode ? 'error-delivery-pincode' : undefined}
            className={`w-full rounded-xl border bg-[#141414] px-4 py-2.5 font-mono text-sm text-[#F5F5F5] placeholder-[#737373] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFD60A] ${
              touched.pincode && errors.pincode
                ? 'border-rose-500'
                : 'border-[#262626] hover:border-[#383838]'
            }`}
          />
          {touched.pincode && errors.pincode && (
            <p
              id="error-delivery-pincode"
              className="mt-1 flex items-center gap-1 font-mono text-xs text-rose-400"
            >
              <AlertCircle className="h-3 w-3 shrink-0" />
              <span>{errors.pincode}</span>
            </p>
          )}
        </div>
      </div>

      {/* Save Address Checkbox */}
      <div className="flex items-center gap-3 pt-1">
        <label className="group flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            id="save-address-checkbox"
            checked={deliveryDetails.saveAddress}
            onChange={(e) => updateDelivery({ saveAddress: e.target.checked })}
            className="sr-only"
          />
          <div
            className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${
              deliveryDetails.saveAddress
                ? 'border-[#FFD60A] bg-[#FFD60A] text-[#0A0A0A]'
                : 'border-[#383838] bg-[#141414] text-transparent group-hover:border-[#737373]'
            }`}
          >
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </div>
          <span className="font-mono text-xs text-[#A3A3A3] group-hover:text-[#F5F5F5] transition-colors">
            Save this address for fast checkout next time
          </span>
        </label>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#262626]">
        <button
          type="button"
          onClick={() => goToStep(1)}
          className="press-scale flex items-center gap-2 rounded-xl border border-[#262626] bg-[#141414] px-5 py-3 font-mono text-xs font-semibold text-[#A3A3A3] hover:border-[#383838] hover:text-[#F5F5F5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Review</span>
        </button>

        <button
          type="submit"
          id="proceed-to-payment-btn"
          className="press-scale flex items-center gap-2 rounded-xl bg-[#FFD60A] px-6 py-3 font-mono text-xs font-bold text-[#0A0A0A] hover:bg-[#E5C009] shadow-md shadow-[#FFD60A]/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A]"
        >
          <span>Proceed to Payment</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
};
