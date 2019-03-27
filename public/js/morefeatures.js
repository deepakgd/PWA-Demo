export default{
    init: function(){
        const fileInput = document.getElementById('file-input');

        fileInput.addEventListener('change', function(e){
            alert(e.target.files)
        });

        // ---------------------------------------
        // storage access
        // ---------------------------------------

        if (navigator.storage) {
            // document.getElementById('latitude').innerHTML = startPos.coords.latitude;
            navigator.storage.estimate().then(function(estimate){
                document.getElementById('usedStorage').innerHTML = estimate.usage + " bytes";
                document.getElementById('availableStorage').innerHTML = estimate.quota + " bytes";
            }).catch(function(error){
                alert(error)
            })
            
        }else{
            alert("Storage access not supported")
        }
        

        // ---------------------------------------
        // device motion
        // ---------------------------------------
        if ('LinearAccelerationSensor' in window && 'Gyroscope' in window) {
            document.getElementById('moApi').innerHTML = 'Generic Sensor API';
            
            let lastReadingTimestamp;
            let accelerometer = new LinearAccelerationSensor();
            accelerometer.addEventListener('reading', e => {
            if (lastReadingTimestamp) {
                intervalHandler(Math.round(accelerometer.timestamp - lastReadingTimestamp));
            }
            lastReadingTimestamp = accelerometer.timestamp
            accelerationHandler(accelerometer, 'moAccel');
            });
            accelerometer.start();
            
            if ('GravitySensor' in window) {
                let gravity = new GravitySensor();
                gravity.addEventListener('reading', e => accelerationHandler(gravity, 'moAccelGrav'));
                gravity.start();
            }
            
            let gyroscope = new Gyroscope();
            gyroscope.addEventListener('reading', e => rotationHandler({
                alpha: gyroscope.x,
                beta: gyroscope.y,
                gamma: gyroscope.z
            }));
            gyroscope.start();
            
        } else if ('DeviceMotionEvent' in window) {
            document.getElementById('moApi').innerHTML = 'Device Motion API';
            
            var onDeviceMotion = function (eventData) {
                accelerationHandler(eventData.acceleration, 'moAccel');
                accelerationHandler(eventData.accelerationIncludingGravity, 'moAccelGrav');
                rotationHandler(eventData.rotationRate);
                intervalHandler(eventData.interval);
            }
            
            window.addEventListener('devicemotion', onDeviceMotion, false);
        } else {
            document.getElementById('moApi').innerHTML = 'No Accelerometer & Gyroscope API available';
        }
        
        function accelerationHandler(acceleration, targetId) {
            var info, xyz = "[X, Y, Z]";
        
            info = xyz.replace("X", acceleration.x && acceleration.x.toFixed(3));
            info = info.replace("Y", acceleration.y && acceleration.y.toFixed(3));
            info = info.replace("Z", acceleration.z && acceleration.z.toFixed(3));
            document.getElementById(targetId).innerHTML = info;
        }
        
        function rotationHandler(rotation) {
            var info, xyz = "[X, Y, Z]";
        
            info = xyz.replace("X", rotation.alpha && rotation.alpha.toFixed(3));
            info = info.replace("Y", rotation.beta && rotation.beta.toFixed(3));
            info = info.replace("Z", rotation.gamma && rotation.gamma.toFixed(3));
            document.getElementById("moRotation").innerHTML = info;
        }
        
        function intervalHandler(interval) {
            document.getElementById("moInterval").innerHTML = interval;
        }


        // ---------------------------------------
        // vibrate mobile
        // ---------------------------------------
        document.getElementById('vibrateSimple').addEventListener('click', function(event){
            if(navigator.vibrate){
                navigator.vibrate(200);
            }else alert("Vibration not supported in this device")
        })

        document.getElementById('vibratePattern').addEventListener('click', function(event){
            if(navigator.vibrate){
                navigator.vibrate([100, 200, 200, 200, 500]);
            }else alert("Vibration not supported in this device")
        })


        // ---------------------------------------
        // battery
        // ---------------------------------------
        if ('getBattery' in navigator || ('battery' in navigator && 'Promise' in window)) {
            var target = document.getElementById('target');
        
            function handleChange(change) {
                var timeBadge = new Date().toTimeString().split(' ')[0];
                var newState = document.createElement('p');
                newState.innerHTML = '<span class="badge">' + timeBadge + '</span> ' + change + '.';
                target.appendChild(newState);
            }
            
            function onChargingChange() {
                handleChange('Battery charging changed to <b>' + (this.charging ? 'charging' : 'discharging') + '</b>')
            }
            function onChargingTimeChange() {
                handleChange('Battery charging time changed to <b>' + this.chargingTime + ' s</b>');
            }
            function onDischargingTimeChange() {
                handleChange('Battery discharging time changed to <b>' + this.dischargingTime + ' s</b>');
            }
            function onLevelChange() {
                handleChange('Battery level changed to <b>' + this.level + '</b>');
            }
        
            var batteryPromise;
            
            if ('getBattery' in navigator) {
                batteryPromise = navigator.getBattery();
            } else {
                batteryPromise = Promise.resolve(navigator.battery);
            }
            
            batteryPromise.then(function (battery) {
                document.getElementById('charging').innerHTML = battery.charging ? 'charging' : 'discharging';
                document.getElementById('chargingTime').innerHTML = battery.chargingTime + ' s';
                document.getElementById('dischargingTime').innerHTML = battery.dischargingTime + ' s';
                document.getElementById('level').innerHTML = battery.level;
                
                battery.addEventListener('chargingchange', onChargingChange);
                battery.addEventListener('chargingtimechange', onChargingTimeChange);
                battery.addEventListener('dischargingtimechange', onDischargingTimeChange);
                battery.addEventListener('levelchange', onLevelChange);
            });
        }

        // ---------------------------------------
        // Device memory
        // ---------------------------------------
        if(navigator.deviceMemory){
            document.getElementById('deviceMemory').innerHTML = navigator.deviceMemory || 'unknown'
        }else alert("Device memeory access not supported in this device")


        // ---------------------------------------
        // network type and status
        // ---------------------------------------
        function getConnection() {
            return navigator.connection || navigator.mozConnection ||
                navigator.webkitConnection || navigator.msConnection;
        }
        
        function updateNetworkInfo(info) {
            document.getElementById('networkType').innerHTML = info.type;
            document.getElementById('effectiveNetworkType').innerHTML = info.effectiveType;
            document.getElementById('downlinkMax').innerHTML = info.downlinkMax;
        }
        
        var info = getConnection();
        if (info) {
            info.addEventListener('change', updateNetworkInfo);
            updateNetworkInfo(info);
        }
    }
}