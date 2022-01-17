//"10.8.3.13" "10.8.3.16"
const balance = {
    name : "Balance 1",
    ip : "10.8.3.13",
    port : 502
}

var client = new ModbusClient()
var value = 0.0
var offset = 0.0



$(document).ready(function () {

    connect()

        
    $('#button_zero').on('click', function () {
        offset = value
        $("#value").html("000.0")

        
    });


    setInterval(update, 1000);

});

var read_value = function() {
    var start = 0x2,
    count = 2;
    console.log("interval")
client.readHoldingRegisters(start, count).then(function (data, request) {
    value = convertToFloat(data)
    $("#value").html((value - offset).toFixed(1))

}).fail(function (err) {

    $("#status").html(err)

});
}

var update = function() {
    read_value()
    var p_unit = $("#p_unit").val()

    if (p_unit > 0) {
        var quantity = Math.round((value * 1000 / p_unit))
        $("#quantity").html(quantity)
    } else {
        $("#quantity").html("_")
    }
}



var convertToFloat = function (data) {
    var buffer = new ArrayBuffer(4)
    var view = new DataView(buffer)
    view.setInt16(0, data[0])
    view.setInt16(2, data[1])
    return(view.getFloat32(0))
}

var connect = function () {

    client.connect(balance.ip, balance.port)
    

}



client.on('online', function () {
    $("#title").html(balance.name)
    $("#status").html("connexion OK")
 
 });
 
 client.on('offline', function () {
 
    $("#status").html("déconnecté")
    $("#title").html("Balance hors ligne")
 
 });
 
 client.on('error', function () {
 
    $("#status").html("error")
    connect()
 
 });