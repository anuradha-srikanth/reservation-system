// var socket = io.connect('/');
// socket.on('players', function (data) {
//   console.log(data);
//   $("#numPlayers").text(data.number);
// });


// socket.on('welcome', function (data) {
//   console.log(data);
//   $("#wel").text(data.message + data.number);
// });

// // socket.on('chat message',function(data){
// //     console.log(data);
// //     // $
// // })

// // 

// // $('form').submit(function(e){
// //     e.preventDefault();
// //     //socket.emit('chat message', $('#m').val());
// //     //console.log($('#m').val());
// //     //$('#m').val('');
// //     socket.emit("test");
// //     //return false;
// // }); 

// //$('#submit').click(function(){
// window.onload = function(){

//     document.getElementById('sub1').onclick = function(){
//         // console.log('heloo');
//         // socket.emit("test")
//         socket.emit('get user', $('#username').val());
//         // $('#username').val('');

//     };

//     socket.on('display chat', function(data){
//         $("#window").show();
//         $('#user-form').css("display", "none");
//         $("#name1").text(`Hello ${data.user}`);
//         // $("#messages").append(`<li> ${data.message} </li>`);
//         // $("#messages").text(data.message);
//     });

//     document.getElementById('submit').onclick = function(){
//         // console.log('heloo');
//         // socket.emit("test")
//         socket.emit('chat message', $('#m').val());
//         $('#m').val('');
//     };

//     socket.on('send', function(data){
//         $("#messages").append(`<li> ${data.user} says: ${data.message} </li>`);
//         // $("#messages").text(data.message);
//     });

//     socket.on('timeout', function(data){
//         $("#timeo").text(`Seconds since start of chat: ${data.mess}`) 
//         // socket.emit("update time", data.mess+1);
//     })


// };


var rows,cols;
var selectCount = 1;
var socket = io.connect('/');

socket.on('seat_update', function (data, sid) {
    var target = $('div[data-x = ' + data.x + '][data-y = ' + data.y + ']');
    target.removeClass('enable'); // Remove class attributes for seat.
                target.addClass('disable');   // Add class attributes for seat.
                target.off('click');          // Remove onclick listener.
                
                // If I'm the one who requested,
                // Remove 'diabled' class from seat.
                // Add 'mySeat' class properties and add click listener for canceling.
                if (sid == socket.id) {
                    target.removeClass('disable'); 
                    target.addClass('mySeat').on('click', onClickSeatCancel); 
                }
            });

socket.on('seatUpdateBatch', function (data, sid) {
    data.forEach(function (xyArray) {
        var target = $('div[data-x = ' + xyArray[0] + '][data-y = ' + xyArray[1] + ']');
                    target.removeClass('enable'); // Remove class attributes for seat.
                    target.addClass('disable');   // Add class attributes for seat.
                    target.off('click');          // Remove onclick listener.

                    if (sid == socket.id) {
                        target.removeClass('disable'); 
                        target.addClass('mySeat').on('click', onClickSeatCancel); 
                    }
                });
});

socket.on('reserveReject', function () { alert('Seats rejected.'); })

socket.on('seat_cancel_update', function (data, sid) {
    var target = $('div[data-x = ' + data.x + '][data-y = ' + data.y + ']');
    target.removeClass('disable');
    target.removeClass('mySeat');
    target.off('click');
    target.addClass('enable').on('click', onClickSeat);;
});


var onClickSeat = function () {
    var clickX = $(this).attr('data-x');
    var clickY = $(this).attr('data-y');

//                var seats = [];
//                
//                for (var i = 0; i < selectCount; i++) {
//                    if (Number(clickX) + i < cols) seats.push([Number(clickX)+i, Number(clickY)]);
//                    else alert('seat not added');
//                }
//                
//                var check = confirm('Reserve ' + seats.length + " seats?");
//                
//                if (check && $(this).hasClass('enable')) {
//                    socket.emit('reserveBatch', seats);
//                }

                // If seat in available and user confirmed.
                if ($(this).hasClass('enable') && confirm('Reserve this seat?')) {
                 socket.emit('reserve', {
                     x: clickX,
                     y: clickY
                 });
             }
         }
         var onClickSeatCancel = function () {
             var x = $(this).attr('data-x');
             var y = $(this).attr('data-y');

             if (confirm('Cancel this seat?')) {
                 socket.emit('cancel', {
                     x: x,
                     y: y
                 });
             }
         }

         // $(document).ready(function () {
         //     /* Dummy Object Argument is for IE Bug fix. */
         //     $.getJSON('/seats', { dummy: new Date().getTime() }, function (data) {
         //         rows = data.length;
         //         cols = data[0].length;
         //         $.each(data, function (indexY, line) {
         //          var $line = $('<div></div>').addClass('line');
         //          $.each(line, function (indexX, seat) {
         //              var output = $('<div></div>', {
         //                  'class': 'seat',
         //                  'data-x': indexX,
         //                  'data-y': indexY
         //              }).appendTo($line);
         //              if (seat == 1)
         //                  output.addClass('enable').on('click', onClickSeat);
         //              else if (seat == 2)
         //                  output.addClass('disable');
         //          });
         //          $line.appendTo('body');
         //      }); 
         //     });
         // });