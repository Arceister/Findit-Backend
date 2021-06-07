require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('../database')
const jwt = require('jsonwebtoken')
const jwt_key = process.env.SECRET_KEY_USER

function arePointsNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

function haversineDistance(coords1, coords2) {
    function toRad(x) {
      return x * Math.PI / 180;
    }
  
    var lon1 = coords1.lng;
    console.log("lon1", lon1)
    var lat1 = coords1.lat;
  
    var lon2 = coords2.lng;
    var lat2 = coords2.lat;
    
  
    var R = 6371; // km
  
    var x1 = lat2 - lat1;
    var dLat = toRad(x1);
    var x2 = lon2 - lon1;
    var dLon = toRad(x2)
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;
}

module.exports = {
    getAngkot: async (req, res, next) => {
        
    },

    getJarak: async (req, res, next) => {
        const angkot = req.params.id
        const userLat = req.user.user_lat
        const userLong = req.user.user_long
        const userCoordinate = {"lat": userLat, "lng": userLong}
        const [rows] = await db.query('SELECT * FROM angkot WHERE id = ?', angkot)
        if (rows.length > 0) {
            const angkotCoordinate = {"lat": rows[0].tujuan_lat, "lng": rows[0].tujuan_long}
            const jarak = haversineDistance(userCoordinate, angkotCoordinate)
            // const ketJarak = 
            res.status(200)
            res.send({
                "Jarak": jarak
            })
        } else {
            res.status(500)
            const err = new Error("Data not found!")
            next(err)
        }
    },

    checkRumah: async (req, res, next) => {
        const kodeAngkot = req.params.id
        const userData = req.user
        var userAddress
        var angkotA
        var angkotB
        var isNear = []
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', userData.user_id)
        if (rows.length > 0) {
            const rowsData = rows[0]
            userAddress = {"lat": rowsData.alamatLat, "lng": rowsData.alamatLong}
            db.query('SELECT * FROM angkot WHERE id = ?', kodeAngkot)
            .then(([results]) => {
                angkotA = {"lat": results[0].awal_lat, "lng": results[0].awal_long}
                angkotB = {"lat": results[0].tujuan_lat, "lng": results[0].tujuan_long}
                isNear.push(arePointsNear(userAddress, angkotA, 0.5))
                isNear.push(arePointsNear(userAddress, angkotB, 0.5))
                if (isNear.includes(true)) {
                    res.status(200)
                    res.send({
                        "Is Near?": true
                    })
                } else {
                    res.status(200)
                    res.send({
                        "Is Near?": false
                    })
                }
            })
            .catch((err) => {
                res.status(500)
                next(err)
            })
        } else {
            res.status(500)
            const err = new Error("Data not found!")
            next(err)
        }
    }
}