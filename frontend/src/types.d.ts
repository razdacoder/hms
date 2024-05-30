type Room = {
  id: string;
  room_type: string;
  room_number: string;
  price: number;
  room_status: string;
  return_status: string;
  res_status: string;
  fo_status: string;
  bed_type: string;
  max_capacity: number;
  amenities: string[];
  images: string[];
  created_at: Date;
  updated_at: Date;
};

type Guest = {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
};

type Booking = {
  id: string;
  check_in_date: Date;
  check_out_date: Date;
  duration: number;
  guests_number: number;
  guest_request: string;
  extras: string[];
  room: Room;
  guest: Guest;
  price: number;
  created_at: Date;
  updated_at: Date;
};
