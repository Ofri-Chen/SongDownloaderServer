function getJsonProperty(obj, path){
    let prop = obj;
    try{
        path.forEach(function(item){
            prop = item.includes('[') ? handleArrayProperty(prop, item) : prop[item];
        });
    }
    catch(err){
        prop = null;
    }

    return prop;
}

function toFirstLetterUpperCase(str){
    if(str){
        return str.split(' ').map(function(word){
            return word.charAt(0).toUpperCase() + word.substring(1, word.length);
        }).join(' ');
    }
    return str;
}

function handleArrayProperty(obj, prop){
    let splitProp = prop.split('[');
    let propName = splitProp[0];
    let index = splitProp[1].substring(0, splitProp[1].length - 1); //substring without the closing square bracket ']'
    return obj[propName][index];
}

module.exports = {
  getJsonProperty: getJsonProperty,
    toFirstLetterUpperCase: toFirstLetterUpperCase
};