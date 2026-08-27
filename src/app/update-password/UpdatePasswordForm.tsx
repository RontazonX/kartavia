"use client";

import { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { updatePassword } from "@/app/actions/auth";
import { EyeOff, Eye } from "lucide-react";

export default function UpdatePasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={async (formData) => {
      setLoading(true);
      setError(null);
      
      const pwd1 = formData.get("password") as string;
      const pwd2 = formData.get("confirm_password") as string;
      
      if (pwd1 !== pwd2) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      
      if (pwd1.length < 6) {
        setError("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }
      
      const result = await updatePassword(formData);
      
      if (result?.error) {
        setError(result.error);
      }
      setLoading(false);
    }}>
      <div className="space-y-6">
        {error && (
          <div className="p-3 text-sm text-error-500 bg-error-50 rounded-lg border border-error-500/20">
            {error}
          </div>
        )}

        <div>
          <Label>New Password <span className="text-error-500">*</span> </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              name="password"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? <Eye className="h-5 w-5 text-gray-500" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
            </span>
          </div>
        </div>
        
        <div>
          <Label>Confirm Password <span className="text-error-500">*</span> </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              name="confirm_password"
              required
            />
          </div>
        </div>
        
        <div>
          <Button className="w-full" size="md" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </form>
  );
}
