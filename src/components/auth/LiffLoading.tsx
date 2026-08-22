import { Loader2 } from "lucide-react";

export const LiffLoading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-gray-500 font-medium">กำลังโหลดข้อมูลร้านค้า...</p>
    </div>
  );
};
