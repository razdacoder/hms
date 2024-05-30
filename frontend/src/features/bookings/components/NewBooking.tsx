import BackButton from "@/components/BackButton";
import { ArrowLeft } from "lucide-react";
import BookingForm from "./booking-form";

export default function NewBooking() {
  return (
    <main className="px-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Booking</h3>
          <div className="flex items-center gap-x-2">
            <BackButton>
              <ArrowLeft className="w-8 h-8" />
            </BackButton>
            <h2 className="text-2xl font-medium">Add New Booking</h2>
          </div>
        </div>
      </div>
      <BookingForm />
    </main>
  );
}
