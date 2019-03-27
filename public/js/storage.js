export default{
    init: function(){
        // check whether localstorage is available or not 
        if(isLocalStorageAvailable()){
            var data = localStorage.getItem('ipdetails') || undefined;
            if(data){
                data = JSON.parse(data)
                document.getElementById('ipaddr').innerHTML = data.query || data.ip;
                document.getElementById('city').innerHTML = data.city;
            }else{
                // fetch data from api
                getIpinfo()
            }

        }
    }
}

// Check that localStorage is supported and available
function isLocalStorageAvailable() {
    try {
        var storage = window['localStorage'],
            x = 'pwa-storage-test';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return false;
    }
}

// get current ip address and locataion information and store in localstorage
function getIpinfo(){
    var ipUrl = (location.protocol === "https:")? "https://ipinfo.io/json": "http://ip-api.com/json"
    fetch(ipUrl)
    .then(function(response){
        return response.json();
    }).then(function(response){
        console.log(response)
        document.getElementById('ipaddr').innerHTML = response.query || response.ip;
        document.getElementById('city').innerHTML = response.city;
        localStorage.setItem("ipdetails", JSON.stringify(response))
    }).catch(function(error){
        toast('Something went wrong...');
        alert(error)
    })
}