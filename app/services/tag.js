/**
 * Created by geek007 on 12/25/16.
 */
'use strict';
app.service('tag', function (colorpalette, api) {
    var tags = {};
    var c = {};
    var allowed_tags = [];
    var tags_count = {};
    var instance = this;
    instance.remove_from_stats = function(tag){
        tags_count[tag] =  undefined;
    }
    instance.remove_from_tags = function(tag){
      var parts = tag.split(" ")
      console.log(tag)
      console.log(tags[parts[0]])
      tags[parts[0]] = undefined
    }

    instance.stats = function (tag, color) {
        if (tags_count.hasOwnProperty(tag)) {
            tags_count[tag]["count"] = tags_count[tag]["count"] + 1;

        } else {
            tags_count[tag] = {"count": 1, color: color}
        }

    };

    instance.escapeRegExp  = function (str) {
      return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    instance.getStats = function () {
      return tags_count;
    };


    instance.cleanTag = function(input){
      return input.replace(/^[B-I]-/,"")
    }


    instance.add = function (parent_word, nextword, tag) {
        tag = instance.cleanTag(tag)
        if (!tags.hasOwnProperty(parent_word)) {
            if (allowed_tags.indexOf(tag) < 0) {
                allowed_tags.push(tag)
            }

            //if (typeof nextword == 'object') {
            //    nextword = nextword.join(" ");
            //}

            tags[parent_word] = {
                tag: tag,
                count: 0,
                nextWords:[nextword]
            }

        } else {
            if (parent_word != nextword) {
                var add = true;
                var next_word = tags[parent_word]['nextWords'];

                next_word.forEach(function(words){
                    if(words.length == nextword.length){
                        words.forEach(function(w,i){
                            if(w != nextword[i]){
                                add = true;
                                return;
                            }

                            add = false;

                        })
                    }

                })
                //var nextwords = tags[parent_word]['nextword'];
                //if (nextwords instanceof Array){
                  //  if(nextwords.indexOf(nextword) < 0) {
                        tags[parent_word]['count'] = tags[parent_word]['count'] + 1;
                        if(add){
                            tags[parent_word]['nextWords'].push(nextword);
			}
                   // }
               // }
            }


        }
    };

    var colorCount = 0;
    instance.highlight = function (word) {
        var position = word.indexOf("-");
        var tagd = [];

        var tag_name = word;
        if (position == 1) {
            tag_name = word.substr(position+1);
        }
        var color = "yellow";
        if (c.hasOwnProperty(tag_name)) {
            color = c[tag_name];
        } else {
            color = colorpalette.getColor(colorCount);
            c[tag_name] = color;
            colorCount++;
        }
        tagd[0] = tag_name;
        tagd[1] = color;

        return tagd;

    };


    instance.highlightByRegex = function (tags, content) {
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
    };

    instance.getAll = function () {
        return tags

    };

    instance.getAllowedTags = function () {
        let tags = localStorage.getItem('tags')
        if(tags) {
            return tags
        }
        api.get('tags', function (res) {
            if (res.status == 200) {
                if (typeof localStorage != undefined) {
                    localStorage.setItem('tags', JSON.stringify(res.data));
                    return localStorage.getItem('tags')
                }
            }

        }, function (err) {
            console.log(err)
        });
    }
})
