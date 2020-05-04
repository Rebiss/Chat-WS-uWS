const sendMessageLength = 200;

const PORT = process.env.HTTP_PORT || 3000;

const initalConfig = {
  regExpObscenceWord: /[!@#$%^&*(),.?":{}|~;]/gm
};

const obsceneWords = [
    "agark", "chatlx", "pchin", "ccox", "vijvac", "putank", "gyot", "fuc", "pix", "g7", "boz", "qune", "tameq",
    "cameq", "quna", "kune", "gandon", "porn", "klir", "klri", "&cnem", "cceq", "cc..eq", "xaxpa", "suke", "ttcnem",
    "xer", "pupul", "xeri", "shrem", "puc", "jaj", "Jashtam", "jasht", "ccnem", "ccen", "minet", "pidr", "garlax",
    "chatlax", "tsayr", "cayr", "oral", "69", "ambordini", "heshtoc", "argand", "vort", "anal", "mor", "pahpanak",
    "yobni", "qaq", "tnox", "cnox", "lavt", "kngat", "hor", "sikt", "qac", "domp", "arnandam", "qsem", "lirb",
    "cpnem", "tapem", "vivaro", "ajara", "toto", "qunvel", "qunel",
    "ագառկա", "չաթլախ", "վիժվածք", "պուտանկա", "գյոթ", "գ7", "բօզ", "բոզ", "քունե", "գանդ", "կլիր", "կլրտ", "խեռոց",
    "ծծցնե", "ծցնե", "խեռ", "շրեմ", "շռեմ", "պուց", "ժաժ", "չաթլախ", "հեշտոց", "հեշտօց", "արգանդ", "առնանդամ",
    "արնանդամ", "մինետ", "պիդ", "գառլախ", "ծաիր", "օռալ", "թափեմ", "կօխեմ", "կոխեմ", "վիվառ", "աջարա", "տոտո",
    "տօտօ", "մորտ", "պահպանակ", "յոբնի", "լակոտ", "քաք", "ծնող", "լավտ", "կնգատ", "հորտ", "աղջկատ", "սիկտիր", "քած",
    "քաձ", "դոմփ",
    "Piss off", "fuck", "shit", "dick", "asshole", "betch", "Bitch", "Damn", "Choad", "Bloody Hell", "Crikey",
    "Rubbish", "г7", "Shag", "Wanker", "Taking the piss", "Twat", "Bugger", "Get Stuffed", "Fair suck of the sav",
    "suck", "ЕБАЛ", "Пизда", "Хуй", "Бляд", "ЁБНУЛ", "ЗАЕБАЛ", "ЗАЁБ", "ИСПИЗДЕЛ", "ХУЁВО", "ЕБЁТ", "ЁБ", "трах",
    "агарка", "путан", "гет", "гЁт", "г7", "боз", "куне", "гандон", "клир", "ттцне", "тцне", "ццне", "хер", "жаж",
    "чатлах"
  ].join('|');

const required = title => {
    throw new Error(`${title} is required property`)
  };

//! URL validation. return Boolean.
const containsUrl = messege => {
   //(?=(https?:\/\/)|(?=w{3,}\.)|(?=(\w+[-.]\w+)+\b)).*
    const res = messege.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm);
    return res == null ? false : true;
  }

//! Giphy validation. return Boolean.
const containsGiphy = message => {
    const res = message.match(/\b(?:(http|https)|media|com|giphy|gif)\b/gi);
    return res && res.length === 7;
  };

module.exports = {
    obsceneWords: obsceneWords,
    maxLength: sendMessageLength,
    initalConfig: initalConfig,
    required: required,
    containsUrl: containsUrl,
    containsGiphy: containsGiphy,
    PORT: PORT
}