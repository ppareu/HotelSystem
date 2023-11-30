// models/index.js
const guests = [];
const logs = [];

function getAllGuests() {
    return guests;
}

function getAllLogs() {
    return logs;
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
    return date.toLocaleString(undefined, options);
}

function checkIn(name, room) {
    const existingGuest = guests.find(guest => guest.name === name);
    if (existingGuest) {
        return null; // 이름 중복으로 체크인 불가
    }

    const checkinDate = new Date();
    const guest = {
        id: guests.length + 1,
        name,
        room,  // Include room information
        checkinDate,
        checkoutDate: null,
    };
    guests.push(guest);

    // 로그 기록
    logs.push({
        id: guest.id,
        name: guest.name,
        room: guest.room, // Include room information in logs
        action: 'Check-in',
        timestamp: checkinDate,
    });

    return guest;
}

function checkOut(id) {
    const guest = guests.find(g => g.id === id);
    if (!guest || guest.checkoutDate !== null) {
        return null; // 해당 ID의 손님이 없거나 이미 체크아웃한 경우
    }

    const checkoutDate = new Date();
    guest.checkoutDate = checkoutDate;

    // 로그 기록
    logs.push({
        id: guest.id,
        name: guest.name,
        room: guest.room, // Include room information in logs
        action: 'Check-out',
        timestamp: checkoutDate,
    });

    return guest;
}

module.exports = {
    getAllGuests,
    getAllLogs,
    checkIn,
    checkOut,
    formatDate,
};
