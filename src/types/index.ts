export interface Store {
  id: string;
  name: string;
  logo_url: string;
  liff_id: string;
  liff_enabled: boolean;
}

export interface Customer {
  id: string;
  line_user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  age?: string;
  house_no?: string;
  moo?: string;
  soi?: string;
  road?: string;
  sub_district?: string;
  district?: string;
  province?: string;
  postal_code?: string;
}
