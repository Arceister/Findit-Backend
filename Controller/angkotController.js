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
    var lon1 = coords1.lng
    var lat1 = coords1.lat
    var lon2 = coords2.lng
    var lat2 = coords2.lat
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

function bulatkanBilangan(bilangan) {
    const bulat = Math.round(bilangan / 100)
    return bulat * 100
}

module.exports = {
    getAngkot: async (req, res, next) => {
        
    },

    getRute: async (req, res, next) => {
        const angkot = req.params.id
        const [rows] = await db.query('SELECT lat, lng FROM rute_angkot WHERE id_angkot = ?', angkot)
        if (rows.length > 0) {
            res.status(200)
            res.json({
                "success": true,
                "message": "Ini rute2nya",
                "rute": rows
            })
        } else {
            res.status(500)
            const err = new Error("Data not found!")
            next(err)
        }
    },

    getBiaya: async (req, res, next) => {
        const angkot = req.params.id
        const userLat = req.user.user_lat
        const userLong = req.user.user_long
        const userCoordinate = {"lat": userLat, "lng": userLong}
        var distancesArray = []
        const [rows] = await db.query('SELECT lat, lng FROM rute_angkot WHERE id_angkot = ?', angkot)
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                const angkotCoordinate = {"lat": rows[i].lat, "lng": rows[i].lng}
                distancesArray.push(haversineDistance(userCoordinate, angkotCoordinate))
            }
            const shortestDist = Math.min.apply(Math, distancesArray)
            if (shortestDist < 0.3) {
                var hargaTambahan = (shortestDist / 0.1) * 1500
                hargaTambahan = bulatkanBilangan(hargaTambahan)
                res.status(200)
                res.json({
                    "success": true,
                    "harga": (2500 + hargaTambahan),
                })
            } else {
                res.status(200)
                res.json({
                    "success": true,
                    "harga": (2500)
                })
            }           
        } else {
            res.status(500)
            const err = new Error("Data not found!")
            next(err)
        }
    },

    getJarak: async (req, res, next) => {
        const angkot = req.params.id
        const userLat = req.user.user_lat
        const userLong = req.user.user_long
        const userCoordinate = {"lat": userLat, "lng": userLong}
        var distancesArray = []
        const [rows] = await db.query('SELECT lat, lng FROM rute_angkot WHERE id_angkot = ?', angkot)
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                const angkotCoordinate = {"lat": rows[i].lat, "lng": rows[i].lng}
                distancesArray.push(haversineDistance(userCoordinate, angkotCoordinate))
            }
            const shortestDist = Math.min.apply(Math, distancesArray)
            res.status(200)
            res.json({
                "success": true,
                "Jarak Terpendek": shortestDist
            })
        } else {
            res.status(500)
            const err = new Error("Data not found!")
            next(err)
        }
    },

    checkRumah: async (req, res, next) => {
        const angkot = req.params.id
        const userLat = req.user.user_lat
        const userLong = req.user.user_long
        const userCoordinate = {"lat": userLat, "lng": userLong}
        var nearCoordinate = []
        const [rows] = await db.query('SELECT lat, lng FROM rute_angkot WHERE id_angkot = ?', angkot)
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                const angkotCoordinate = {"lat": rows[i].lat, "lng": rows[i].lng}
                const isNear = arePointsNear(userCoordinate, angkotCoordinate, 0.5)
                if (isNear) nearCoordinate.push(angkotCoordinate)
            }
            if (nearCoordinate.length > 0) {
                res.status(200)
                res.json({
                    "success": true,
                    "message": "There's Near Coordinates!",
                    "koordinat": nearCoordinate
                })
            } else {
                res.status(200)
                res.json({
                    "success": true,
                    "message": "No Near Coordinates"
                })
            }            
        } else {
            res.status(500)
            const err = new Error("Data not found!")
            next(err)
        }
    },

    placeSearch: async (req, res, next) => {
        var place = req.body.place
        const userLat = req.user.user_lat
        const userLong = req.user.user_long
        const userCoordinate = {"lat": userLat, "lng": userLong}
        place = "%" + place + "%"
        var responseJson = []
        const [rows] = await db.query('SELECT * FROM rute_angkot WHERE lokasi LIKE ?', place)
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                var locationCoordinate = {"lat": rows[i].lat, "lng": rows[i].lng}
                var distance = haversineDistance(userCoordinate, locationCoordinate)
                responseJson.push({"place": rows[i].lokasi, 
                "distance": parseFloat(distance.toFixed(2)), 
                "lat": rows[i].lat,
                "long": rows[i].lng})
            }
            res.status(200)
            res.json({
                "success": true,
                "message": "Ini lokasinya",
                "data": responseJson
            })
        } else {
            res.status(200)
            res.json({
                "success": true,
                "message": "Lokasi tidak ditemukan!"
            })
        }
    },

    naikAngkot: async (req, res, next) => {
        const userId = req.user.user_id
        const angkot = req.params.id
        const supir = req.body.supir_id
        const userLat = req.user.user_lat
        const userLong = req.user.user_long
        const mauDijemput = req.body.jemput
        const userCoordinate = {"lat": userLat, "lng": userLong}
        var distancesArray = []
        const [rows] = await db.query('SELECT lat, lng FROM rute_angkot WHERE id_angkot = ?', angkot)
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                const angkotCoordinate = {"lat": rows[i].lat, "lng": rows[i].lng}
                distancesArray.push(haversineDistance(userCoordinate, angkotCoordinate))
            }
            const shortestDist = Math.min.apply(Math, distancesArray)
            if (shortestDist < 0.3 && mauDijemput) {
                var hargaTambahan = (shortestDist / 0.1) * 1500
                hargaTambahan = bulatkanBilangan(hargaTambahan)
                const actualPrice = hargaTambahan + 2500
                const taxCut = (actualPrice*9)/10
                db.getConnection()
                .then(promiseConn => {
                    var conn = promiseConn.connection 
                    conn.beginTransaction((err) => {
                        conn.query("UPDATE supir SET saldo = saldo + ? WHERE id = ?", [taxCut, supir], () => {
                            conn.query('INSERT INTO history_user(id_user, id_angkot, isDijemput, harga) VALUES(?,?,?,?)', [userId, angkot, 1, actualPrice], () => {
                                conn.query('INSERT INTO history_supir(id_supir, id_user, isDijemput, harga) VALUES(?,?,?,?)', [supir, userId, 1, taxCut], () => {
                                    conn.commit(() => {
                                        res.status(200)
                                        res.json({
                                            "success": true,
                                            "message": "Transaction Success!",
                                            "harga": actualPrice
                                        })
                                        conn.release()
                                    })
                                })
                            })
                        })
                    })
                })
            } else {
                const actualPrice = 2500
                const taxCut = actualPrice * 9 / 10
                db.getConnection()
                .then(promiseConn => {
                    var conn = promiseConn.connection 
                    conn.beginTransaction((err) => {
                        conn.query("UPDATE supir SET saldo = saldo + ? WHERE id = ?", [taxCut, supir], () => {
                            conn.query('INSERT INTO history_user(id_user, id_angkot, isDijemput, harga) VALUES(?,?,?,?)', [userId, angkot, 0, actualPrice], () => {
                                conn.query('INSERT INTO history_supir(id_supir, id_user, isDijemput, harga) VALUES(?,?,?,?)', [supir, userId, 0, taxCut], () => {
                                    conn.commit(() => {
                                        res.status(200)
                                        res.json({
                                            "success": true,
                                            "message": "Transaction Success!",
                                            "harga": actualPrice
                                        })
                                        conn.release()
                                    })
                                })
                            })
                        })
                    })
                })
            }           
        } else {
            res.status(500)
            const err = new Error("Data not found!")
            next(err)
        }
    },

    showAngkots: async (req, res, next) => {
        const lokasi = req.body.lokasi
        const lat = req.body.lat
        const long = req.body.long
        var angkots = []
        const [rows] = await db.query('SELECT t4.nama, t2.kode, t2.awal, t2.tujuan FROM rute_angkot t1 ' +
            'INNER JOIN angkot t2 ON t1.id_angkot = t2.id ' +
            'INNER JOIN angkots t3 ON t3.id_angkot = t2.id ' +
            'INNER JOIN supir t4 ON t4.id = t3.id_supir ' +
            'WHERE lokasi = ? AND lat = ? AND lng = ? AND t3.isAvailable = 1',[lokasi, lat, long])
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                var rute = rows[i].awal + " - " + rows[i].tujuan
                var dataSupir = {"supir": rows[i].nama, "kode": rows[i].kode, "rute": rute}
                angkots.push(dataSupir)
            }
            res.status(200)
            res.json({
                "success": true,
                "message": "Ini data",
                "data": angkots
            })
        } else {
            res.status(200)
            res.json({
                "success": true,
                "message": "Tidak ada angkot tersedia saat ini untuk rute itu."
            })
        }     
    },

    naikAngkotDua: async (req, res, next) => {
        const lokasi = req.body.lokasi
        const lat = req.body.lat
        const long = req.body.long
        const userLat = req.user.user_lat
        const userLong = req.user.user_long
        const isDijemput = req.body.jemput
        const userCoordinate = {"lat": userLat, "lng": userLong}
        const placeCoordinate = {"lat": lat, "lng": long}
        const [rows] = await db.query("SELECT t1.lokasi, t4.nama, t2.kode, t2.awal, t2.tujuan FROM rute_angkot t1 " +
        "INNER JOIN angkot t2 ON t1.id_angkot = t2.id " +
        "INNER JOIN angkots t3 ON t3.id_angkot = t2.id " +
        "INNER JOIN supir t4 ON t4.id = t3.id_supir " + 
        "WHERE lokasi = ? AND lat = ? AND lng = ?", [lokasi, lat, long])
        if (rows.length > 0) {
            const jarak = haversineDistance(userCoordinate, placeCoordinate)
            if (jarak < 0.3 && isDijemput) {
                var hargaTambahan = (jarak / 0.1) * 1500
                hargaTambahan = bulatkanBilangan(hargaTambahan)
                const actualPrice = hargaTambahan + 2500
                const taxCut = (actualPrice*9)/10
            }
        } else {
            res.status(500)
            res.json({
                "success": true,
                "message": "Data not found!"
            })
        }
    }
}