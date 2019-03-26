(function(){
    
    switch(location.pathname){
        case "/storage":
            if(isLocalStorageAvailable()){
                var data = localStorage.getItem('ipdetails') || undefined;
                if(data){
                    data = JSON.parse(data)
                    document.getElementById('ipaddr').innerHTML = data.query;
                    document.getElementById('city').innerHTML = data.city;
                }else{
                    getIpinfo()
                }
        
            }
            break;
    }


   //  -----------------------------------------
   //   Storage page
   //  -----------------------------------------

    // Check that localStorage is both supported and available
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

    // get current ip address infomation 
    function getIpinfo(){
        fetch("http://ip-api.com/json")
        .then(function(response){
            return response.json();
        }).then(function(response){
            console.log(response)
            document.getElementById('ipaddr').innerHTML = response.query;
            document.getElementById('city').innerHTML = response.city;
            localStorage.setItem("ipdetails", JSON.stringify(response))
        }).catch(function(error){
            console.log(error)
        })
    }

   //  -----------------------------------------
   //   Push notification page
   //  -----------------------------------------





})(window)