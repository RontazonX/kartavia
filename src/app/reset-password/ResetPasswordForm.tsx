"use client";

import { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { requestPasswordReset } from "@/app/actions/auth";

export default function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <form action={async (formData) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      
      const result = await requestPasswordReset(formData);
      
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(true);
      }
      setLoading(false);
    }}>
      <div className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-error-500 bg-error-50 rounded-lg border border-error-500/20">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 text-sm text-success-600 bg-success-50 rounded-lg border border-success-500/20">
            Password reset link sent! Please check your email inbox (and spam folder) for the link.
          </div>
        )}

        {!success && (
          <>
            <div>
              <Label>Email <span className="text-error-500">*</span> </Label>
              <Input placeholder="info@gmail.com" type="email" name="email" required />
            </div>
            
            <div>
              <Button className="w-full" size="md" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}
