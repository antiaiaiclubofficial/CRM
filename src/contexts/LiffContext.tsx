import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import liff from "@line/liff";
import { supabase } from "@/integrations/supabase/client";
import { Store, Customer } from "@/types";

export type MembershipStatus = 'guest' | 'global_user' | 'store_member';

interface LiffContextType {
  store: Store | null;
  liffProfile: any | null;
  customer: Customer | null;
  membershipStatus: MembershipStatus;
  isLoading: boolean;
  error: string | null;
}

const LiffContext = createContext<LiffContextType | undefined>(undefined);

export const LiffProvider = ({ children }: { children: ReactNode }) => {
  const [store, setStore] = useState<Store | null>(null);
  const [liffProfile, setLiffProfile] = useState<any | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatus>('guest');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. อ่านค่า liffId จาก URL
        const urlParams = new URLSearchParams(window.location.search);
        let liffId = urlParams.get("liffId");
        
        // ถ้าไม่มี liffId ลองหาจาก sessionStorage กรณีเปลี่ยนหน้าแล้ว param หาย
        if (!liffId) {
          liffId = sessionStorage.getItem("current_liff_id");
        }
        
        if (!liffId) {
          throw new Error("ไม่พบข้อมูลร้านค้า กรุณาติดต่อร้านค้า");
        }

        // เก็บลง session เพื่อไม่ให้หายเวลาเปลี่ยนหน้า/refresh แบบไม่มี query
        sessionStorage.setItem("current_liff_id", liffId);

        // 2. ค้นหาข้อมูลร้านค้าจาก Supabase
        const { data: storeData, error: storeError } = await supabase
          .from("stores")
          .select("*")
          .eq("liff_id", liffId)
          .single();

        if (storeError || !storeData) {
          throw new Error("ไม่พบข้อมูลร้านค้า กรุณาติดต่อร้านค้า");
        }

        if (!storeData.liff_enabled) {
          throw new Error("ร้านค้านี้ปิดการใช้งานชั่วคราว กรุณาติดต่อร้านค้า");
        }

        setStore(storeData as Store);

        // 3. Initialize LINE LIFF SDK
        await liff.init({ liffId: storeData.liff_id });
        
        if (!liff.isLoggedIn()) {
          // ถ้าเปิดผ่าน Browser ภายนอก จะต้องทำการ Login
          liff.login();
          return; // หยุดการทำงานชั่วคราว รอ redirect กลับมา
        }

        const profile = await liff.getProfile();
        setLiffProfile(profile);

        // 4. ตรวจสอบการเป็นสมาชิกของร้านค้านี้
        // ค้นหา customer_id จาก table customers โดยใช้ line_user_id
        const { data: customerData } = await supabase
          .from("customers")
          .select("*")
          .eq("line_user_id", profile.userId)
          .single();

        if (customerData) {
          setCustomer(customerData as Customer);
          // ถ้าเจอใน customers ให้เช็คว่าเชื่อมกับร้านนี้หรือยัง (store_customers)
          const { data: storeCustomerLink } = await supabase
            .from("store_customers")
            .select("*")
            .eq("store_id", storeData.id)
            .eq("customer_id", customerData.id)
            .single();

          if (storeCustomerLink) {
            setMembershipStatus('store_member');
          } else {
            setMembershipStatus('global_user');
          }
        } else {
          // ไม่เคยมีประวัติในระบบ customers เลย
          setMembershipStatus('guest');
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error("Liff Initialization Error:", err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดระบบ");
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  return (
    <LiffContext.Provider value={{ store, liffProfile, customer, membershipStatus, isLoading, error }}>
      {children}
    </LiffContext.Provider>
  );
};

export const useLiff = () => {
  const context = useContext(LiffContext);
  if (context === undefined) {
    throw new Error("useLiff must be used within a LiffProvider");
  }
  return context;
};
