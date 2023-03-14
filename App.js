import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  Modal,
  Dimensions,
  TouchableNativeFeedback,
  Animated,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Vibration,
  ActivityIndicator,
  Alert,
  Keyboard,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import Logo from "./payu_logo_u_reverse.png";
import axios from "axios";
import IMGMastercard from "./mastercard.png";
import IMGVisa from "./visa.png";
import md5 from "md5";
import { useForm } from "react-hook-form";
import { thousandsSystem } from "./helpers/libs";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

export default function App({
  mainColor = "#A5C312",
  backgroundColor = "#FFFFFF",
  backgroundColorInput = "#EEEEEE",
  colorTitle = "#A5C312",
  placeholderTextColor = "#AAAAAA",
  textColor = "#444444",
  shortInformationColor = "#666666",
  colorTextButton = "#FFFFFF",
  backgroundColorButton = "#A5C312",
  title = "PAYU",
  subtitle = "Plan basico",
  description = "Añade un método de pago para completar la compra. Solo Payu puede ver tus datos de pago.",
  logo,
  amount = 0,
  email,
  payuConfig = {},
  success,
  failed,
  test = true,
  activePayment = true,
  setActivePayment
}) {
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    register("card", {
      value: "",
      required: true,
      validate: (num) => num.length >= 14 || "Tarjeta incompleta.",
    });
    register("identification", { value: "", required: true });
    register("mmaa", {
      value: "",
      required: true,
      validate: (num) => {
        if (num.length !== 4) return "MMAA incompleto.";

        const mm = num.slice(0, 2);
        const yy = num.slice(2, 4);

        if (parseInt(yy) < 23) return "La tarjeta expiró";
        if (parseInt(mm) > 12 || parseInt(mm) === 0) return "Mes invalido.";
        if (parseInt(yy) > 40) return "Año invalido.";
      },
    });
    register("cvc", {
      value: "",
      required: true,
      validate: (num) => num.length === 3 || "CVC incompleto",
    });
    register("fullName", { value: "", required: true });
    register("country", { value: "", required: true });
    register("city", { value: "", required: true });
    register("phoneNumber", {
      value: "",
      required: true,
      validate: (num) => num.length >= 10 || "Número de teléfono inválido",
    });
    register("postalCode", {
      value: "",
      required: true,
      validate: (num) => num.length >= 3 || "Postal invalido.",
    });
    register("state", { value: "", required: true });
  }, []);

  const [cards, setCards] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("@cards");
        if (JSON.parse(jsonValue)) setCards(JSON.parse(jsonValue));
        else setCards([]);
      } catch (e) {
        console.log(e);
      }
    };

    getData();
  }, []);

  const [loading, setLoading] = useState(false);
  const [activeAdd, setActiveAdd] = useState(false);
  const [type, setType] = useState("");

  const [card, setCard] = useState("");
  const [identification, setIdentification] = useState("");
  const [mmaa, setMmaa] = useState("");
  const [cvc, setCvc] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [state, setState] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [error, setError] = useState("");
  const [cardType, setCardType] = useState("");
  const [errorValidation, setErrorValidation] = useState(false);

  const countries = [
    {
      country_name: "Afghanistan",
      country_short_name: "AF",
      country_phone_code: 93,
    },
    {
      country_name: "Albania",
      country_short_name: "AL",
      country_phone_code: 355,
    },
    {
      country_name: "Algeria",
      country_short_name: "DZ",
      country_phone_code: 213,
    },
    {
      country_name: "American Samoa",
      country_short_name: "AS",
      country_phone_code: 1684,
    },
    {
      country_name: "Andorra",
      country_short_name: "AD",
      country_phone_code: 376,
    },
    {
      country_name: "Angola",
      country_short_name: "AO",
      country_phone_code: 244,
    },
    {
      country_name: "Anguilla",
      country_short_name: "AI",
      country_phone_code: 1264,
    },
    {
      country_name: "Antarctica",
      country_short_name: "AQ",
      country_phone_code: 0,
    },
    {
      country_name: "Antigua And Barbuda",
      country_short_name: "AG",
      country_phone_code: 1268,
    },
    {
      country_name: "Argentina",
      country_short_name: "AR",
      country_phone_code: 54,
    },
    {
      country_name: "Armenia",
      country_short_name: "AM",
      country_phone_code: 374,
    },
    {
      country_name: "Aruba",
      country_short_name: "AW",
      country_phone_code: 297,
    },
    {
      country_name: "Australia",
      country_short_name: "AU",
      country_phone_code: 61,
    },
    {
      country_name: "Austria",
      country_short_name: "AT",
      country_phone_code: 43,
    },
    {
      country_name: "Azerbaijan",
      country_short_name: "AZ",
      country_phone_code: 994,
    },
    {
      country_name: "Bahamas The",
      country_short_name: "BS",
      country_phone_code: 1242,
    },
    {
      country_name: "Bahrain",
      country_short_name: "BH",
      country_phone_code: 973,
    },
    {
      country_name: "Bangladesh",
      country_short_name: "BD",
      country_phone_code: 880,
    },
    {
      country_name: "Barbados",
      country_short_name: "BB",
      country_phone_code: 1246,
    },
    {
      country_name: "Belarus",
      country_short_name: "BY",
      country_phone_code: 375,
    },
    {
      country_name: "Belgium",
      country_short_name: "BE",
      country_phone_code: 32,
    },
    {
      country_name: "Belize",
      country_short_name: "BZ",
      country_phone_code: 501,
    },
    {
      country_name: "Benin",
      country_short_name: "BJ",
      country_phone_code: 229,
    },
    {
      country_name: "Bermuda",
      country_short_name: "BM",
      country_phone_code: 1441,
    },
    {
      country_name: "Bhutan",
      country_short_name: "BT",
      country_phone_code: 975,
    },
    {
      country_name: "Bolivia",
      country_short_name: "BO",
      country_phone_code: 591,
    },
    {
      country_name: "Bosnia and Herzegovina",
      country_short_name: "BA",
      country_phone_code: 387,
    },
    {
      country_name: "Botswana",
      country_short_name: "BW",
      country_phone_code: 267,
    },
    {
      country_name: "Bouvet Island",
      country_short_name: "BV",
      country_phone_code: 0,
    },
    {
      country_name: "Brazil",
      country_short_name: "BR",
      country_phone_code: 55,
    },
    {
      country_name: "British Indian Ocean Territory",
      country_short_name: "IO",
      country_phone_code: 246,
    },
    {
      country_name: "Brunei",
      country_short_name: "BN",
      country_phone_code: 673,
    },
    {
      country_name: "Bulgaria",
      country_short_name: "BG",
      country_phone_code: 359,
    },
    {
      country_name: "Burkina Faso",
      country_short_name: "BF",
      country_phone_code: 226,
    },
    {
      country_name: "Burundi",
      country_short_name: "BI",
      country_phone_code: 257,
    },
    {
      country_name: "Cambodia",
      country_short_name: "KH",
      country_phone_code: 855,
    },
    {
      country_name: "Cameroon",
      country_short_name: "CM",
      country_phone_code: 237,
    },
    {
      country_name: "Canada",
      country_short_name: "CA",
      country_phone_code: 1,
    },
    {
      country_name: "Cape Verde",
      country_short_name: "CV",
      country_phone_code: 238,
    },
    {
      country_name: "Cayman Islands",
      country_short_name: "KY",
      country_phone_code: 1345,
    },
    {
      country_name: "Central African Republic",
      country_short_name: "CF",
      country_phone_code: 236,
    },
    {
      country_name: "Chad",
      country_short_name: "TD",
      country_phone_code: 235,
    },
    {
      country_name: "Chile",
      country_short_name: "CL",
      country_phone_code: 56,
    },
    {
      country_name: "China",
      country_short_name: "CN",
      country_phone_code: 86,
    },
    {
      country_name: "Christmas Island",
      country_short_name: "CX",
      country_phone_code: 61,
    },
    {
      country_name: "Cocos (Keeling) Islands",
      country_short_name: "CC",
      country_phone_code: 672,
    },
    {
      country_name: "Colombia",
      country_short_name: "CO",
      country_phone_code: 57,
    },
    {
      country_name: "Comoros",
      country_short_name: "KM",
      country_phone_code: 269,
    },
    {
      country_name: "Cook Islands",
      country_short_name: "CK",
      country_phone_code: 682,
    },
    {
      country_name: "Costa Rica",
      country_short_name: "CR",
      country_phone_code: 506,
    },
    {
      country_name: "Cote D'Ivoire (Ivory Coast)",
      country_short_name: "CI",
      country_phone_code: 225,
    },
    {
      country_name: "Croatia (Hrvatska)",
      country_short_name: "HR",
      country_phone_code: 385,
    },
    {
      country_name: "Cuba",
      country_short_name: "CU",
      country_phone_code: 53,
    },
    {
      country_name: "Cyprus",
      country_short_name: "CY",
      country_phone_code: 357,
    },
    {
      country_name: "Czech Republic",
      country_short_name: "CZ",
      country_phone_code: 420,
    },
    {
      country_name: "Democratic Republic Of The Congo",
      country_short_name: "CD",
      country_phone_code: 243,
    },
    {
      country_name: "Denmark",
      country_short_name: "DK",
      country_phone_code: 45,
    },
    {
      country_name: "Djibouti",
      country_short_name: "DJ",
      country_phone_code: 253,
    },
    {
      country_name: "Dominica",
      country_short_name: "DM",
      country_phone_code: 1767,
    },
    {
      country_name: "Dominican Republic",
      country_short_name: "DO",
      country_phone_code: 1809,
    },
    {
      country_name: "East Timor",
      country_short_name: "TP",
      country_phone_code: 670,
    },
    {
      country_name: "Ecuador",
      country_short_name: "EC",
      country_phone_code: 593,
    },
    {
      country_name: "Egypt",
      country_short_name: "EG",
      country_phone_code: 20,
    },
    {
      country_name: "El Salvador",
      country_short_name: "SV",
      country_phone_code: 503,
    },
    {
      country_name: "Equatorial Guinea",
      country_short_name: "GQ",
      country_phone_code: 240,
    },
    {
      country_name: "Eritrea",
      country_short_name: "ER",
      country_phone_code: 291,
    },
    {
      country_name: "Estonia",
      country_short_name: "EE",
      country_phone_code: 372,
    },
    {
      country_name: "Ethiopia",
      country_short_name: "ET",
      country_phone_code: 251,
    },
    {
      country_name: "Falkland Islands",
      country_short_name: "FK",
      country_phone_code: 500,
    },
    {
      country_name: "Faroe Islands",
      country_short_name: "FO",
      country_phone_code: 298,
    },
    {
      country_name: "Fiji Islands",
      country_short_name: "FJ",
      country_phone_code: 679,
    },
    {
      country_name: "Finland",
      country_short_name: "FI",
      country_phone_code: 358,
    },
    {
      country_name: "France",
      country_short_name: "FR",
      country_phone_code: 33,
    },
    {
      country_name: "French Guiana",
      country_short_name: "GF",
      country_phone_code: 594,
    },
    {
      country_name: "French Polynesia",
      country_short_name: "PF",
      country_phone_code: 689,
    },
    {
      country_name: "French Southern Territories",
      country_short_name: "TF",
      country_phone_code: 0,
    },
    {
      country_name: "Gabon",
      country_short_name: "GA",
      country_phone_code: 241,
    },
    {
      country_name: "Gambia The",
      country_short_name: "GM",
      country_phone_code: 220,
    },
    {
      country_name: "Georgia",
      country_short_name: "GE",
      country_phone_code: 995,
    },
    {
      country_name: "Germany",
      country_short_name: "DE",
      country_phone_code: 49,
    },
    {
      country_name: "Ghana",
      country_short_name: "GH",
      country_phone_code: 233,
    },
    {
      country_name: "Gibraltar",
      country_short_name: "GI",
      country_phone_code: 350,
    },
    {
      country_name: "Greece",
      country_short_name: "GR",
      country_phone_code: 30,
    },
    {
      country_name: "Greenland",
      country_short_name: "GL",
      country_phone_code: 299,
    },
    {
      country_name: "Grenada",
      country_short_name: "GD",
      country_phone_code: 1473,
    },
    {
      country_name: "Guadeloupe",
      country_short_name: "GP",
      country_phone_code: 590,
    },
    {
      country_name: "Guam",
      country_short_name: "GU",
      country_phone_code: 1671,
    },
    {
      country_name: "Guatemala",
      country_short_name: "GT",
      country_phone_code: 502,
    },
    {
      country_name: "Guernsey and Alderney",
      country_short_name: "XU",
      country_phone_code: 44,
    },
    {
      country_name: "Guinea",
      country_short_name: "GN",
      country_phone_code: 224,
    },
    {
      country_name: "Guinea-Bissau",
      country_short_name: "GW",
      country_phone_code: 245,
    },
    {
      country_name: "Guyana",
      country_short_name: "GY",
      country_phone_code: 592,
    },
    {
      country_name: "Haiti",
      country_short_name: "HT",
      country_phone_code: 509,
    },
    {
      country_name: "Heard and McDonald Islands",
      country_short_name: "HM",
      country_phone_code: 0,
    },
    {
      country_name: "Honduras",
      country_short_name: "HN",
      country_phone_code: 504,
    },
    {
      country_name: "Hong Kong S.A.R.",
      country_short_name: "HK",
      country_phone_code: 852,
    },
    {
      country_name: "Hungary",
      country_short_name: "HU",
      country_phone_code: 36,
    },
    {
      country_name: "Iceland",
      country_short_name: "IS",
      country_phone_code: 354,
    },
    {
      country_name: "India",
      country_short_name: "IN",
      country_phone_code: 91,
    },
    {
      country_name: "Indonesia",
      country_short_name: "ID",
      country_phone_code: 62,
    },
    {
      country_name: "Iran",
      country_short_name: "IR",
      country_phone_code: 98,
    },
    {
      country_name: "Iraq",
      country_short_name: "IQ",
      country_phone_code: 964,
    },
    {
      country_name: "Ireland",
      country_short_name: "IE",
      country_phone_code: 353,
    },
    {
      country_name: "Israel",
      country_short_name: "IL",
      country_phone_code: 972,
    },
    {
      country_name: "Italy",
      country_short_name: "IT",
      country_phone_code: 39,
    },
    {
      country_name: "Jamaica",
      country_short_name: "JM",
      country_phone_code: 1876,
    },
    {
      country_name: "Japan",
      country_short_name: "JP",
      country_phone_code: 81,
    },
    {
      country_name: "Jersey",
      country_short_name: "XJ",
      country_phone_code: 44,
    },
    {
      country_name: "Jordan",
      country_short_name: "JO",
      country_phone_code: 962,
    },
    {
      country_name: "Kazakhstan",
      country_short_name: "KZ",
      country_phone_code: 7,
    },
    {
      country_name: "Kenya",
      country_short_name: "KE",
      country_phone_code: 254,
    },
    {
      country_name: "Kiribati",
      country_short_name: "KI",
      country_phone_code: 686,
    },
    {
      country_name: "Korea North",
      country_short_name: "KP",
      country_phone_code: 850,
    },
    {
      country_name: "Korea South",
      country_short_name: "KR",
      country_phone_code: 82,
    },
    {
      country_name: "Kuwait",
      country_short_name: "KW",
      country_phone_code: 965,
    },
    {
      country_name: "Kyrgyzstan",
      country_short_name: "KG",
      country_phone_code: 996,
    },
    {
      country_name: "Laos",
      country_short_name: "LA",
      country_phone_code: 856,
    },
    {
      country_name: "Latvia",
      country_short_name: "LV",
      country_phone_code: 371,
    },
    {
      country_name: "Lebanon",
      country_short_name: "LB",
      country_phone_code: 961,
    },
    {
      country_name: "Lesotho",
      country_short_name: "LS",
      country_phone_code: 266,
    },
    {
      country_name: "Liberia",
      country_short_name: "LR",
      country_phone_code: 231,
    },
    {
      country_name: "Libya",
      country_short_name: "LY",
      country_phone_code: 218,
    },
    {
      country_name: "Liechtenstein",
      country_short_name: "LI",
      country_phone_code: 423,
    },
    {
      country_name: "Lithuania",
      country_short_name: "LT",
      country_phone_code: 370,
    },
    {
      country_name: "Luxembourg",
      country_short_name: "LU",
      country_phone_code: 352,
    },
    {
      country_name: "Macau S.A.R.",
      country_short_name: "MO",
      country_phone_code: 853,
    },
    {
      country_name: "Macedonia",
      country_short_name: "MK",
      country_phone_code: 389,
    },
    {
      country_name: "Madagascar",
      country_short_name: "MG",
      country_phone_code: 261,
    },
    {
      country_name: "Malawi",
      country_short_name: "MW",
      country_phone_code: 265,
    },
    {
      country_name: "Malaysia",
      country_short_name: "MY",
      country_phone_code: 60,
    },
    {
      country_name: "Maldives",
      country_short_name: "MV",
      country_phone_code: 960,
    },
    {
      country_name: "Mali",
      country_short_name: "ML",
      country_phone_code: 223,
    },
    {
      country_name: "Malta",
      country_short_name: "MT",
      country_phone_code: 356,
    },
    {
      country_name: "Man (Isle of)",
      country_short_name: "XM",
      country_phone_code: 44,
    },
    {
      country_name: "Marshall Islands",
      country_short_name: "MH",
      country_phone_code: 692,
    },
    {
      country_name: "Martinique",
      country_short_name: "MQ",
      country_phone_code: 596,
    },
    {
      country_name: "Mauritania",
      country_short_name: "MR",
      country_phone_code: 222,
    },
    {
      country_name: "Mauritius",
      country_short_name: "MU",
      country_phone_code: 230,
    },
    {
      country_name: "Mayotte",
      country_short_name: "YT",
      country_phone_code: 269,
    },
    {
      country_name: "Mexico",
      country_short_name: "MX",
      country_phone_code: 52,
    },
    {
      country_name: "Micronesia",
      country_short_name: "FM",
      country_phone_code: 691,
    },
    {
      country_name: "Moldova",
      country_short_name: "MD",
      country_phone_code: 373,
    },
    {
      country_name: "Monaco",
      country_short_name: "MC",
      country_phone_code: 377,
    },
    {
      country_name: "Mongolia",
      country_short_name: "MN",
      country_phone_code: 976,
    },
    {
      country_name: "Montserrat",
      country_short_name: "MS",
      country_phone_code: 1664,
    },
    {
      country_name: "Morocco",
      country_short_name: "MA",
      country_phone_code: 212,
    },
    {
      country_name: "Mozambique",
      country_short_name: "MZ",
      country_phone_code: 258,
    },
    {
      country_name: "Myanmar",
      country_short_name: "MM",
      country_phone_code: 95,
    },
    {
      country_name: "Namibia",
      country_short_name: "NA",
      country_phone_code: 264,
    },
    {
      country_name: "Nauru",
      country_short_name: "NR",
      country_phone_code: 674,
    },
    {
      country_name: "Nepal",
      country_short_name: "NP",
      country_phone_code: 977,
    },
    {
      country_name: "Netherlands Antilles",
      country_short_name: "AN",
      country_phone_code: 599,
    },
    {
      country_name: "Netherlands The",
      country_short_name: "NL",
      country_phone_code: 31,
    },
    {
      country_name: "New Caledonia",
      country_short_name: "NC",
      country_phone_code: 687,
    },
    {
      country_name: "New Zealand",
      country_short_name: "NZ",
      country_phone_code: 64,
    },
    {
      country_name: "Nicaragua",
      country_short_name: "NI",
      country_phone_code: 505,
    },
    {
      country_name: "Niger",
      country_short_name: "NE",
      country_phone_code: 227,
    },
    {
      country_name: "Nigeria",
      country_short_name: "NG",
      country_phone_code: 234,
    },
    {
      country_name: "Niue",
      country_short_name: "NU",
      country_phone_code: 683,
    },
    {
      country_name: "Norfolk Island",
      country_short_name: "NF",
      country_phone_code: 672,
    },
    {
      country_name: "Northern Mariana Islands",
      country_short_name: "MP",
      country_phone_code: 1670,
    },
    {
      country_name: "Norway",
      country_short_name: "NO",
      country_phone_code: 47,
    },
    {
      country_name: "Oman",
      country_short_name: "OM",
      country_phone_code: 968,
    },
    {
      country_name: "Pakistan",
      country_short_name: "PK",
      country_phone_code: 92,
    },
    {
      country_name: "Palau",
      country_short_name: "PW",
      country_phone_code: 680,
    },
    {
      country_name: "Palestinian Territory Occupied",
      country_short_name: "PS",
      country_phone_code: 970,
    },
    {
      country_name: "Panama",
      country_short_name: "PA",
      country_phone_code: 507,
    },
    {
      country_name: "Papua new Guinea",
      country_short_name: "PG",
      country_phone_code: 675,
    },
    {
      country_name: "Paraguay",
      country_short_name: "PY",
      country_phone_code: 595,
    },
    {
      country_name: "Peru",
      country_short_name: "PE",
      country_phone_code: 51,
    },
    {
      country_name: "Philippines",
      country_short_name: "PH",
      country_phone_code: 63,
    },
    {
      country_name: "Pitcairn Island",
      country_short_name: "PN",
      country_phone_code: 0,
    },
    {
      country_name: "Poland",
      country_short_name: "PL",
      country_phone_code: 48,
    },
    {
      country_name: "Portugal",
      country_short_name: "PT",
      country_phone_code: 351,
    },
    {
      country_name: "Puerto Rico",
      country_short_name: "PR",
      country_phone_code: 1787,
    },
    {
      country_name: "Qatar",
      country_short_name: "QA",
      country_phone_code: 974,
    },
    {
      country_name: "Republic Of The Congo",
      country_short_name: "CG",
      country_phone_code: 242,
    },
    {
      country_name: "Reunion",
      country_short_name: "RE",
      country_phone_code: 262,
    },
    {
      country_name: "Romania",
      country_short_name: "RO",
      country_phone_code: 40,
    },
    {
      country_name: "Russia",
      country_short_name: "RU",
      country_phone_code: 70,
    },
    {
      country_name: "Rwanda",
      country_short_name: "RW",
      country_phone_code: 250,
    },
    {
      country_name: "Saint Helena",
      country_short_name: "SH",
      country_phone_code: 290,
    },
    {
      country_name: "Saint Kitts And Nevis",
      country_short_name: "KN",
      country_phone_code: 1869,
    },
    {
      country_name: "Saint Lucia",
      country_short_name: "LC",
      country_phone_code: 1758,
    },
    {
      country_name: "Saint Pierre and Miquelon",
      country_short_name: "PM",
      country_phone_code: 508,
    },
    {
      country_name: "Saint Vincent And The Grenadines",
      country_short_name: "VC",
      country_phone_code: 1784,
    },
    {
      country_name: "Samoa",
      country_short_name: "WS",
      country_phone_code: 684,
    },
    {
      country_name: "San Marino",
      country_short_name: "SM",
      country_phone_code: 378,
    },
    {
      country_name: "Sao Tome and Principe",
      country_short_name: "ST",
      country_phone_code: 239,
    },
    {
      country_name: "Saudi Arabia",
      country_short_name: "SA",
      country_phone_code: 966,
    },
    {
      country_name: "Senegal",
      country_short_name: "SN",
      country_phone_code: 221,
    },
    {
      country_name: "Serbia",
      country_short_name: "RS",
      country_phone_code: 381,
    },
    {
      country_name: "Seychelles",
      country_short_name: "SC",
      country_phone_code: 248,
    },
    {
      country_name: "Sierra Leone",
      country_short_name: "SL",
      country_phone_code: 232,
    },
    {
      country_name: "Singapore",
      country_short_name: "SG",
      country_phone_code: 65,
    },
    {
      country_name: "Slovakia",
      country_short_name: "SK",
      country_phone_code: 421,
    },
    {
      country_name: "Slovenia",
      country_short_name: "SI",
      country_phone_code: 386,
    },
    {
      country_name: "Smaller Territories of the UK",
      country_short_name: "XG",
      country_phone_code: 44,
    },
    {
      country_name: "Solomon Islands",
      country_short_name: "SB",
      country_phone_code: 677,
    },
    {
      country_name: "Somalia",
      country_short_name: "SO",
      country_phone_code: 252,
    },
    {
      country_name: "South Africa",
      country_short_name: "ZA",
      country_phone_code: 27,
    },
    {
      country_name: "South Georgia",
      country_short_name: "GS",
      country_phone_code: 0,
    },
    {
      country_name: "South Sudan",
      country_short_name: "SS",
      country_phone_code: 211,
    },
    {
      country_name: "Spain",
      country_short_name: "ES",
      country_phone_code: 34,
    },
    {
      country_name: "Sri Lanka",
      country_short_name: "LK",
      country_phone_code: 94,
    },
    {
      country_name: "Sudan",
      country_short_name: "SD",
      country_phone_code: 249,
    },
    {
      country_name: "Suriname",
      country_short_name: "SR",
      country_phone_code: 597,
    },
    {
      country_name: "Svalbard And Jan Mayen Islands",
      country_short_name: "SJ",
      country_phone_code: 47,
    },
    {
      country_name: "Swaziland",
      country_short_name: "SZ",
      country_phone_code: 268,
    },
    {
      country_name: "Sweden",
      country_short_name: "SE",
      country_phone_code: 46,
    },
    {
      country_name: "Switzerland",
      country_short_name: "CH",
      country_phone_code: 41,
    },
    {
      country_name: "Syria",
      country_short_name: "SY",
      country_phone_code: 963,
    },
    {
      country_name: "Taiwan",
      country_short_name: "TW",
      country_phone_code: 886,
    },
    {
      country_name: "Tajikistan",
      country_short_name: "TJ",
      country_phone_code: 992,
    },
    {
      country_name: "Tanzania",
      country_short_name: "TZ",
      country_phone_code: 255,
    },
    {
      country_name: "Thailand",
      country_short_name: "TH",
      country_phone_code: 66,
    },
    {
      country_name: "Togo",
      country_short_name: "TG",
      country_phone_code: 228,
    },
    {
      country_name: "Tokelau",
      country_short_name: "TK",
      country_phone_code: 690,
    },
    {
      country_name: "Tonga",
      country_short_name: "TO",
      country_phone_code: 676,
    },
    {
      country_name: "Trinidad And Tobago",
      country_short_name: "TT",
      country_phone_code: 1868,
    },
    {
      country_name: "Tunisia",
      country_short_name: "TN",
      country_phone_code: 216,
    },
    {
      country_name: "Turkey",
      country_short_name: "TR",
      country_phone_code: 90,
    },
    {
      country_name: "Turkmenistan",
      country_short_name: "TM",
      country_phone_code: 7370,
    },
    {
      country_name: "Turks And Caicos Islands",
      country_short_name: "TC",
      country_phone_code: 1649,
    },
    {
      country_name: "Tuvalu",
      country_short_name: "TV",
      country_phone_code: 688,
    },
    {
      country_name: "Uganda",
      country_short_name: "UG",
      country_phone_code: 256,
    },
    {
      country_name: "Ukraine",
      country_short_name: "UA",
      country_phone_code: 380,
    },
    {
      country_name: "United Arab Emirates",
      country_short_name: "AE",
      country_phone_code: 971,
    },
    {
      country_name: "United Kingdom",
      country_short_name: "GB",
      country_phone_code: 44,
    },
    {
      country_name: "United States",
      country_short_name: "US",
      country_phone_code: 1,
    },
    {
      country_name: "United States Minor Outlying Islands",
      country_short_name: "UM",
      country_phone_code: 1,
    },
    {
      country_name: "Uruguay",
      country_short_name: "UY",
      country_phone_code: 598,
    },
    {
      country_name: "Uzbekistan",
      country_short_name: "UZ",
      country_phone_code: 998,
    },
    {
      country_name: "Vanuatu",
      country_short_name: "VU",
      country_phone_code: 678,
    },
    {
      country_name: "Vatican City State (Holy See)",
      country_short_name: "VA",
      country_phone_code: 39,
    },
    {
      country_name: "Venezuela",
      country_short_name: "VE",
      country_phone_code: 58,
    },
    {
      country_name: "Vietnam",
      country_short_name: "VN",
      country_phone_code: 84,
    },
    {
      country_name: "Virgin Islands (British)",
      country_short_name: "VG",
      country_phone_code: 1284,
    },
    {
      country_name: "Virgin Islands (US)",
      country_short_name: "VI",
      country_phone_code: 1340,
    },
    {
      country_name: "Wallis And Futuna Islands",
      country_short_name: "WF",
      country_phone_code: 681,
    },
    {
      country_name: "Western Sahara",
      country_short_name: "EH",
      country_phone_code: 212,
    },
    {
      country_name: "Yemen",
      country_short_name: "YE",
      country_phone_code: 967,
    },
    {
      country_name: "Yugoslavia",
      country_short_name: "YU",
      country_phone_code: 38,
    },
    {
      country_name: "Zambia",
      country_short_name: "ZM",
      country_phone_code: 260,
    },
    {
      country_name: "Zimbabwe",
      country_short_name: "ZW",
      country_phone_code: 263,
    },
  ];

  const secondPart = useRef(new Animated.Value(0)).current;
  const thirdPart = useRef(new Animated.Value(0)).current;

  const viewRef = useRef(new Animated.Value(height / 2.8)).current;
  const addRef = useRef(new Animated.Value(height / 1.1)).current;
  const errorRef = useRef(new Animated.Value(height / 2.8)).current;

  const countriesRef = useRef();
  const shake = useRef(new Animated.Value(0)).current;
  const cardNumer = useRef();
  const identificationRef = useRef();
  const MMAA = useRef();
  const CVC = useRef();
  const fullname = useRef();

  const required = () => {
    let error = false;

    if (typeof success !== 'function' ||
    typeof setActivePayment !== 'function') error = true;

    if (typeof success !== 'function') console.error('Function success is required');
    if (typeof setActivePayment !== 'function') console.error('Function setActivePayment is required');

    return error;
  }

  const validation = () => {
    let error = false;

    if (
      !payuConfig.apiKey ||
      !payuConfig.apiLogin ||
      !payuConfig.merchantId ||
      !payuConfig.referenceCode ||
      !payuConfig.currency ||
      !payuConfig.accountId ||
      !payuConfig.description ||
      !payuConfig.paymentCountry ||
      !payuConfig.deviceSessionId ||
      !payuConfig.cookie ||
      !payuConfig.userAgent ||
      !email
    )
      error = true;

    if (!email) console.error('Error email is required in "test": false');
    if (!payuConfig.language) payuConfig.language = "es";
    if (!payuConfig.apiKey)
      console.error('Error in (payuConfig) apiKey is required in "test": false');
    if (!payuConfig.apiLogin)
      console.error(
        'Error in (payuConfig) apiLogin is required in "test": false'
      );
    if (!payuConfig.merchantId)
      console.error(
        'Error in (payuConfig) merchantId is required in "test": false'
      );
    if (!payuConfig.referenceCode)
      console.error(
        'Error in (payuConfig) referenceCode is required in "test": false'
      );
    if (!payuConfig.currency)
      console.error(
        'Error in (payuConfig) currency is required in "test": false'
      );
    if (!payuConfig.accountId)
      console.error(
        'Error in (payuConfig) accountId is required in "test": false'
      );
    if (!payuConfig.description)
      console.error(
        'Error in (payuConfig) description is required in "test": false'
      );
    if (!payuConfig.notifyUrl) payuConfig.notifyUrl = "";
    if (!payuConfig.merchantPayerId) payuConfig.merchantPayerId = email;
    if (!payuConfig.paymentCountry)
      console.error(
        'Error in (payuConfig) paymentCountry is required in "test": false'
      );
    if (!payuConfig.deviceSessionId)
      console.error(
        'Error in (payuConfig) deviceSessionId is required in "test": false'
      );
    if (!payuConfig.ipAddress) payuConfig.ipAddress = "127.0.0.1";
    if (!payuConfig.cookie)
      console.error('Error in (payuConfig) cookie is required in "test": false');
    if (!payuConfig.userAgent)
      console.error(
        'Error in (payuConfig) userAgent is required in "test": false'
      );

    return error;
  };

  useEffect(() => {
    if (!test) validation();
    required();
  }, [test]);

  const cleanData = () => {
    setCard("");
    setCardType("");
    setIdentification("");
    setMmaa("");
    setCvc("");
    setFullName("");
    setCountry("");
    setCity("");
    setPostalCode("");
    setState("");
    setValue("");
    setPhoneNumber("");
    setValue("card", "");
    setValue("identification", "");
    setValue("mmaa", "");
    setValue("cvc", "");
    setValue("fullName", "");
    setValue("country", "");
    setValue("city", "");
    setValue("postalCode", "");
    setValue("state", "");
    setValue("phoneNumber", "");
  };

  const add = async (data) => {
    Keyboard.dismiss();
    if (validation() && !test) return;
    if (required()) return;
    const hash = md5(data.card);

    let cardsCurrent = [];

    const jsons = await AsyncStorage.getItem("@cards");
    const jsonPARSE = JSON.parse(jsons);
    if (jsonPARSE) {
      cardsCurrent = jsonPARSE;
      const card = jsonPARSE.find((card) => card.hash === hash);
      if (card) return Alert.alert("", "La tarjeta ya existe");
    }

    setLoading(true);

    const result = await axios({
      method: "POST",
      url: test
        ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
        : "https://api.payulatam.com/payments-api/4.0/service.cgi",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        language: test ? "es" : payuConfig.language,
        command: "CREATE_TOKEN",
        merchant: {
          apiKey: test ? "4Vj8eK4rloUd272L48hsrarnUA" : payuConfig.apiKey,
          apiLogin: test ? "pRRXKOl8ikMmt9u" : payuConfig.apiLogin,
        },
        creditCardToken: {
          payerId: hash,
          name: data.fullName,
          identificationNumber: data.identification,
          paymentMethod: cardType,
          number: data.card,
          expirationDate: `20${data.mmaa.slice(2, 4)}/${data.mmaa.slice(0, 2)}`,
        },
      },
    });


    if (result.data.code === "ERROR") {
      setLoading(false);
      return setErrorValidation(true);
    }

    const value = {
      hash,
      token: result.data.creditCardToken.creditCardTokenId,
      identification: result.data.creditCardToken.identificationNumber,
      name: result.data.creditCardToken.name,
      payerId: result.data.creditCardToken.payerId,
      paymentMethod: result.data.creditCardToken.paymentMethod,
      maskedNumber: result.data.creditCardToken.maskedNumber,
      mmaa: `20${data.mmaa.slice(2, 4)}/${data.mmaa.slice(0, 2)}`,
      cvc: data.cvc,
      country: data.country,
      city: data.city,
      postalCode: data.postalCode,
      state: data.state,
      phoneNumber: data.phoneNumber,
    };

    try {
      cardsCurrent.push(value);
      const jsonValue = JSON.stringify(cardsCurrent);
      await AsyncStorage.setItem("@cards", jsonValue);
    } catch (e) {
      console.log(e);
    }

    cleanData();
    setActiveAdd(false);
    setCards(cardsCurrent);
    setLoading(false);
  };

  const config = {
    duration: 300,
    useNativeDriver: true,
  };

  useEffect(() => {
    const word = card.replace(/[^0-9]/g, "");
    const type = getCardType(word);

    if (
      identification.length >= 8 &&
      cvc.length === 3 &&
      mmaa.length === 5 &&
      type &&
      word.length === 16
    ) {
      Animated.timing(thirdPart, {
        toValue: 1,
        useNativeDriver: true,
        duration: 200,
      }).start();
    } else {
      Animated.timing(thirdPart, {
        toValue: 0,
        useNativeDriver: true,
        duration: 200,
      }).start();
    }
  }, [identification, cvc, mmaa, card]);

  useEffect(() => {
    const word = card.replace(/[^0-9]/g, "");
    const type = getCardType(word);

    const config = {
      duration: 100,
      useNativeDriver: true,
    };

    if (!type && word.length === 16) {
      Animated.timing(shake, { toValue: 4, ...config }).start(() =>
        Animated.timing(shake, { toValue: -4, ...config }).start(() =>
          Animated.timing(shake, { toValue: 0, ...config }).start()
        )
      );
    } else if (type && word.length === 16) {
      Animated.timing(secondPart, {
        toValue: 1,
        ...config,
        duration: 200,
      }).start();
    } else {
      Animated.timing(secondPart, {
        toValue: 0,
        ...config,
        duration: 200,
      }).start();
    }
  }, [card]);

  useEffect(() => {
    if (activePayment && !activeAdd && !errorValidation) {
      Animated.timing(viewRef, { toValue: 0, ...config }).start();
    } else {
      Animated.timing(viewRef, { toValue: height / 2.8, ...config }).start();
    }

    if (activeAdd && !errorValidation) {
      Animated.timing(addRef, { toValue: 0, ...config }).start();
    } else {
      Animated.timing(addRef, { toValue: height / 1.1, ...config }).start();
    }

    if (errorValidation) {
      Animated.timing(errorRef, { toValue: 0, ...config }).start();
    } else {
      Animated.timing(errorRef, { toValue: height / 2.8, ...config }).start();
    }
  }, [viewRef, addRef, activeAdd, errorValidation, errorRef]);

  const getCardType = (cardNo) => {
    const cards = {
      MASTERCARD: /^5[1-5][0-9]{14}$/,
      VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
    };

    for (var card in cards) {
      if (cards[card].test(cardNo)) {
        return card;
      }
    }

    return undefined;
  };

  const addLetter = (string, word, steps) => {
    let newString = "";
    const lengthString = string.length;
    for (let i = 0; i < lengthString; i += steps) {
      if (i + steps < lengthString) {
        newString += string.substring(i, i + steps) + word;
      } else {
        newString += string.substring(i, lengthString);
      }
    }
    return newString;
  };

  const removeCard = async (hash) => {
    const jsons = await AsyncStorage.getItem("@cards");
    const jsonPARSE = JSON.parse(jsons);
    const remove = jsonPARSE.filter((card) => card.hash !== hash);

    if (remove.length === 0) await AsyncStorage.removeItem("@cards");
    else await AsyncStorage.setItem("@cards", JSON.stringify(remove));

    setCards(remove);
  };

  const proceedPayment = async (card) => {
    if (!test && validation()) return;
    if (required()) return;

    const signature = test
      ? md5("4Vj8eK4rloUd272L48hsrarnUA~508029~PayU~3~USD")
      : md5(
          `${payuConfig.apiKey}~${payuConfig.merchantId}~${payuConfig.referenceCode}~${amount}~${payuConfig.currency}`
        );

    const result = await axios({
      method: "POST",
      url:
        test || payuConfig.test
          ? "https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi"
          : "https://api.payulatam.com/payments-api/4.0/service.cgi",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: {
        language: test ? "es" : payuConfig.language,
        command: "SUBMIT_TRANSACTION",
        merchant: {
          apiKey: test ? "4Vj8eK4rloUd272L48hsrarnUA" : payuConfig.apiKey,
          apiLogin: test ? "pRRXKOl8ikMmt9u" : payuConfig.apiLogin,
        },
        transaction: {
          order: {
            accountId: test ? "512321" : payuConfig.accountId,
            referenceCode: test ? "PayU" : payuConfig.referenceCode,
            description: test
              ? "Payment test description"
              : payuConfig.description,
            language: test ? "es" : payuConfig.language,
            signature,
            notifyUrl: test
              ? "http://www.payu.com/notify"
              : payuConfig.notifyUrl,
            additionalValues: {
              TX_VALUE: {
                value: test ? 3 : amount,
                currency: test ? "USD" : payuConfig.currency,
              },
              TX_TAX: {
                value: 0,
                currency: test ? "USD" : payuConfig.currency,
              },
              TX_TAX_RETURN_BASE: {
                value: 0,
                currency: test ? "USD" : payuConfig.currency,
              },
            },
            buyer: {
              merchantBuyerId: test ? "1" : payuConfig.merchantPayerId,
              fullName: test ? "First name and second buyer name" : card.name,
              emailAddress: test ? "buyer_test@test.com" : email,
              contactPhone: test ? "7563126" : card.phoneNumber,
              dniNumber: test ? "123456789" : card.identification,
              shippingAddress: {
                street1: test ? "Cr 23 No. 53-50" : card.postalCode,
                city: test ? "Bogotá" : card.city,
                state: test ? "Bogotá D.C." : card.state,
                country: test ? "CO" : card.country,
                postalCode: test ? "000000" : card.postalCode,
                phone: test ? "7563126" : card.phoneNumber,
              },
            },
          },
          payer: {
            merchantPayerId: test ? "1" : payuConfig.merchantPayerId,
            fullName: test ? "First name and second payer name" : card.name,
            emailAddress: test ? "payer_test@test.com" : email,
            contactPhone: test ? "7563126" : card.phoneNumber,
            dniNumber: test ? "5415668464654" : card.identification,
            billingAddress: {
              street1: test ? "Cr 23 No. 53-50" : card.postalCode,
              city: test ? "Bogotá" : card.city,
              state: test ? "Bogotá D.C." : card.state,
              country: test ? "CO" : card.country,
              postalCode: test ? "000000" : card.postalCode,
            },
          },
          creditCardTokenId: card.token,
          creditCard: {
            securityCode: test ? "123" : card.cvc,
          },
          type: "AUTHORIZATION_AND_CAPTURE",
          paymentMethod: test ? "VISA" : card.paymentMethod,
          paymentCountry: test ? "CO" : payuConfig.paymentCountry,
          deviceSessionId: test
            ? "vghs6tvkcle931686k1900o6e1"
            : payuConfig.deviceSessionId,
          ipAddress: test ? "127.0.0.1" : payuConfig.ipAddress,
          cookie: test ? "pt1t38347bs6jc9ruv2ecpv7o2" : payuConfig.cookie,
          userAgent: test
            ? "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0"
            : payuConfig.userAgent,
        },
        test: test ? true : payuConfig.test,
      },
    });

    if (result.data.code === "ERROR") {
      if (failed) failed(result.data.error);
      return console.error(result.data.error);
    }

    if (result.data.code === "SUCCESS") {
      if (result.data.state === "DECLINED") {
        if (failed) failed(result.data.paymentNetworkResponseErrorMessage);
        return console.error(result.data.paymentNetworkResponseErrorMessage);
      }

      if (result.data.state === "APPROVE") {
        if (success) success(result.data);
        if (setActivePayment) setActivePayment(false);
        return 
      };
    };
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={activePayment}
        onRequestClose={() => setActivePayment(false)}
      >
        <View style={styles.container}>
          <Animated.View
            style={[
              styles.add,
              { transform: [{ translateY: addRef }], backgroundColor },
            ]}
          >
            <KeyboardAvoidingView style={{ flex: 1, padding: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => {
                    Keyboard.dismiss();
                    setActiveAdd(false);
                    cleanData();
                  }}
                >
                  <Ionicons
                    name="arrow-back"
                    size={40}
                    color={textColor}
                    style={{ marginRight: 15 }}
                  />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, color: textColor }}>
                  Añadir tarjeta de crédito o débito
                </Text>
              </View>
              <ScrollView>
                <Animated.View
                  style={[
                    styles.information,
                    {
                      transform: [
                        {
                          translateX: shake,
                        },
                      ],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.input,
                      {
                        borderColor:
                          type === "card" ? mainColor : "transparent",
                        backgroundColor: backgroundColorInput,
                      },
                    ]}
                  >
                    {cardType === "MASTERCARD" && (
                      <Image
                        style={{ width: 40, height: 20, marginRight: 15 }}
                        source={IMGMastercard}
                      />
                    )}
                    {cardType === "VISA" && (
                      <Image
                        style={{ width: 40, height: 20, marginRight: 15 }}
                        source={IMGVisa}
                      />
                    )}
                    {!cardType && (
                      <Ionicons
                        name="card-outline"
                        size={25}
                        color={textColor}
                        style={{ marginRight: 15 }}
                      />
                    )}
                    <TextInput
                      ref={cardNumer}
                      value={card}
                      maxLength={19}
                      onChangeText={(text) => {
                        const word = text.replace(/[^0-9]/g, "");
                        setValue("card", word);
                        const type = getCardType(word);

                        setCard(addLetter(word, " ", 4));

                        if (type) setCardType(type);
                        else setCardType("");

                        if (!type && word.length === 16) Vibration.vibrate();

                        if (word.length === 16 && !type) setError(true);
                        else setError(false);

                        if (word.length === 16 && type)
                          identificationRef.current?.focus();
                      }}
                      onFocus={() => setType("card")}
                      onBlur={() => setType("")}
                      placeholder="Número de tarjeta"
                      keyboardType="numeric"
                      placeholderTextColor={placeholderTextColor}
                      style={{ fontSize: 18, color: textColor, width: "100%" }}
                    />
                  </View>
                  {error && (
                    <Text
                      style={{ fontSize: 14, marginTop: 8, color: mainColor }}
                    >
                      Metodo de pago no válido o no admitido.
                    </Text>
                  )}
                  {errors.card?.type && (
                    <Text
                      style={{ fontSize: 14, marginTop: 8, color: mainColor }}
                    >
                      {errors.card?.type === "required"
                        ? "Campo requerido."
                        : errors.card?.message}
                    </Text>
                  )}
                  <Animated.View style={{ opacity: secondPart }}>
                    <View
                      style={[
                        styles.input,
                        {
                          borderColor:
                            type === "identification"
                              ? mainColor
                              : "transparent",
                          backgroundColor: backgroundColorInput,
                        },
                      ]}
                    >
                      <TextInput
                        ref={identificationRef}
                        value={identification}
                        maxLength={15}
                        onChangeText={(text) => {
                          setValue(
                            "identification",
                            text.replace(/[^0-9]/g, "")
                          );
                          setIdentification(
                            thousandsSystem(text.replace(/[^0-9]/g, ""))
                          );
                        }}
                        onFocus={() => setType("identification")}
                        onBlur={() => setType("")}
                        placeholder="Número de identificación"
                        keyboardType="numeric"
                        placeholderTextColor={placeholderTextColor}
                        style={{
                          fontSize: 18,
                          color: textColor,
                          width: "100%",
                        }}
                      />
                    </View>
                    {errors.identification?.type && (
                      <Text
                        style={{ fontSize: 14, marginTop: 8, color: mainColor }}
                      >
                        Campo requerido.
                      </Text>
                    )}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <View
                          style={[
                            styles.input,
                            {
                              width: width / 2.5,
                              borderColor:
                                type === "MMAA" ? mainColor : "transparent",
                              backgroundColor: backgroundColorInput,
                            },
                          ]}
                        >
                          <TextInput
                            ref={MMAA}
                            value={mmaa}
                            maxLength={5}
                            onChangeText={(text) => {
                              const word = text.replace(/[^0-9]/g, "");
                              setValue("mmaa", word);
                              setMmaa(addLetter(word, "/", 2));
                            }}
                            onFocus={() => setType("MMAA")}
                            onBlur={() => setType("")}
                            placeholder="MMAA"
                            keyboardType="numeric"
                            placeholderTextColor={placeholderTextColor}
                            style={{
                              fontSize: 18,
                              color: textColor,
                              width: "100%",
                            }}
                          />
                        </View>
                        {errors.mmaa?.type && (
                          <Text
                            style={{
                              fontSize: 14,
                              marginTop: 8,
                              color: mainColor,
                            }}
                          >
                            {errors.mmaa?.type === "required"
                              ? "Campo requerido."
                              : errors.mmaa?.message}
                          </Text>
                        )}
                      </View>
                      <View>
                        <View
                          style={[
                            styles.input,
                            {
                              width: width / 2.5,
                              borderColor:
                                type === "CVC" ? mainColor : "transparent",
                              backgroundColor: backgroundColorInput,
                            },
                          ]}
                        >
                          <TextInput
                            ref={CVC}
                            value={cvc}
                            maxLength={3}
                            onChangeText={(text) => {
                              const word = text.replace(/[^0-9]/g, "");
                              setValue("cvc", word);
                              setCvc(word);
                            }}
                            onFocus={() => setType("CVC")}
                            onBlur={() => setType("")}
                            placeholder="CVC"
                            keyboardType="numeric"
                            placeholderTextColor={placeholderTextColor}
                            style={{
                              fontSize: 18,
                              color: textColor,
                              width: "100%",
                            }}
                          />
                        </View>
                        {errors.cvc?.type && (
                          <Text
                            style={{
                              fontSize: 14,
                              marginTop: 8,
                              color: mainColor,
                            }}
                          >
                            {errors.cvc?.type === "required"
                              ? "Campo requerido."
                              : errors.cvc?.message}
                          </Text>
                        )}
                      </View>
                    </View>
                  </Animated.View>
                  <Animated.View style={{ opacity: thirdPart }}>
                    <View
                      style={[
                        styles.input,
                        {
                          borderColor:
                            type === "fullname" ? mainColor : "transparent",
                          backgroundColor: backgroundColorInput,
                        },
                      ]}
                    >
                      <TextInput
                        ref={fullname}
                        maxLength={35}
                        value={fullName}
                        onChangeText={(text) => {
                          setValue("fullName", text);
                          setFullName(text);
                        }}
                        onFocus={() => setType("fullname")}
                        onBlur={() => setType("")}
                        placeholder="Nombre completo"
                        placeholderTextColor={placeholderTextColor}
                        style={{
                          fontSize: 18,
                          color: textColor,
                          width: "100%",
                        }}
                      />
                    </View>
                    {errors.fullName?.type && (
                      <Text
                        style={{ fontSize: 14, marginTop: 8, color: mainColor }}
                      >
                        Campo requerido.
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={() => countriesRef.current.focus()}
                      style={[
                        styles.input,
                        {
                          borderColor: "transparent",
                          backgroundColor: backgroundColorInput,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          paddingVertical: 4,
                          color: country ? textColor : placeholderTextColor,
                        }}
                      >
                        {country ? country : "País"}
                      </Text>
                      <Picker
                        ref={countriesRef}
                        style={{ display: "none" }}
                        selectedValue={country}
                        onValueChange={async (value) => {
                          setValue("country", value.split("-")[1]);
                          setCountry(value.split("-")[0]);
                        }}
                      >
                        <Picker.Item label="Seleccione su país" value="" />
                        {countries.map((item) => (
                          <Picker.Item
                            key={item.country_phone_code}
                            label={item.country_name}
                            value={`${item.country_name}-${item.country_short_name}`}
                          />
                        ))}
                      </Picker>
                    </TouchableOpacity>
                    {errors.country?.type && (
                      <Text
                        style={{ fontSize: 14, marginTop: 8, color: mainColor }}
                      >
                        Campo requerido.
                      </Text>
                    )}
                    <View
                      style={[
                        styles.input,
                        {
                          borderColor:
                            type === "postalCode" ? mainColor : "transparent",
                          backgroundColor: backgroundColorInput,
                        },
                      ]}
                    >
                      <TextInput
                        maxLength={16}
                        value={phoneNumber}
                        onChangeText={(text) => {
                          const word = text.replace(/[^0-9]/g, "");
                          setValue("phoneNumber", word);
                          setPhoneNumber(word);
                        }}
                        onFocus={() => setType("phoneNumber")}
                        onBlur={() => setType("")}
                        placeholder="Número de teléfono"
                        placeholderTextColor={placeholderTextColor}
                        keyboardType="numeric"
                        style={{
                          fontSize: 18,
                          color: textColor,
                          width: "100%",
                        }}
                      />
                    </View>
                    {errors.phoneNumber?.type && (
                      <Text
                        style={{ fontSize: 14, marginTop: 8, color: mainColor }}
                      >
                        {errors.phoneNumber?.type === "required"
                          ? "Campo requerido."
                          : errors.phoneNumber?.message}
                      </Text>
                    )}
                    <View
                      style={[
                        styles.input,
                        {
                          borderColor:
                            type === "city" ? mainColor : "transparent",
                          backgroundColor: backgroundColorInput,
                        },
                      ]}
                    >
                      <TextInput
                        maxLength={20}
                        value={city}
                        onChangeText={(text) => {
                          setValue("city", text);
                          setCity(text);
                        }}
                        onFocus={() => setType("city")}
                        onBlur={() => setType("")}
                        placeholder="Ciudad"
                        placeholderTextColor={placeholderTextColor}
                        style={{
                          fontSize: 18,
                          color: textColor,
                          width: "100%",
                        }}
                      />
                    </View>
                    {errors.city?.type && (
                      <Text
                        style={{ fontSize: 14, marginTop: 8, color: mainColor }}
                      >
                        Campo requerido.
                      </Text>
                    )}
                    <View
                      style={[
                        styles.input,
                        {
                          borderColor:
                            type === "postalCode" ? mainColor : "transparent",
                          backgroundColor: backgroundColorInput,
                        },
                      ]}
                    >
                      <TextInput
                        maxLength={6}
                        value={postalCode}
                        onChangeText={(text) => {
                          const word = text.replace(/[^0-9]/g, "");
                          setValue("postalCode", word);
                          setPostalCode(word);
                        }}
                        onFocus={() => setType("postalCode")}
                        onBlur={() => setType("")}
                        placeholder="Código postal"
                        placeholderTextColor={placeholderTextColor}
                        keyboardType="numeric"
                        style={{
                          fontSize: 18,
                          color: textColor,
                          width: "100%",
                        }}
                      />
                    </View>
                    {errors.postalCode?.type && (
                      <Text
                        style={{ fontSize: 14, marginTop: 8, color: mainColor }}
                      >
                        {errors.postalCode?.type === "required"
                          ? "Campo requerido."
                          : errors.postalCode?.message}
                      </Text>
                    )}
                    <View
                      style={[
                        styles.input,
                        {
                          borderColor:
                            type === "state" ? mainColor : "transparent",
                          backgroundColor: backgroundColorInput,
                        },
                      ]}
                    >
                      <TextInput
                        maxLength={20}
                        value={state}
                        onChangeText={(text) => {
                          setValue("state", text);
                          setState(text);
                        }}
                        onFocus={() => setType("state")}
                        onBlur={() => setType("")}
                        placeholder="Estado"
                        placeholderTextColor={placeholderTextColor}
                        style={{
                          fontSize: 18,
                          color: textColor,
                          width: "100%",
                        }}
                      />
                    </View>
                    {errors.state?.type && (
                      <Text
                        style={{ fontSize: 14, marginTop: 8, color: mainColor }}
                      >
                        Campo requerido.
                      </Text>
                    )}
                  </Animated.View>
                </Animated.View>
              </ScrollView>
            </KeyboardAvoidingView>
            <View
              style={[styles.shortInformation, { borderTopColor: colorTitle }]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: 20,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={logo ? logo : Logo}
                    style={{ width: 50, height: 50, borderRadius: 6 }}
                  />
                  <Text
                    style={{ fontSize: 24, color: mainColor, marginLeft: 15 }}
                  >
                    {subtitle}
                  </Text>
                </View>
                <Text style={{ fontSize: 24, color: mainColor }}>
                  {amount}{" "}
                  {test && !payuConfig.currency ? "USD" : payuConfig.currency}
                </Text>
              </View>
              <TouchableNativeFeedback
                onPress={handleSubmit((data) => add(data))}
              >
                <View style={[styles.save, { backgroundColor: mainColor }]}>
                  <Text style={{ fontSize: 20, color: colorTextButton }}>
                    Guardar
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </Animated.View>
          <Animated.View
            style={[
              styles.view,
              { transform: [{ translateY: errorRef }], backgroundColor },
            ]}
          >
            <View
              style={{
                padding: 15,
                borderBottomColor: colorTitle,
                borderBottomWidth: 1,
              }}
            >
              <Text
                style={{ fontSize: 24, color: colorTitle, marginBottom: 15 }}
              >
                ERROR
              </Text>
              <Text style={{ fontSize: 16, color: colorTitle }}>
                No se ha podido realizar la solicitud. Usa otro método de pago o
                ponte en contacto con nosotros.
              </Text>
            </View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={logo ? logo : Logo}
                  style={{ width: 70, height: 70, borderRadius: 12 }}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "77%",
                    marginBottom: 5,
                    marginLeft: 20,
                  }}
                >
                  <Text style={{ fontSize: 24, color: mainColor }}>
                    {subtitle}
                  </Text>
                  <Text style={{ fontSize: 24, color: textColor }}>
                    {amount}{" "}
                    {test && !payuConfig.currency ? "USD" : payuConfig.currency}
                  </Text>
                </View>
              </View>
              <TouchableNativeFeedback
                onPress={() => setErrorValidation(false)}
              >
                <View
                  style={[
                    styles.addCard,
                    {
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                      justifyContent: "center",
                      marginTop: 20,
                      backgroundColor: backgroundColorButton,
                    },
                  ]}
                >
                  <Text style={{ fontSize: 16, color: textColor }}>
                    Aceptar
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </Animated.View>
          <Animated.View
            style={[
              styles.view,
              { transform: [{ translateY: viewRef }], backgroundColor },
            ]}
          >
            {cards === null ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              >
                <ActivityIndicator size={50} color={mainColor} />
                <Text style={{ fontSize: 18, color: textColor, marginTop: 10 }}>
                  Cargando
                </Text>
              </View>
            ) : (
              <>
                <View
                  style={{
                    padding: 15,
                    borderBottomColor: colorTitle,
                    borderBottomWidth: 1,
                  }}
                >
                  <Text style={{ fontSize: 24, color: colorTitle }}>
                    {title}
                  </Text>
                </View>
                <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={logo ? logo : Logo}
                      style={{ width: 70, height: 70, borderRadius: 12 }}
                    />
                    <View style={{ marginLeft: 20, width: "75%" }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 5,
                        }}
                      >
                        <Text style={{ fontSize: 24, color: mainColor }}>
                          {subtitle}
                        </Text>
                        <Text style={{ fontSize: 24, color: textColor }}>
                          {amount}{" "}
                          {test && !payuConfig.currency
                            ? "USD"
                            : payuConfig.currency}
                        </Text>
                      </View>
                      <Text
                        style={{ fontSize: 15, color: shortInformationColor }}
                      >
                        {email}
                      </Text>
                    </View>
                  </View>
                  {cards.length === 0 && (
                    <Text
                      style={{
                        marginVertical: 18,
                        fontSize: 15,
                        color: shortInformationColor,
                      }}
                    >
                      {description}
                    </Text>
                  )}
                  <ScrollView
                    style={{ maxHeight: height / 6.5, marginTop: 10 }}
                    showsVerticalScrollIndicator={false}
                  >
                    {cards.map((card) => (
                      <TouchableNativeFeedback
                        key={card.token}
                        onPress={() =>
                          Alert.alert(
                            "¿Quieres pagar con esta tarjeta?",
                            "Una vez se efectue el pago no podrás cancelarlo",
                            [
                              {
                                text: "Cancelar",
                                style: "cancel",
                              },
                              {
                                text: "Estoy seguro",
                                onPress: () => proceedPayment(card),
                              },
                            ]
                          )
                        }
                        onLongPress={() =>
                          Alert.alert(
                            "¿Quieres eliminar la tarjeta?",
                            "Una vez eliminada no podrás usar esta tarjeta para hacer pagos",
                            [
                              {
                                text: "Cancelar",
                                style: "cancel",
                              },
                              {
                                text: "Estoy seguro",
                                onPress: () => removeCard(card.hash),
                              },
                            ]
                          )
                        }
                      >
                        <View
                          style={[
                            styles.addCard,
                            {
                              paddingVertical: 7,
                              marginTop: 8,
                              backgroundColor: backgroundColorInput,
                            },
                          ]}
                        >
                          <Image
                            style={{ width: 60, height: 40, marginRight: 15 }}
                            source={
                              card.paymentMethod === "MASTERCARD"
                                ? IMGMastercard
                                : IMGVisa
                            }
                          />
                          <View>
                            <Text style={{ fontSize: 16, color: textColor }}>
                              {card.maskedNumber}
                            </Text>
                            <Text style={{ fontSize: 16, color: textColor }}>
                              {card.name}
                            </Text>
                          </View>
                        </View>
                      </TouchableNativeFeedback>
                    ))}
                    <TouchableNativeFeedback
                      onPress={() => {
                        setActiveAdd(true);
                        cardNumer.current.focus();
                      }}
                    >
                      <View
                        style={[
                          styles.addCard,
                          {
                            marginTop: 8,
                            backgroundColor: backgroundColorButton,
                          },
                        ]}
                      >
                        <Ionicons
                          name="card-outline"
                          size={40}
                          color={colorTextButton}
                          style={{ marginRight: 10 }}
                        />
                        <Text style={{ fontSize: 16, color: colorTextButton }}>
                          Añadir una tarjeta de crédito o débito
                        </Text>
                      </View>
                    </TouchableNativeFeedback>
                  </ScrollView>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
      {loading && (
        <Modal animationType="fade" transparent={true} visible={loading}>
          <View
            style={[
              styles.container,
              {
                justifyContent: "center",
                alignItems: "center",
                backgroundColor,
              },
            ]}
          >
            <ActivityIndicator size={50} color={mainColor} />
            <Text style={{ fontSize: 20, color: textColor, marginTop: 18 }}>
              Añadiendo tarjeta
            </Text>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.4)",
  },
  view: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: height / 2.8,
  },
  addCard: {
    width: "100%",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  add: {
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  shortInformation: {
    padding: 20,
    width: "100%",
    borderTopWidth: 1,
    alignItems: "center",
  },
  information: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 2,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  save: {
    width: "80%",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
});
