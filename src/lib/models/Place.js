var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index } from 'typeorm';
let Place = class Place {
    id;
    uniqId;
    name;
    numroutes;
    link;
    regionId;
    region;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", String)
], Place.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Place.prototype, "uniqId", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Place.prototype, "name", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Place.prototype, "numroutes", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Place.prototype, "link", void 0);
__decorate([
    Column(),
    Index(),
    __metadata("design:type", String)
], Place.prototype, "regionId", void 0);
__decorate([
    ManyToOne('Region', (region) => region.children),
    __metadata("design:type", Object)
], Place.prototype, "region", void 0);
Place = __decorate([
    Entity('places')
], Place);
export { Place };
// name: "Немецкий мост"
// numroutes: "<b>26</b> маршрутов"
// web_guide_link: "/ru/guides/ставрополь/немецкий мост/"
// approach: ["Нужно доехать по навигатору до адреса \"г. Ставрополь, проезд Володарского 12\", и от адреса дальше следуя по гравийке объехать Елагин пруд, подняться по дороге за ним направо и вверх в дачный кооператив. На первом перекрестке нужно повернуть налево, доехать до перекрестка с ул. Розовая (не ищите в навигаторе, она находится в другой части города). Нужно повернуть направо на улицу Розовую и ехать до конца улицы 10 минут. В конце вы выезжаете на развилку. На развилке можно повернуть налево и через 10 метров поставить машину с правой стороны дороги и идти от парковки по тропинке в лес. Отсюда до моста - 10 минут пешком. Если машина обладает повышенным дорожным просветом можно на развилке после ул. Розовой повернуть направо и ехать вдоль леса и затем в лесу. Затем на первой развилке повернуть налево вниз по гравийке, по которой нужно доехать до развилки и оставить машину там. Отсюда до моста идти влево 3 минуты."]
// info: [
//   "Мосты Армавиро-Туапсинской железной дороги, разбросанные по Ставрополью - часть до сих пор действующей железной дороги до Туапсе и дальше в Сочи.\r",
//   "Железная дорога, строившаяся более 100 лет назад на денги купцов-хлеботорговцев, после революции 1917 года была заброшена на участке Ставрополь - Армавир. За время строительства этого участа, было возведено свыше 40 мостов и виадуков через речки и глубокие овраги Ставропольской возвышенности, многие из которых сохранились до сегодняшнего дня.\r",
//   "С тех пор так и стоят, частично уже обрушившиеся \"Немецкие мосты\" - названные так потому что в строительстве принимали участие инженеры из Германии и Бельгии.\r",
//   "Самые известные мосты:\r",
//   "\"Чапаевский мост\" - высота 12 метров. Находится в черте г. Ставрополь, (Северо-Восток)\r",
//   "\"Немецкий мост\" - высота 17 метров. Находится в черте г. Ставрополь, в Мамайском лесу (Юг города).\r",
//   "\"Новокавказский мост\" - высота 22 метра. Находится в поле возле села Татарка. (15 км от г. Ставрополя)"
// ]
