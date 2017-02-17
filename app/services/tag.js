/**
 * Created by geek007 on 12/25/16.
 */
'use strict';
app.service('tag', function (colorpalette) {
    var tags = {};
    var c = {};
    var allowed_tags = [];


    this.add = function (parent_word, nextword, tag) {

        if (!tags.hasOwnProperty(parent_word)) {
            if (allowed_tags.indexOf(tag) < 0) {
                allowed_tags.push(tag)
            }
            tags[parent_word] = {
                tag: tag,
                nextword: []
            }

        } else {
            if (parent_word != nextword) {
                var nextwords = tags[parent_word]['nextword'];
                if (nextwords.indexOf(nextword) < 0) {
                    tags[parent_word]['nextword'].push(nextword)
                }
            }



        }
    };

    var colorCount = 0;
    this.highlight = function (word) {
        var parts = word.split("-");
        var tagd = [];
        var color = colorpalette.getColor(c);

        if (parts.length == 2) {
            var tag_name = parts[1];
            var color = "yellow";
            if (c.hasOwnProperty(tag_name)) {
                color = c[tag_name];
            } else {
                color = colorpalette.getColor(colorCount);
                c[tag_name] = color;
                colorCount++;
            }
            tagd[0] = parts[1];
            tagd[1] = color;
        }
        return tagd;

    };


    this.highlightByRegex = function (tags, content) {
        var history = {};
        var c = 0;
        var sp = document.createElement("span");
        var keys = Object.keys(tags);
        var fkeys = []
        keys.forEach(function (key) {
            if (key !== "|") {
                fkeys.push(key.replace(/\./g, "\\."))
            }
        })
        var regexStr = fkeys.join("\\b|\\b").replace(/\\b\.\\b\|/g, "");
        var regex = new RegExp("\\b" + regexStr + "\\b", "gi")
        console.log(regexStr)
        console.log(regex)
        content = content.replace(regex, function (matchedKey) {

            var color = "";
            var value = tags[matchedKey];
            if (typeof value !== "undefined") {
                if (history.hasOwnProperty(value)) {
                    color = history[value];
                } else {
                    color = colorpalette.getColor(c);
                    history[value] = color;
                    c++;
                }

                sp.setAttribute('title', value);
                sp.setAttribute('class', 'text-highlight')
                sp.style.setProperty('background', color);
                sp.innerHTML = matchedKey;
                return sp.outerHTML;
            } else {
                return "";
            }

        })
        /*tags.forEach(function(tag){
         var text = Object.keys(tag)[0];
         if(text != ".") {
         var value = tag[text];
         var color = "";
         if(history.hasOwnProperty(value)){
         color = history[value];
         }else {
         color = colorpalette.getColor(c);
         history[value] = color;
         c++;
         }

         sp.setAttribute('title', value);
         sp.setAttribute('class','text-highlight')
         sp.style.setProperty('background' , color);
         sp.innerHTML = text;
         console.log(sp.outerHTML)

         content = content.replace(text, sp.outerHTML)
         }

         })*/
        return content;
    }

    this.getAll = function () {
        return tags;
    }

    this.getAllowedTags = function(){
        return allowed_tags;
    }
})