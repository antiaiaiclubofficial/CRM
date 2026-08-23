import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface UniversalConfirmModalProps {
  isOpen: boolean;
  customerName: string;
  phone: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const UniversalConfirmModal = ({ isOpen, customerName, phone, onConfirm, onCancel }: UniversalConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">พบข้อมูลในระบบ</DialogTitle>
          <DialogDescription className="text-center pt-2">
            ระบบพบประวัติการใช้งานของคุณด้วยเบอร์โทรศัพท์นี้:
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 my-4 flex flex-col items-center">
          <span className="font-semibold text-lg text-blue-900">{customerName}</span>
          <span className="text-blue-700">{phone}</span>
        </div>

        <p className="text-sm text-gray-500 text-center mb-2">
          คุณต้องการใช้โปรไฟล์นี้เพื่อเข้าใช้งานร้านค้านี้เลยหรือไม่? (ข้อมูลสัตว์เลี้ยงจะถูกนำมาใช้งานด้วย)
        </p>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-1/2">
            ไม่ใช่ เปลี่ยนเบอร์
          </Button>
          <Button type="button" onClick={onConfirm} className="w-full sm:w-1/2 bg-blue-600 hover:bg-blue-700 text-white">
            ใช่ เข้าใช้งานเลย
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
