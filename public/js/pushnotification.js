export default {
    init: function(){
        
        baseUrl = window.baseUrl;
        fabPushElement = document.querySelector('.fab__push');
        fabPushImgElement = document.querySelector('.fab__image');

        //Click event for subscribe push
        fabPushElement.addEventListener('click', function () {
            var isSubscribed = (fabPushElement.dataset.checked === 'true');
            if (isSubscribed) {
                unsubscribePush();
            }
            else {
                subscribePush();
            }
        });

        isPushSupported() //To check `push notification` is supported or not
    }
}
var fabPushElement, fabPushImgElement, baseUrl;


//To check `push notification` is supported or not
function isPushSupported() {
    //To check `push notification` permission is denied by user
    if (Notification.permission === 'denied') {
        alert('User has blocked push notification.');
        return;
    }

    //Check `push notification` is supported or not
    if (!('PushManager' in window)) {
        alert('Sorry, Push notification isn\'t supported in your browser.');
        return;
    }

    //Get `push notification` subscription
    //If `serviceWorker` is registered and ready
    navigator.serviceWorker.ready
    .then(function (registration) {
        registration.pushManager.getSubscription()
        .then(function (subscription) {
            //If already access granted, enable push button status
            if (subscription) {
                changePushStatus(true);
            }
            else {
                changePushStatus(false);
            }
        })
        .catch(function (error) {
            console.error('Error occurred while enabling push ', error);
        });
    });
}

// Ask User if he/she wants to subscribe to push notifications and then 
// ..subscribe and send push notification
function subscribePush() {
    navigator.serviceWorker.ready.then(function(registration) {
        if (!registration.pushManager) {
            alert('Your browser doesn\'t support push notification.');
            return false;
        }

        //To subscribe `push notification` from push manager
        registration.pushManager.subscribe({
            userVisibleOnly: true //Always show notification when received
        })
        .then(function (subscription) {
            toast('Subscribed successfully.');
            console.info('Push notification subscribed.');
            console.log(subscription);
            saveSubscriptionID(subscription);
            changePushStatus(true);
        })
        .catch(function (error) {
            changePushStatus(false);
            console.error('Push notification subscription error: ', error);
        });
    })
}

// Unsubscribe the user from push notifications
function unsubscribePush() {
    navigator.serviceWorker.ready
    .then(function(registration) {
        //Get `push subscription`
        registration.pushManager.getSubscription()
        .then(function (subscription) {
            //If no `push subscription`, then return
            if(!subscription) {
                alert('Unable to unregister push notification.');
                return;
            }

            //Unsubscribe `push notification`
            subscription.unsubscribe()
            .then(function () {
                toast('Unsubscribed successfully.');
                console.info('Push notification unsubscribed.');
                console.log(subscription);
                deleteSubscriptionID(subscription);
                changePushStatus(false);
            })
            .catch(function (error) {
                console.error(error);
            });
        })
        .catch(function (error) {
            console.error('Failed to unsubscribe push notification.');
        });
    })
}

//To change status
function changePushStatus(status) {
    fabPushElement.dataset.checked = status;
    fabPushElement.checked = status;
    if (status) {
        fabPushElement.classList.add('active');
        fabPushImgElement.src = '/images/push-on.png';
    }
    else {
        fabPushElement.classList.remove('active');
        fabPushImgElement.src = '/images/push-off.png';
    }
}


// save user subscription id in database for push notification
function saveSubscriptionID(subscription) {
    var subscription_id = subscription.endpoint.split('gcm/send/')[1];

    console.log("Subscription ID", subscription_id);
    // alert("sub id "+ subscription_id)
    document.getElementById('deviceId').innerHTML = subscription_id;

    fetch(baseUrl+'/api/subscribe', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscription_id : subscription_id })
    }).catch(function(error){
        console.log(error)
    });
}

// delete user subscription id from database to avoid push notification
function deleteSubscriptionID(subscription) {
    var subscription_id = subscription.endpoint.split('gcm/send/')[1];

    fetch(baseUrl+'/api/unsubscribe', {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subscription_id : subscription_id })
    }).catch(function(error){
        console.log(error)
    });
}