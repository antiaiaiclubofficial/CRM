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
  // add any other profile fields as needed
}
