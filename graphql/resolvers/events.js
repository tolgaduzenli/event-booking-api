const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');

const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(async (event) => {
                //tag event as booked when it's included any booking
                const bookings = await Booking.find({ event: event._id });
                event._doc.booked = bookings.length > 0
                return transformEvent(event)
            });
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await User.findById(req.userId);

            if (!creator) {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    updateEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const event = await Event.findById(args.eventInput._id);
        if (!event) {
            throw new Error('Event not found');
        }
        event.title = args.eventInput.title
        event.description = args.eventInput.description
        event.price = +args.eventInput.price
        event.date = new Date(args.eventInput.date)

        try {
            const result = await event.save();
            console.log(result);
            return transformEvent(result);
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    deleteEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const event = await Event.findById(args.eventId);
        if (!event) {
            throw new Error('Event not found');
        }
        try {
            Event.deleteOne({ _id: args.eventId }, (err) => {
                if (err) {
                    throw err;
                }
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
        return 'Item deleted'
    },
};
