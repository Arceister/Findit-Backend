require('dotenv').config()
const bcrypt = require('bcrypt')
const db = require('../database')
const jwt = require('jsonwebtoken')
const jwt_key = process.env.SECRET_KEY_USER

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

module.exports = {
    kirimBarangBaru: async(req, res, next) => {
        const user = req.user
        const namaBarang = req.body.barang
        const tujuanLat = req.body.tujuanLat
        const tujuanLong = req.body.tujuanLong
        const coordinatTujuan = {"lat": tujuanLat, "lng": tujuanLong}
        var distancesArray = []
        const [rows] = await db.query('SELECT lat, lng, lokasi FROM rute_angkot')
        if (rows.length > 0) {
            for (var i = 0; i < rows.length; i++) {
                var angkotCoordinate = {"lat": rows[i].lat, "lng": rows[i].lng}
                var jarak = haversineDistance(angkotCoordinate, coordinatTujuan)
                var keyValue = {"lokasi": rows[i].lokasi, "jarak": jarak}
                distancesArray.push(keyValue)
            }
            distancesArray.sort(function (a, b) {
                return a.jarak - b.jarak
            })
            var price = distancesArray[0].jarak * 4000
            price = Math.round(price)
            db.query("INSERT INTO barang(id_pengirim, nama_barang, tujuan_lat, tujuan_long) VALUES(?,?,?,?)", [user.user_id, namaBarang, tujuanLat, tujuanLong])
            .then(() => {
                res.status(200)
                res.json({
                    "success": true,
                    "message": "Pengiriman sukses",
                    "harga": price
                })
            })
        } else {
            res.status(500)
            res.json({
                "success": false,
                "message": "Data not found!"
            })
        }
    }
}