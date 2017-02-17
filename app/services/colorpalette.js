/**
 * Created by geek007 on 1/7/17.
 */
'use strict';
app.service('colorpalette', function(){

    var colors = [
        "#E4BB81",
        "#D2DE43",
        "#89DE43",
        "#DED493",
        "#DEDA65"
    ]

    this.getColor = function(i){
        if(colors.hasOwnProperty(i)) {
            return colors[i];
        }else{
            return colors[0];
        }
    }

})