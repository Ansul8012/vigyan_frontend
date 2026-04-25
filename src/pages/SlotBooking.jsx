import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, CalendarClock, Armchair, CheckCircle2, X, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// TODO: Replace with API call — GET /api/slots
const timeSlots = [
  { id: 1, time: '8:00 AM - 9:00 AM', booked: 18, total: 30 },
  { id: 2, time: '9:00 AM - 10:00 AM', booked: 27, total: 30 },
  { id: 3, time: '10:00 AM - 11:00 AM', booked: 12, total: 30 },
  { id: 4, time: '11:00 AM - 12:00 PM', booked: 22, total: 30 },
  { id: 5, time: '12:00 PM - 1:00 PM', booked: 8, total: 30 },
  { id: 6, time: '1:00 PM - 2:00 PM', booked: 15, total: 30 },
  { id: 7, time: '2:00 PM - 3:00 PM', booked: 20, total: 30 },
  { id: 8, time: '3:00 PM - 4:00 PM', booked: 10, total: 30 },
  { id: 9, time: '4:00 PM - 5:00 PM', booked: 5, total: 30 },
  { id: 10, time: '5:00 PM - 6:00 PM', booked: 14, total: 30 },
  { id: 11, time: '6:00 PM - 7:00 PM', booked: 9, total: 30 },
  { id: 12, time: '7:00 PM - 8:00 PM', booked: 3, total: 30 },
];

const SlotBooking = () => {
  const [currentBooking, setCurrentBooking] = useState(null);
  const totalSeats = 120;
  const occupiedSeats = 78;
  const occupancyPercent = Math.round((occupiedSeats / totalSeats) * 100);
  const barColor = occupancyPercent < 50 ? 'bg-success' : occupancyPercent < 80 ? 'bg-warning' : 'bg-destructive';

  // TODO: Replace with API call — POST /api/slots/book
  const handleBook = (slot) => {
    setCurrentBooking({
      slotId: slot.id,
      time: slot.time,
      seat: `S-${Math.floor(Math.random() * 100) + 1}`,
      date: new Date().toLocaleDateString(),
    });
    toast.success(`Slot booked: ${slot.time}`);
  };

  // TODO: Replace with API call — DELETE /api/slots/cancel
  const handleCancel = () => {
    setCurrentBooking(null);
    toast.info('Booking cancelled');
  };

  return (
    <div className="min-h-screen px-4 pb-12 pt-24">
      <div className="container mx-auto max-w-4xl">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-2 text-3xl font-bold">
          <span className="gradient-text">Library Slot Booking</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-2 text-sm text-muted-foreground leading-relaxed"
        >
          Reserve a seat at the library to ensure your study spot. Each slot is 1 hour long — pick a time that works for you and focus on what matters.
        </motion.p>

        {/* Note & Location */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5 rounded-full bg-info/10 px-3 py-1 text-info">
            <Info className="h-3 w-3" />
            Slots refresh every day at midnight
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-muted/30 px-3 py-1">
            <MapPin className="h-3 w-3" />
            Param Block, Graphic Era Deemed to be University, Dehradun, Uttarakhand
          </span>
        </motion.div>

        {/* Occupancy */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card glow mb-6 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Current Occupancy</h2>
              <p className="text-sm text-muted-foreground">{occupiedSeats}/{totalSeats} seats occupied</p>
            </div>
          </div>
          <div className="mb-2 h-3 overflow-hidden rounded-full bg-muted/50">
            <motion.div initial={{ width: 0 }} animate={{ width: `${occupancyPercent}%` }} transition={{ duration: 1, ease: 'easeOut' }} className={`h-full rounded-full ${barColor}`} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{totalSeats - occupiedSeats} seats available</span>
            <span>{occupancyPercent}% occupied</span>
          </div>
        </motion.div>

        {/* Current Booking */}
        {currentBooking && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gradient-border glow mb-6 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Current Booking</h3>
                  <p className="text-sm text-muted-foreground">{currentBooking.time}</p>
                  <p className="text-xs text-muted-foreground">Seat: {currentBooking.seat} • {currentBooking.date}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancel} className="text-destructive hover:bg-destructive/10">
                <X className="mr-1 h-4 w-4" />Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {/* Time Slots */}
        <div className="space-y-3">
          {timeSlots.map((slot, i) => {
            const seatsLeft = slot.total - slot.booked;
            const slotPercent = Math.round((slot.booked / slot.total) * 100);
            const isFull = seatsLeft <= 0;
            const isBooked = currentBooking?.slotId === slot.id;

            return (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="glass-card flex items-center gap-4 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <CalendarClock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{slot.time}</p>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                    <div className={`h-full rounded-full ${slotPercent > 80 ? 'bg-destructive' : slotPercent > 50 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${slotPercent}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Armchair className="h-4 w-4" />
                  <span>{seatsLeft} left</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleBook(slot)}
                  disabled={isFull || !!currentBooking}
                  className="bg-primary text-primary-foreground disabled:opacity-50"
                >
                  {isBooked ? 'Booked' : isFull ? 'Full' : 'Book'}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SlotBooking;
