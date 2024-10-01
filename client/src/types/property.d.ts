interface Location {
  city: string;
  country: string;
}

interface Property {
  _id: string;
  title: string;
  description: string;
  location: Location; // Updated to reflect the new structure
  maxGuests: number;
  userId: string;
  username: string;
  createdAt: string;
  pricePerNight: number;
  rooms: number;
  beds: number;
  amenities: string[];
  images: string[];
}
