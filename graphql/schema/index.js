const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
        booked: Boolean! 
    }

    type User {
        _id: ID!
        name: String!
        surname: String!
        email: String!
        password: String!
        createdEvents: [Event!]
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: ID!
    }
    
    input EventUpdateInput {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input UserInput {
        name: String!
        surname: String!
        email: String!
        password: String!
    }

    type RootQuery  {
        events: [Event!]!
        bookings: [Booking!]!
        bookedEventByEventId(eventId: ID!): Booking
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        updateEvent(eventInput: EventUpdateInput): Event
        deleteEvent(eventId: ID!): String
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
