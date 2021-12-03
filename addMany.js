require('dotenv').config();
const { addMany } = require('./manager');

const sentences = [
  "Ante la cera dura, perdura y sigue adelante. La sabiduría es temple, metal, a oidos necios suele ser letal",
  "La clave de la risa es la brisa, rauda y clara, te ampara",
  "Desconectar es vivir, sentir es comer, desconectar es lo mismo que abrir una tapadera y mirar el mar",
  "Hidro es la manifestación del alma mirada por un espejo de cristal, así que el alma y el espíritu se combinan en el Hidro",
  "Cuando un café quieres, no lo hagas demorar. Ni el sol ni la luna te lo van a dar",
  "La mañana hace al maestro y un maestro solo se despierta con el himno de la mañana",
  "Construir lego es como saltar a la comba: solo que en realidad son actividades diferentes",
  "La sabiduría es como la cena, va y viene. Pero siempre se sabe quién la tiene",
  "Una historia bien hecha requiere hilo fino, complejos esquemas, abundante vino y paciencia extrema",
  "Es un buen día para dormir",
  "A veces no sabemos apreciar las maravillas, los pájaros, las baldosas... Unas veces son simpáticas, otras veces osas. Lo que nunca serán son vástagos de un dueño, nunca triste, siempre sueño",
  "Un descafeinado al día es como el viento. Normalmente es mejor fuera, pero los martes se queda dentro",
  "Sincronía en la sapiencia es buena equivalencia",
  "Los purés son como las monedas, a veces pierden, a veces vencen. Lo importante es que en alta estima permanecen",
  "Si la lluvia suena con eco sal corriendo, podría ser malvada pero eso se suele ir viendo",
  "Caga rapido y caga limpio",
  "Si no pones cara a tu enemigo, ella dice que será contigo",
  "Los días son efímeros como las algas, al principio son amargas pero no están hechas de polímero. Tras las tres primeras horas el martes es lunes, el miércoles viernes, pero lo más importante es que tu lo asumes",
  "Si una palabra es de naturaleza láctea, has de hacer honor a su cátedra",
  "Dicen que el mejor ataque es una buena defensa, pero nadie piensa en los que piensan. Sigue recto come alpiste, recibirás tu recompensa cuando sepas que viviste",
  "Si los días se presentan duros, piensa en una piscina de aguas verdes. Ahora quizá de otros tiempos no te acuerdes. Pero visualizando la piscina, la calma volverá seguro",
  "Dia si, dia no, la luz da vida. Es importante que lo escribas pues la ducha se fabrica así",
  "Los viernes son como las empanadillas, crujientes por fuera, rojos por dentro. Es normal tener sueño en las nubes, pero en un pestañeo tendrás el conocimiento",
  "Quien empieza con la \"a\" una risa, se nota que tiene notable prisa",
  "En tiempos de caos y estrés, no se come una tortilla, sino tres. Cierra los ojos, es menester, ábrelos y echa a correr",
  "La risa es la madre de todos los sabios",
  "Las prisas nunca son sencillas, un pájaro al vuelo, natillas. Piensa siempre con los ojos cerrados, piensa, deprisa",
  "Si un individuo ha de ampararse en la ciencia, el caos ha de abrazar. Pues los trenes de la ciencia no vuelan por los valles, son más de las cumbres de las colinas saltar",
  "Hoy es un día, para bien o para mal. Uno de todo el mundo se fía,  se rompa el hielo o gane el mal",
  "Hay personas pesadas, otras que vuelan. Sonríe y asiente, es todo lo que te queda. Cuando solo veas paredes blancas píntalas, grita alto, con amígdalas"
];

(async () => {
  await addMany('default', sentences);
})();