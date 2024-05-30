import BackButton from "@/components/BackButton";
import BookingForm from "./booking-form";

export default function NewBooking() {
  return (
    <main className="px-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Booking</h3>
          <h2 className="text-2xl font-medium">Add New Booking</h2>
        </div>

        <BackButton />
      </div>
      <BookingForm />
    </main>
  );
}
