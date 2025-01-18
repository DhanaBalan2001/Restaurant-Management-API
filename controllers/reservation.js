import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';

const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
  '20:00', '20:30', '21:00'
];

export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date, guestCount } = req.query;
    const selectedDate = new Date(date);
    
    // Find tables that can accommodate the guest count
    const tables = await Table.find({
      capacity: { $gte: guestCount },
      isActive: true
    });

    // Get existing reservations for the selected date
    const existingReservations = await Reservation.find({
      date: {
        $gte: new Date(selectedDate.setHours(0,0,0)),
        $lt: new Date(selectedDate.setHours(23,59,59))
      },
      status: { $ne: 'cancelled' }
    }).populate('table');

    // Create availability map for each time slot
    const availability = TIME_SLOTS.map(timeSlot => {
      const bookedTablesIds = existingReservations
        .filter(res => res.timeSlot === timeSlot)
        .map(res => res.table._id.toString());

      const availableTables = tables.filter(table => 
        !bookedTablesIds.includes(table._id.toString())
      );

      return {
        timeSlot,
        availableTables,
        hasAvailability: availableTables.length > 0
      };
    });

    res.json({
      date: selectedDate,
      guestCount,
      availability: availability.filter(slot => slot.hasAvailability)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReservation = async (req, res) => {
  try {
    const { table, date, timeSlot, guestCount } = req.body;

    // Verify table exists
    const selectedTable = await Table.findById(table);
    if (!selectedTable) {
      return res.status(404).json({ message: "Table not found" });
    }

    // Check for existing reservations
    const existingReservation = await Reservation.findOne({
      table: table,
      date: new Date(date),
      timeSlot,
      status: { $ne: 'cancelled' }
    });

    if (existingReservation) {
      return res.status(409).json({ message: "Table already reserved for this time slot" });
    }

    const newReservation = await Reservation.create(req.body);
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};