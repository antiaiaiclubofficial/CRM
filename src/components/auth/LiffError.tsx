import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiffErrorProps {
  message?: string;
}

export const LiffError = ({ message = "ไม่พบข้อมูลร้านค้า กรุณาติดต่อร้านค้า" }: LiffErrorProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm w-full flex flex-col items-center">
        <div className="bg-red-50 p-3 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-gray-500 mb-6">{message}</p>
        <Button 
          className="w-full"
          onClick={() => window.location.reload()}
        >
          ลองใหม่อีกครั้ง
        </Button>
      </div>
    </div>
  );
};
