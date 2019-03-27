export default{
    init: function(){
        // check for Geolocation support
        if (navigator.geolocation) {
            console.log('Geolocation is supported!');

            var startPos;
            var geoSuccess = function(position) {
                startPos = position;
                document.getElementById('latitude').innerHTML = startPos.coords.latitude;
                document.getElementById('longitude').innerHTML = startPos.coords.longitude;
            };
            var geoError = function(error) {
                alert('Error occurred. Error code: ' + error.code);
                // error.code can be:
                //   0: unknown error
                //   1: permission denied
                //   2: position unavailable (error response from location provider)
                //   3: timed out
            };
            navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
        }
        else {
            alert('Geolocation is not supported for this Browser/OS.');
        }
    }
}