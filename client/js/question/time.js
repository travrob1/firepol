
/* todo put this in a factory */
function time2words(theTimeString) {
        var delta = Date.now() - Date.parse(theTimeString);
        var val;
        if ( delta < 60 * 1000)
            return "seconds ago";
        else if ( delta < 60 * 60 * 1000) {
            val = eutil.trimNumber(delta / (60 * 1000));
            if (val == "1") {
                    return  + val + " minute ago";
            } else {
                return  + val + " minutes ago";
            }
        }
        else if ( delta < 24 * 60 * 60 * 1000) {
            val = eutil.trimNumber(delta / (60 * 60 * 1000));
            if (val == "1") {
                return val + " hour ago";
            } else {
                return val + " hours ago";
            }
        }
        else if ( delta < 30 * 24 * 60 * 60 * 1000) {
            val = eutil.trimNumber(delta / (24 * 60 * 60 * 1000));
            if (val == "1") {
                return val + " day ago";
            } else {
                return val + " days ago";
            }
        }
        else if ( delta < 12 * 30 * 24 * 60 * 60 * 1000) {
            val = eutil.trimNumber(delta / (30 * 24 * 60 * 60 * 1000));
            if (val == "1") {
                return val + " month ago";
            } else {
                return val + " months ago";
            }
        }
        else {
            val = eutil.trimNumber(delta / (12 * 30 * 24 * 60 * 60 * 1000));
            if (val == "1") {
                return val + " year ago";
            } else {
                return val + " years ago";
            }
        }
    }
